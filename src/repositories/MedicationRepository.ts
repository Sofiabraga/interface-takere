import { Medication } from '../domain/models/Medication';
import { MedicationLog } from '../domain/models/MedicationLog';
import { MedicationSchedule } from '../domain/models/MedicationSchedule';

// Toda a interface é assíncrona porque a implementação
// (SupabaseMedicationRepository) faz I/O sobre o Supabase. Manter o
// acesso a dados atrás desta interface isola telas/hooks/provider dos
// detalhes do backend.
export interface MedicationRepository {
  listMedications(patientId: string): Promise<Medication[]>;
  listSchedules(patientId: string): Promise<MedicationSchedule[]>;
  listLogs(patientId: string): Promise<MedicationLog[]>;

  markAsTaken(logId: string, takenAt: string): Promise<MedicationLog | null>;
  restoreLog(log: MedicationLog): Promise<MedicationLog | null>;
}
