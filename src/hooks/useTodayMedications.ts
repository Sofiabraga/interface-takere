import { useMemo } from 'react';
import { LastTakenAction, useMedicationContext } from '../contexts/MedicationProvider';
import { Patient } from '../domain/models/Patient';
import { MedicationService, TodayDashboard } from '../services/MedicationService';
import { useCurrentPatient } from './useCurrentPatient';

export interface UseTodayMedicationsResult {
  patient: Patient | null;
  dashboard: TodayDashboard;
  lastTaken: LastTakenAction | null;
  actionError: string | null;
  markAsTaken: (logId: string) => Promise<void>;
  undoLastTaken: () => Promise<void>;
  dismissFeedback: () => void;
  dismissActionError: () => void;
}

export function useTodayMedications(): UseTodayMedicationsResult {
  const {
    patientId,
    logs,
    medications,
    schedules,
    lastTaken,
    actionError,
    markAsTaken,
    undoLastTaken,
    dismissFeedback,
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
    actionError,
    markAsTaken,
    undoLastTaken,
    dismissFeedback,
    dismissActionError,
  };
}
