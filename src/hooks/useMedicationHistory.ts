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
  const { logs, medications, schedules } = useMedicationContext();

  const history = useMemo(
    () =>
      MedicationService.getMedicationHistory(currentPatient.id, {
        logs,
        schedules,
        medications,
      }),
    [logs, schedules, medications],
  );

  return { history };
}
