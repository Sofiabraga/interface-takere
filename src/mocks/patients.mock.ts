import { Patient } from '../domain/models/Patient';

export const mariaSilva: Patient = {
  id: 'patient-maria-silva',
  name: 'Maria Silva',
  age: 68,
  techFamiliarity: 'low',
};

export const patientsMock: Patient[] = [mariaSilva];

export const currentPatient: Patient = mariaSilva;
