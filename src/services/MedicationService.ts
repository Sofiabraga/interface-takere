import { MedicationStatus } from '../domain/enums/MedicationStatus';
import { Medication } from '../domain/models/Medication';
import { MedicationLog } from '../domain/models/MedicationLog';
import { MedicationSchedule } from '../domain/models/MedicationSchedule';
import { medicationSchedulesMock } from '../mocks/medicationSchedules.mock';
import { medicationsMock } from '../mocks/medications.mock';

export interface TodayMedicationView {
  id: string;
  medication: Medication;
  scheduledTime: string;
  status: MedicationStatus;
}

export interface DailySummary {
  total: number;
  taken: number;
  pending: number;
  late: number;
}

export interface TodayDashboard {
  patientId: string;
  items: TodayMedicationView[];
  next: TodayMedicationView | null;
  summary: DailySummary;
}

export interface MedicationDetailView {
  id: string;
  medication: Medication;
  scheduledTime: string;
  takenAtTime?: string;
  status: MedicationStatus;
}

export interface HistoryEntryView {
  id: string;
  medication: Medication;
  scheduledTime: string;
  takenAtTime: string;
  takenAtIso: string;
  status: MedicationStatus;
}

export interface MedicationHistoryView {
  patientId: string;
  entries: HistoryEntryView[];
  total: number;
}

function findMedication(medicationId: string): Medication | undefined {
  return medicationsMock.find((med) => med.id === medicationId);
}

function findSchedule(scheduleId: string): MedicationSchedule | undefined {
  return medicationSchedulesMock.find((sched) => sched.id === scheduleId);
}

function formatScheduledTime(iso: string): string {
  const date = new Date(iso);
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
}

function joinLog(log: MedicationLog): TodayMedicationView | null {
  const schedule = findSchedule(log.scheduleId);
  if (!schedule) return null;
  const medication = findMedication(schedule.medicationId);
  if (!medication) return null;
  return {
    id: log.id,
    medication,
    scheduledTime: formatScheduledTime(log.scheduledFor),
    status: log.status,
  };
}

function getLogsForPatient(patientId: string, logs: MedicationLog[]): MedicationLog[] {
  const patientScheduleIds = new Set(
    medicationSchedulesMock
      .filter((sched) => sched.patientId === patientId)
      .map((sched) => sched.id),
  );
  return logs.filter((log) => patientScheduleIds.has(log.scheduleId));
}

function buildSummary(items: TodayMedicationView[]): DailySummary {
  return {
    total: items.length,
    taken: items.filter((item) => item.status === 'taken').length,
    pending: items.filter((item) => item.status === 'pending').length,
    late: items.filter((item) => item.status === 'late').length,
  };
}

function pickNext(items: TodayMedicationView[]): TodayMedicationView | null {
  const late = items.find((item) => item.status === 'late');
  if (late) return late;
  const pending = items.find((item) => item.status === 'pending');
  return pending ?? null;
}

export const MedicationService = {
  getTodayDashboard(patientId: string, logs: MedicationLog[]): TodayDashboard {
    const items = getLogsForPatient(patientId, logs)
      .map(joinLog)
      .filter((view): view is TodayMedicationView => view !== null)
      .sort((a, b) => a.scheduledTime.localeCompare(b.scheduledTime));

    return {
      patientId,
      items,
      summary: buildSummary(items),
      next: pickNext(items),
    };
  },

  getMedicationDetail(
    logId: string,
    logs: MedicationLog[],
  ): MedicationDetailView | null {
    const log = logs.find((entry) => entry.id === logId);
    if (!log) return null;
    const schedule = findSchedule(log.scheduleId);
    if (!schedule) return null;
    const medication = findMedication(schedule.medicationId);
    if (!medication) return null;
    return {
      id: log.id,
      medication,
      scheduledTime: formatScheduledTime(log.scheduledFor),
      takenAtTime: log.takenAt ? formatScheduledTime(log.takenAt) : undefined,
      status: log.status,
    };
  },

  getMedicationHistory(
    patientId: string,
    logs: MedicationLog[],
  ): MedicationHistoryView {
    const entries: HistoryEntryView[] = getLogsForPatient(patientId, logs)
      .filter((log) => log.status === 'taken' && log.takenAt)
      .map((log): HistoryEntryView | null => {
        const schedule = findSchedule(log.scheduleId);
        if (!schedule) return null;
        const medication = findMedication(schedule.medicationId);
        if (!medication) return null;
        const takenAtIso = log.takenAt as string;
        return {
          id: log.id,
          medication,
          scheduledTime: formatScheduledTime(log.scheduledFor),
          takenAtTime: formatScheduledTime(takenAtIso),
          takenAtIso,
          status: log.status,
        };
      })
      .filter((entry): entry is HistoryEntryView => entry !== null)
      .sort((a, b) => b.takenAtIso.localeCompare(a.takenAtIso));

    return {
      patientId,
      entries,
      total: entries.length,
    };
  },
};
