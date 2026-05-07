import { MedicationSchedule } from '../domain/models/MedicationSchedule';
import { mariaSilva } from './patients.mock';

export const medicationSchedulesMock: MedicationSchedule[] = [
  {
    id: 'sched-omeprazol-07',
    medicationId: 'med-omeprazol',
    patientId: mariaSilva.id,
    time: '07:00',
    frequencyHours: 24,
  },
  {
    id: 'sched-losartana-08',
    medicationId: 'med-losartana',
    patientId: mariaSilva.id,
    time: '08:00',
    frequencyHours: 24,
  },
  {
    id: 'sched-metformina-12',
    medicationId: 'med-metformina',
    patientId: mariaSilva.id,
    time: '12:00',
    frequencyHours: 12,
  },
  {
    id: 'sched-sinvastatina-22',
    medicationId: 'med-sinvastatina',
    patientId: mariaSilva.id,
    time: '22:00',
    frequencyHours: 24,
  },
];
