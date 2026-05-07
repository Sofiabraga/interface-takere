import { Medication } from '../domain/models/Medication';

export const medicationsMock: Medication[] = [
  {
    id: 'med-omeprazol',
    name: 'Omeprazol',
    dose: '20 mg',
    instructions: 'Tomar em jejum, 30 minutos antes do café da manhã.',
  },
  {
    id: 'med-losartana',
    name: 'Losartana',
    dose: '50 mg',
    instructions: 'Tomar com água, durante o café da manhã.',
  },
  {
    id: 'med-metformina',
    name: 'Metformina',
    dose: '500 mg',
    instructions: 'Tomar logo após o almoço.',
  },
  {
    id: 'med-sinvastatina',
    name: 'Sinvastatina',
    dose: '20 mg',
    instructions: 'Tomar à noite, antes de dormir.',
  },
];
