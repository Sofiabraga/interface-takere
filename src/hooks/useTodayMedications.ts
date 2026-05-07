import { useMemo } from 'react';
import { LastTakenAction, useMedicationContext } from '../contexts/MedicationProvider';
import { Patient } from '../domain/models/Patient';
import { currentPatient } from '../mocks/patients.mock';
import { MedicationService, TodayDashboard } from '../services/MedicationService';

export interface UseTodayMedicationsResult {
  patient: Patient;
  dashboard: TodayDashboard;
  lastTaken: LastTakenAction | null;
  markAsTaken: (logId: string) => void;
  undoLastTaken: () => void;
  dismissFeedback: () => void;
}

export function useTodayMedications(): UseTodayMedicationsResult {
  const { logs, lastTaken, markAsTaken, undoLastTaken, dismissFeedback } =
    useMedicationContext();

  const dashboard = useMemo(
    () => MedicationService.getTodayDashboard(currentPatient.id, logs),
    [logs],
  );

  return {
    patient: currentPatient,
    dashboard,
    lastTaken,
    markAsTaken,
    undoLastTaken,
    dismissFeedback,
  };
}
