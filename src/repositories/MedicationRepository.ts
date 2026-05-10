import { Medication } from '../domain/models/Medication';
import { MedicationLog } from '../domain/models/MedicationLog';
import { MedicationSchedule } from '../domain/models/MedicationSchedule';

// Toda a interface é assíncrona porque a implementação canônica
// (SupabaseMedicationRepository) faz I/O. O MockMedicationRepository
// envolve os retornos em Promise.resolve para manter o mesmo contrato
// — assim trocar de implementação não exige mudar telas/hooks/provider.
export interface MedicationRepository {
  listMedications(patientId: string): Promise<Medication[]>;
  listSchedules(patientId: string): Promise<MedicationSchedule[]>;
  listLogs(patientId: string): Promise<MedicationLog[]>;

  markAsTaken(logId: string, takenAt: string): Promise<MedicationLog | null>;
  restoreLog(log: MedicationLog): Promise<MedicationLog | null>;
}
