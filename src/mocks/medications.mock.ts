import { MedicationStatus } from '../domain/enums/MedicationStatus';
import { Medication } from '../domain/models/Medication';

export interface TodayMedicationView {
  id: string;
  medication: Medication;
  time: string;
  status: MedicationStatus;
}

const losartana: Medication = {
  id: 'med-losartana',
  name: 'Losartana',
  dose: '50 mg',
  instructions: 'Tomar com água, antes do café da manhã.',
};

const metformina: Medication = {
  id: 'med-metformina',
  name: 'Metformina',
  dose: '500 mg',
  instructions: 'Tomar logo após o almoço.',
};

const sinvastatina: Medication = {
  id: 'med-sinvastatina',
  name: 'Sinvastatina',
  dose: '20 mg',
  instructions: 'Tomar à noite, antes de dormir.',
};

export const todayMedications: TodayMedicationView[] = [
  { id: 'today-1', medication: losartana, time: '08:00', status: 'taken' },
  { id: 'today-2', medication: metformina, time: '12:00', status: 'pending' },
  { id: 'today-3', medication: sinvastatina, time: '20:00', status: 'pending' },
];

export const nextMedication: TodayMedicationView = todayMedications[1];

export const todaySummary = {
  total: todayMedications.length,
  taken: todayMedications.filter((item) => item.status === 'taken').length,
  pending: todayMedications.filter((item) => item.status === 'pending').length,
};
