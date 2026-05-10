import { useMemo } from 'react';
import { useMedicationContext } from '../contexts/MedicationProvider';
import {
  MedicationHistoryView,
  MedicationService,
} from '../services/MedicationService';

export interface UseMedicationHistoryResult {
  history: MedicationHistoryView;
}

export function useMedicationHistory(): UseMedicationHistoryResult {
  const { patientId, logs, medications, schedules } = useMedicationContext();

  const history = useMemo(
    () =>
      MedicationService.getMedicationHistory(patientId ?? '', {
        logs,
        schedules,
        medications,
      }),
    [patientId, logs, schedules, medications],
  );

  return { history };
}
