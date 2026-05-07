import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { MedicationLog } from '../domain/models/MedicationLog';
import { medicationLogsMock } from '../mocks/medicationLogs.mock';
import { medicationSchedulesMock } from '../mocks/medicationSchedules.mock';
import { medicationsMock } from '../mocks/medications.mock';

const FEEDBACK_DURATION_MS = 6000;

export interface LastTakenAction {
  logId: string;
  medicationName: string;
}

interface MedicationContextValue {
  logs: MedicationLog[];
  lastTaken: LastTakenAction | null;
  markAsTaken: (logId: string) => void;
  undoLastTaken: () => void;
  dismissFeedback: () => void;
}

const MedicationContext = createContext<MedicationContextValue | null>(null);

function cloneLogs(source: MedicationLog[]): MedicationLog[] {
  return source.map((log) => ({ ...log }));
}

function findMedicationName(logId: string, logs: MedicationLog[]): string | null {
  const log = logs.find((entry) => entry.id === logId);
  if (!log) return null;
  const schedule = medicationSchedulesMock.find((s) => s.id === log.scheduleId);
  if (!schedule) return null;
  const medication = medicationsMock.find((m) => m.id === schedule.medicationId);
  return medication?.name ?? null;
}

interface MedicationProviderProps {
  children: ReactNode;
}

export function MedicationProvider({ children }: MedicationProviderProps) {
  const [logs, setLogs] = useState<MedicationLog[]>(() => cloneLogs(medicationLogsMock));
  const [lastTaken, setLastTaken] = useState<LastTakenAction | null>(null);

  const previousLogRef = useRef<MedicationLog | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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

      const medicationName = findMedicationName(logId, logs);
      if (!medicationName) return;

      previousLogRef.current = { ...target };

      setLogs((prev) =>
        prev.map((log) =>
          log.id === logId
            ? { ...log, status: 'taken' as const, takenAt: new Date().toISOString() }
            : log,
        ),
      );

      setLastTaken({ logId, medicationName });

      clearFeedbackTimer();
      timerRef.current = setTimeout(() => {
        setLastTaken(null);
        previousLogRef.current = null;
        timerRef.current = null;
      }, FEEDBACK_DURATION_MS);
    },
    [logs, clearFeedbackTimer],
  );

  const undoLastTaken = useCallback(() => {
    const previous = previousLogRef.current;
    if (!previous) return;

    setLogs((prev) => prev.map((log) => (log.id === previous.id ? previous : log)));

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

  const value = useMemo<MedicationContextValue>(
    () => ({
      logs,
      lastTaken,
      markAsTaken,
      undoLastTaken,
      dismissFeedback,
    }),
    [logs, lastTaken, markAsTaken, undoLastTaken, dismissFeedback],
  );

  return (
    <MedicationContext.Provider value={value}>{children}</MedicationContext.Provider>
  );
}

export function useMedicationContext(): MedicationContextValue {
  const value = useContext(MedicationContext);
  if (!value) {
    throw new Error('useMedicationContext must be used within a MedicationProvider.');
  }
  return value;
}
