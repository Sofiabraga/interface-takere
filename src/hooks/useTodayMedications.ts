import { useMemo } from 'react';
import {
  LastCorrectedAction,
  LastTakenAction,
  useMedicationContext,
} from '../contexts/MedicationProvider';
import { Patient } from '../domain/models/Patient';
import { MedicationService, TodayDashboard } from '../services/MedicationService';
import { useCurrentPatient } from './useCurrentPatient';

export interface UseTodayMedicationsResult {
  patient: Patient | null;
  dashboard: TodayDashboard;
  lastTaken: LastTakenAction | null;
  lastCorrected: LastCorrectedAction | null;
  actionError: string | null;
  markAsTaken: (logId: string) => Promise<void>;
  undoLastTaken: () => Promise<void>;
  dismissFeedback: () => void;
  dismissCorrected: () => void;
  dismissActionError: () => void;
}

export function useTodayMedications(): UseTodayMedicationsResult {
  const {
    patientId,
    logs,
    medications,
    schedules,
    lastTaken,
    lastCorrected,
    actionError,
    markAsTaken,
    undoLastTaken,
    dismissFeedback,
    dismissCorrected,
    dismissActionError,
  } = useMedicationContext();
  const patient = useCurrentPatient();

  const dashboard = useMemo(
    () =>
      MedicationService.getTodayDashboard(patientId ?? '', {
        logs,
        schedules,
        medications,
      }),
    [patientId, logs, schedules, medications],
  );

  return {
    patient,
    dashboard,
    lastTaken,
    lastCorrected,
    actionError,
    markAsTaken,
    undoLastTaken,
    dismissFeedback,
    dismissCorrected,
    dismissActionError,
  };
}
