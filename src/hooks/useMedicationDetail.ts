import { useMemo } from 'react';
import {
  LastTakenAction,
  useMedicationContext,
} from '../contexts/MedicationProvider';
import {
  MedicationDetailView,
  MedicationService,
} from '../services/MedicationService';

export interface UseMedicationDetailResult {
  detail: MedicationDetailView | null;
  lastTaken: LastTakenAction | null;
  actionError: string | null;
  markAsTaken: (logId: string) => Promise<void>;
  undoLastTaken: () => Promise<void>;
  dismissActionError: () => void;
}

export function useMedicationDetail(logId: string): UseMedicationDetailResult {
  const {
    logs,
    medications,
    schedules,
    lastTaken,
    actionError,
    markAsTaken,
    undoLastTaken,
    dismissActionError,
  } = useMedicationContext();

  const detail = useMemo(
    () =>
      MedicationService.getMedicationDetail(logId, {
        logs,
        schedules,
        medications,
      }),
    [logId, logs, schedules, medications],
  );

  return {
    detail,
    lastTaken,
    actionError,
    markAsTaken,
    undoLastTaken,
    dismissActionError,
  };
}
