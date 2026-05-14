import { useMemo } from 'react';
import { useMedicationContext } from '../contexts/MedicationProvider';
import {
  MedicationService,
  WeeklyHistoryView,
} from '../services/MedicationService';

export interface UseMedicationHistoryResult {
  history: WeeklyHistoryView;
}

export function useMedicationHistory(): UseMedicationHistoryResult {
  const { patientId, logs, medications, schedules } = useMedicationContext();

  const history = useMemo(
    () =>
      MedicationService.getWeeklyHistory(patientId ?? '', {
        logs,
        schedules,
        medications,
      }),
    [patientId, logs, schedules, medications],
  );

  return { history };
}
