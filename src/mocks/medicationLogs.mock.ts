import { MedicationLog } from '../domain/models/MedicationLog';

function isoAt(hour: number, minute: number): string {
  const date = new Date();
  date.setHours(hour, minute, 0, 0);
  return date.toISOString();
}

export const medicationLogsMock: MedicationLog[] = [
  {
    id: 'log-omeprazol-07',
    scheduleId: 'sched-omeprazol-07',
    scheduledFor: isoAt(7, 0),
    takenAt: isoAt(7, 5),
    status: 'taken',
  },
  {
    id: 'log-losartana-08',
    scheduleId: 'sched-losartana-08',
    scheduledFor: isoAt(8, 0),
    status: 'late',
  },
  {
    id: 'log-metformina-12',
    scheduleId: 'sched-metformina-12',
    scheduledFor: isoAt(12, 0),
    status: 'pending',
  },
  {
    id: 'log-sinvastatina-22',
    scheduleId: 'sched-sinvastatina-22',
    scheduledFor: isoAt(22, 0),
    status: 'pending',
  },
];
