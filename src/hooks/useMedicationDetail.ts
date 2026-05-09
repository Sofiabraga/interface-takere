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
  markAsTaken: (logId: string) => void;
  undoLastTaken: () => void;
}

export function useMedicationDetail(logId: string): UseMedicationDetailResult {
  const { logs, lastTaken, markAsTaken, undoLastTaken } = useMedicationContext();

  const detail = useMemo(
    () => MedicationService.getMedicationDetail(logId, logs),
    [logId, logs],
  );

  return {
    detail,
    lastTaken,
    markAsTaken,
    undoLastTaken,
  };
}
