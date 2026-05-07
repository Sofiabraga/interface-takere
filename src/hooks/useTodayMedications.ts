import { useMemo } from 'react';
import { Patient } from '../domain/models/Patient';
import { currentPatient } from '../mocks/patients.mock';
import { MedicationService, TodayDashboard } from '../services/MedicationService';

export interface UseTodayMedicationsResult {
  patient: Patient;
  dashboard: TodayDashboard;
}

export function useTodayMedications(): UseTodayMedicationsResult {
  return useMemo(
    () => ({
      patient: currentPatient,
      dashboard: MedicationService.getTodayDashboard(currentPatient.id),
    }),
    [],
  );
}
