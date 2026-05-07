import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { MedicationLog } from '../domain/models/MedicationLog';
import { Patient } from '../domain/models/Patient';
import { medicationLogsMock } from '../mocks/medicationLogs.mock';
import { currentPatient } from '../mocks/patients.mock';
import { MedicationService, TodayDashboard } from '../services/MedicationService';

const FEEDBACK_DURATION_MS = 6000;

export interface LastTakenAction {
  logId: string;
  medicationName: string;
}

export interface UseTodayMedicationsResult {
  patient: Patient;
  dashboard: TodayDashboard;
  lastTaken: LastTakenAction | null;
  markAsTaken: (logId: string) => void;
  undoLastTaken: () => void;
  dismissFeedback: () => void;
}

function cloneLogs(logs: MedicationLog[]): MedicationLog[] {
  return logs.map((log) => ({ ...log }));
}

export function useTodayMedications(): UseTodayMedicationsResult {
  const [logs, setLogs] = useState<MedicationLog[]>(() => cloneLogs(medicationLogsMock));
  const [lastTaken, setLastTaken] = useState<LastTakenAction | null>(null);

  const previousLogRef = useRef<MedicationLog | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const dashboard = useMemo(
    () => MedicationService.getTodayDashboard(currentPatient.id, logs),
    [logs],
  );

  const clearFeedbackTimer = useCallback(() => {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const markAsTaken = useCallback(
    (logId: string) => {
      const target = logs.find((log) => log.id === logId);
      if (!target || target.status === 'taken') return;

      const item = dashboard.items.find((view) => view.id === logId);
      if (!item) return;

      previousLogRef.current = { ...target };

      setLogs((prev) =>
        prev.map((log) =>
          log.id === logId
            ? { ...log, status: 'taken' as const, takenAt: new Date().toISOString() }
            : log,
        ),
      );

      setLastTaken({ logId, medicationName: item.medication.name });

      clearFeedbackTimer();
      timerRef.current = setTimeout(() => {
        setLastTaken(null);
        previousLogRef.current = null;
        timerRef.current = null;
      }, FEEDBACK_DURATION_MS);
    },
    [logs, dashboard, clearFeedbackTimer],
  );

  const undoLastTaken = useCallback(() => {
    const previous = previousLogRef.current;
    if (!previous) return;

    setLogs((prev) =>
      prev.map((log) => (log.id === previous.id ? previous : log)),
    );

    previousLogRef.current = null;
    setLastTaken(null);
    clearFeedbackTimer();
  }, [clearFeedbackTimer]);

  const dismissFeedback = useCallback(() => {
    setLastTaken(null);
    previousLogRef.current = null;
    clearFeedbackTimer();
  }, [clearFeedbackTimer]);

  useEffect(() => {
    return () => clearFeedbackTimer();
  }, [clearFeedbackTimer]);

  return {
    patient: currentPatient,
    dashboard,
    lastTaken,
    markAsTaken,
    undoLastTaken,
    dismissFeedback,
  };
}
