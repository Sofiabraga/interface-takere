import { useMemo } from 'react';
import { useMedicationContext } from '../contexts/MedicationProvider';
import { currentPatient } from '../mocks/patients.mock';
import {
  MedicationHistoryView,
  MedicationService,
} from '../services/MedicationService';

export interface UseMedicationHistoryResult {
  history: MedicationHistoryView;
}

export function useMedicationHistory(): UseMedicationHistoryResult {
  const { logs } = useMedicationContext();

  const history = useMemo(
    () => MedicationService.getMedicationHistory(currentPatient.id, logs),
    [logs],
  );

  return { history };
}
