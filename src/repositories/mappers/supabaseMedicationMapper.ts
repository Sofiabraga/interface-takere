import { MedicationStatus } from '../../domain/enums/MedicationStatus';
import { TechFamiliarity } from '../../domain/enums/TechFamiliarity';
import { Medication } from '../../domain/models/Medication';
import { MedicationLog } from '../../domain/models/MedicationLog';
import { MedicationSchedule } from '../../domain/models/MedicationSchedule';
import { Patient } from '../../domain/models/Patient';

// Linhas cruas como o supabase-js as devolve. Mantemos os nomes em
// snake_case aqui (e só aqui) para deixar claro que é o limite entre o
// modelo de banco e o domínio do app.
export interface ProfileRow {
  id: string;
  display_name: string;
  age: number | null;
  tech_familiarity: TechFamiliarity | null;
}

export interface MedicationRow {
  id: string;
  name: string;
  dose: string;
  instructions: string | null;
}

export interface MedicationScheduleRow {
  id: string;
  medication_id: string;
  // PostgreSQL `time` chega como 'HH:MM:SS' via supabase-js.
  time_of_day: string;
}

export interface MedicationLogRow {
  id: string;
  schedule_id: string;
  scheduled_for: string;
  status: MedicationStatus;
  taken_at: string | null;
}

// Domínio assume Patient.age e Patient.techFamiliarity como obrigatórios.
// O DB permite null nessas colunas, então o mapper aplica defaults seguros
// (0 / 'low'). Para os 3 perfis demo o seed sempre preenche os dois
// campos, então na prática esses defaults não são exercitados — mas
// existem para tipar honestamente o caso de profile parcial.
export function mapProfile(row: ProfileRow): Patient {
  return {
    id: row.id,
    name: row.display_name,
    age: row.age ?? 0,
    techFamiliarity: row.tech_familiarity ?? 'low',
  };
}

export function mapMedication(row: MedicationRow): Medication {
  return {
    id: row.id,
    name: row.name,
    dose: row.dose,
    instructions: row.instructions ?? undefined,
  };
}

// `patientId` vem de fora porque a tabela medication_schedules não
// armazena profile_id diretamente — a associação é via medication.
// Como a query usada para listar schedules já é restrita ao usuário
// autenticado (RLS + filtro explícito por profile_id na medication
// pai), todas as schedules retornadas pertencem ao mesmo paciente, e
// dá pra repassar o mesmo id para todas.
//
// `frequencyHours` é mantido no domínio mas não é colunizado no banco
// (o schema atual modela horários como linhas separadas em
// medication_schedules, não como uma frequência derivada). Default 24
// preserva o contrato sem inventar dados.
export function mapSchedule(
  row: MedicationScheduleRow,
  patientId: string,
): MedicationSchedule {
  return {
    id: row.id,
    medicationId: row.medication_id,
    patientId,
    time: trimSeconds(row.time_of_day),
    frequencyHours: 24,
  };
}

export function mapLog(row: MedicationLogRow): MedicationLog {
  return {
    id: row.id,
    scheduleId: row.schedule_id,
    scheduledFor: row.scheduled_for,
    status: row.status,
    takenAt: row.taken_at ?? undefined,
  };
}

// 'HH:MM:SS' → 'HH:MM'. `MedicationSchedule.time` é exibido como
// 'HH:MM' nos componentes; o segundo do tipo `time` do Postgres é
// descartado.
function trimSeconds(time: string): string {
  return time.length >= 5 ? time.slice(0, 5) : time;
}
