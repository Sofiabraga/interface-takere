import { Medication } from '../domain/models/Medication';
import { MedicationLog } from '../domain/models/MedicationLog';
import { MedicationSchedule } from '../domain/models/MedicationSchedule';

export interface MedicationRepository {
  listMedications(patientId: string): Medication[];
  listSchedules(patientId: string): MedicationSchedule[];
  listLogs(patientId: string): MedicationLog[];

  markAsTaken(logId: string, takenAt: string): MedicationLog | null;
  restoreLog(log: MedicationLog): MedicationLog | null;
}
