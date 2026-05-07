import { MedicationStatus } from '../enums/MedicationStatus';

export interface MedicationLog {
  id: string;
  scheduleId: string;
  scheduledFor: string;
  takenAt?: string;
  status: MedicationStatus;
}
