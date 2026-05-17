import { useMemo } from 'react';
import {
  LastCorrectedAction,
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
  lastCorrected: LastCorrectedAction | null;
  actionError: string | null;
  markAsTaken: (logId: string) => Promise<void>;
  undoLastTaken: () => Promise<void>;
  correctTakenLog: (logId: string) => Promise<void>;
  dismissFeedback: () => void;
  dismissCorrected: () => void;
  dismissActionError: () => void;
}

export function useMedicationDetail(logId: string): UseMedicationDetailResult {
  const {
    logs,
    medications,
    schedules,
    lastTaken,
    lastCorrected,
    actionError,
    markAsTaken,
    undoLastTaken,
    correctTakenLog,
    dismissFeedback,
    dismissCorrected,
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
    lastCorrected,
    actionError,
    markAsTaken,
    undoLastTaken,
    correctTakenLog,
    dismissFeedback,
    dismissCorrected,
    dismissActionError,
  };
}
