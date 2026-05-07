export interface MedicationSchedule {
  id: string;
  medicationId: string;
  patientId: string;
  time: string;
  frequencyHours: number;
}
