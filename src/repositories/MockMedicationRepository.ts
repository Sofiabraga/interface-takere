import { Medication } from '../domain/models/Medication';
import { MedicationLog } from '../domain/models/MedicationLog';
import { MedicationSchedule } from '../domain/models/MedicationSchedule';
import { medicationLogsMock } from '../mocks/medicationLogs.mock';
import { medicationSchedulesMock } from '../mocks/medicationSchedules.mock';
import { medicationsMock } from '../mocks/medications.mock';
import { MedicationRepository } from './MedicationRepository';

export class MockMedicationRepository implements MedicationRepository {
  private medications: Medication[];
  private schedules: MedicationSchedule[];
  private logs: MedicationLog[];

  constructor() {
    this.medications = medicationsMock.map((m) => ({ ...m }));
    this.schedules = medicationSchedulesMock.map((s) => ({ ...s }));
    this.logs = medicationLogsMock.map((l) => ({ ...l }));
  }

  listMedications(patientId: string): Medication[] {
    const ownedMedicationIds = new Set(
      this.schedules
        .filter((s) => s.patientId === patientId)
        .map((s) => s.medicationId),
    );
    return this.medications
      .filter((m) => ownedMedicationIds.has(m.id))
      .map((m) => ({ ...m }));
  }

  listSchedules(patientId: string): MedicationSchedule[] {
    return this.schedules
      .filter((s) => s.patientId === patientId)
      .map((s) => ({ ...s }));
  }

  listLogs(patientId: string): MedicationLog[] {
    const patientScheduleIds = new Set(
      this.schedules
        .filter((s) => s.patientId === patientId)
        .map((s) => s.id),
    );
    return this.logs
      .filter((l) => patientScheduleIds.has(l.scheduleId))
      .map((l) => ({ ...l }));
  }

  markAsTaken(logId: string, takenAt: string): MedicationLog | null {
    const index = this.logs.findIndex((l) => l.id === logId);
    if (index === -1) return null;
    const updated: MedicationLog = {
      ...this.logs[index],
      status: 'taken',
      takenAt,
    };
    this.logs[index] = updated;
    return { ...updated };
  }

  restoreLog(log: MedicationLog): MedicationLog | null {
    const index = this.logs.findIndex((l) => l.id === log.id);
    if (index === -1) return null;
    const restored: MedicationLog = { ...log };
    this.logs[index] = restored;
    return { ...restored };
  }
}

export const mockMedicationRepository = new MockMedicationRepository();
