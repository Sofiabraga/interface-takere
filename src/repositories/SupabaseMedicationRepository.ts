import type { SupabaseClient } from '@supabase/supabase-js';
import { supabase } from '../adapters/supabaseClient';
import { Medication } from '../domain/models/Medication';
import { MedicationLog } from '../domain/models/MedicationLog';
import { MedicationSchedule } from '../domain/models/MedicationSchedule';
import { MedicationRepository } from './MedicationRepository';
import {
  MedicationLogRow,
  MedicationRow,
  MedicationScheduleRow,
  mapLog,
  mapMedication,
  mapSchedule,
} from './mappers/supabaseMedicationMapper';

const LOG_COLUMNS = 'id, schedule_id, scheduled_for, status, taken_at';

// Janela de 30 dias (hoje + 29 anteriores) usada para alimentar a
// Home (que filtra para "hoje" no service), a visão semanal e o
// resumo mensal da HistoryScreen. Calculada em horário local do
// dispositivo e enviada como ISO em UTC ao Postgres — o que conta é
// que a fronteira "início do dia local" seja a mesma em ambos os lados.
//
// Trade-off: puxar 30 dias é ~4× mais bytes que a janela antiga de 7,
// mas para o cenário demo (≤ 4 medicamentos × 30 dias = 120 logs por
// usuário) ainda é trivial. Caso real precisaria de paginação por dia
// ou de uma RPC dedicada a resumos.
function getMonthWindowStartIso(): string {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  start.setDate(start.getDate() - 29);
  return start.toISOString();
}

// Implementação Supabase do MedicationRepository — leitura e escrita
// reais. A C17 mantinha um logsCache local em markAsTaken/restoreLog
// porque a persistência ainda não existia; em C18 esse cache foi
// removido e o Supabase volta a ser a única fonte de verdade.
//
// As queries dependem das policies de RLS para isolamento entre
// usuários: a sessão autenticada do supabase-js carrega o JWT e o
// banco filtra por auth.uid(). Não passamos a service_role aqui.
export class SupabaseMedicationRepository implements MedicationRepository {
  constructor(private readonly client: SupabaseClient = supabase) {}

  async listMedications(patientId: string): Promise<Medication[]> {
    const { data, error } = await this.client
      .from('medications')
      .select('id, name, dose, instructions')
      .eq('profile_id', patientId)
      .order('name', { ascending: true })
      .returns<MedicationRow[]>();

    if (error) {
      throw new Error(`Falha ao carregar medicamentos: ${error.message}`);
    }
    return (data ?? []).map(mapMedication);
  }

  async listSchedules(patientId: string): Promise<MedicationSchedule[]> {
    // medication_schedules não tem profile_id; a RLS filtra por
    // ownership via medication.profile_id. O `medications!inner`
    // garante que vem só schedules cuja medication pertence ao
    // usuário, e o .eq fecha contra o id passado (defesa em
    // profundidade — RLS já o faria).
    const { data, error } = await this.client
      .from('medication_schedules')
      .select('id, medication_id, time_of_day, medications!inner(profile_id)')
      .eq('medications.profile_id', patientId)
      .order('time_of_day', { ascending: true })
      .returns<MedicationScheduleRow[]>();

    if (error) {
      throw new Error(`Falha ao carregar horários: ${error.message}`);
    }
    return (data ?? []).map((row) => mapSchedule(row, patientId));
  }

  async listLogs(patientId: string): Promise<MedicationLog[]> {
    // Mesma lógica de RLS transitiva: medication_logs → schedule →
    // medication.profile_id. Filtramos pelo profile_id do dono via
    // join aninhado.
    //
    // O `gte('scheduled_for', ...)` recorta a janela para os últimos
    // 30 dias — o suficiente para o resumo mensal da HistoryScreen
    // (e, por sobreposição, para a visão semanal de 7 dias e para a
    // Home, que filtram períodos menores dentro do mesmo conjunto no
    // MedicationService).
    const { data, error } = await this.client
      .from('medication_logs')
      .select(
        `${LOG_COLUMNS}, medication_schedules!inner(medications!inner(profile_id))`,
      )
      .eq('medication_schedules.medications.profile_id', patientId)
      .gte('scheduled_for', getMonthWindowStartIso())
      .order('scheduled_for', { ascending: true })
      .returns<MedicationLogRow[]>();

    if (error) {
      throw new Error(`Falha ao carregar registros do mês: ${error.message}`);
    }
    return (data ?? []).map(mapLog);
  }

  // Persistência real: update em medication_logs com status='taken'
  // e taken_at preenchido. A constraint medication_logs_taken_consistency
  // exige os dois juntos, e setamos ambos no mesmo update.
  //
  // RLS: a policy "logs update own" só deixa atualizar logs cujo
  // schedule pertence a uma medication do usuário autenticado. Se a
  // policy bloquear (ex.: tentar marcar log de outro usuário), o
  // supabase-js retorna `data: []` sem erro — por isso o `.single()`,
  // que materializa essa situação como PGRST116 e cai no catch.
  async markAsTaken(logId: string, takenAt: string): Promise<MedicationLog | null> {
    const { data, error } = await this.client
      .from('medication_logs')
      .update({ status: 'taken', taken_at: takenAt })
      .eq('id', logId)
      .select(LOG_COLUMNS)
      .single<MedicationLogRow>();

    if (error) {
      throw new Error(`Falha ao salvar tomada: ${error.message}`);
    }
    return data ? mapLog(data) : null;
  }

  // Restaura status + taken_at exatamente como estavam antes.
  // O provider passa o snapshot anterior (capturado antes do
  // optimistic update), então aqui só repassamos os campos para o
  // banco. Quando o anterior era pending/late, takenAt vem undefined
  // e gravamos null para satisfazer a check constraint.
  async restoreLog(log: MedicationLog): Promise<MedicationLog | null> {
    const { data, error } = await this.client
      .from('medication_logs')
      .update({
        status: log.status,
        taken_at: log.takenAt ?? null,
      })
      .eq('id', log.id)
      .select(LOG_COLUMNS)
      .single<MedicationLogRow>();

    if (error) {
      throw new Error(`Falha ao desfazer tomada: ${error.message}`);
    }
    return data ? mapLog(data) : null;
  }
}
