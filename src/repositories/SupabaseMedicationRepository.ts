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

// Implementação Supabase do MedicationRepository — leitura only nesta
// etapa (C17). Persistência de "marcar como tomado" e "desfazer" fica
// para a C18; até lá, markAsTaken/restoreLog operam num cache interno
// populado por listLogs, mantendo o mesmo contrato do MockRepository
// para que provider/hooks/telas não precisem se preocupar com a fonte.
//
// As queries dependem das policies de RLS para isolamento entre
// usuários: a sessão autenticada do supabase-js carrega o JWT e o
// banco filtra por auth.uid(). Não passamos a service_role aqui, e
// nem precisaríamos.
export class SupabaseMedicationRepository implements MedicationRepository {
  private logsCache: MedicationLog[] = [];

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
    const { data, error } = await this.client
      .from('medication_logs')
      .select(
        'id, schedule_id, scheduled_for, status, taken_at, ' +
          'medication_schedules!inner(medications!inner(profile_id))',
      )
      .eq('medication_schedules.medications.profile_id', patientId)
      .order('scheduled_for', { ascending: true })
      .returns<MedicationLogRow[]>();

    if (error) {
      throw new Error(`Falha ao carregar registros do dia: ${error.message}`);
    }

    const logs = (data ?? []).map(mapLog);
    // Preenche o cache local — markAsTaken/restoreLog precisam dele
    // até a C18. Clonamos para que mutações futuras não vazem.
    this.logsCache = logs.map((log) => ({ ...log }));
    return logs;
  }

  // C17: NÃO persiste no Supabase. Atualiza apenas o cache local para
  // que o provider continue funcionando como antes. C18 substitui o
  // corpo deste método por um upsert/update real em medication_logs.
  async markAsTaken(logId: string, takenAt: string): Promise<MedicationLog | null> {
    const index = this.logsCache.findIndex((l) => l.id === logId);
    if (index === -1) return null;
    const updated: MedicationLog = {
      ...this.logsCache[index],
      status: 'taken',
      takenAt,
    };
    this.logsCache[index] = updated;
    return { ...updated };
  }

  // C17: igual ao markAsTaken — só altera o cache. Em C18, o corpo
  // vira um update revertendo status/taken_at no banco.
  async restoreLog(log: MedicationLog): Promise<MedicationLog | null> {
    const index = this.logsCache.findIndex((l) => l.id === log.id);
    if (index === -1) return null;
    const restored: MedicationLog = { ...log };
    this.logsCache[index] = restored;
    return { ...restored };
  }
}
