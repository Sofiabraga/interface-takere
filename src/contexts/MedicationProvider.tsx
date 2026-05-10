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
import { Medication } from '../domain/models/Medication';
import { MedicationLog } from '../domain/models/MedicationLog';
import { MedicationSchedule } from '../domain/models/MedicationSchedule';
import { currentPatient } from '../mocks/patients.mock';
import { MedicationRepository } from '../repositories/MedicationRepository';
import { mockMedicationRepository } from '../repositories/MockMedicationRepository';

const FEEDBACK_DURATION_MS = 6000;

export interface LastTakenAction {
  logId: string;
  medicationName: string;
}

interface MedicationContextValue {
  logs: MedicationLog[];
  medications: Medication[];
  schedules: MedicationSchedule[];
  lastTaken: LastTakenAction | null;
  markAsTaken: (logId: string) => void;
  undoLastTaken: () => void;
  dismissFeedback: () => void;
}

const MedicationContext = createContext<MedicationContextValue | null>(null);

interface MedicationProviderProps {
  children: ReactNode;
  repository?: MedicationRepository;
}

// `currentPatient` is consumed here as a session stand-in; it will be replaced
// by the authenticated profile when AuthProvider is introduced (planned C16).
export function MedicationProvider({
  children,
  repository = mockMedicationRepository,
}: MedicationProviderProps) {
  const patientId = currentPatient.id;

  const [medications] = useState<Medication[]>(() =>
    repository.listMedications(patientId),
  );
  const [schedules] = useState<MedicationSchedule[]>(() =>
    repository.listSchedules(patientId),
  );
  const [logs, setLogs] = useState<MedicationLog[]>(() =>
    repository.listLogs(patientId),
  );
  const [lastTaken, setLastTaken] = useState<LastTakenAction | null>(null);

  const previousLogRef = useRef<MedicationLog | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const findMedicationName = useCallback(
    (logId: string): string | null => {
      const log = logs.find((entry) => entry.id === logId);
      if (!log) return null;
      const schedule = schedules.find((s) => s.id === log.scheduleId);
      if (!schedule) return null;
      const medication = medications.find((m) => m.id === schedule.medicationId);
      return medication?.name ?? null;
    },
    [logs, schedules, medications],
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

      const medicationName = findMedicationName(logId);
      if (!medicationName) return;

      const previous: MedicationLog = { ...target };
      const takenAt = new Date().toISOString();
      const updated = repository.markAsTaken(logId, takenAt);
      if (!updated) return;

      previousLogRef.current = previous;

      setLogs((prev) => prev.map((log) => (log.id === logId ? updated : log)));
      setLastTaken({ logId, medicationName });

      clearFeedbackTimer();
      timerRef.current = setTimeout(() => {
        setLastTaken(null);
        previousLogRef.current = null;
        timerRef.current = null;
      }, FEEDBACK_DURATION_MS);
    },
    [logs, findMedicationName, repository, clearFeedbackTimer],
  );

  const undoLastTaken = useCallback(() => {
    const previous = previousLogRef.current;
    if (!previous) return;

    const restored = repository.restoreLog(previous);
    if (!restored) return;

    setLogs((prev) => prev.map((log) => (log.id === previous.id ? restored : log)));

    previousLogRef.current = null;
    setLastTaken(null);
    clearFeedbackTimer();
  }, [repository, clearFeedbackTimer]);

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
      medications,
      schedules,
      lastTaken,
      markAsTaken,
      undoLastTaken,
      dismissFeedback,
    }),
    [
      logs,
      medications,
      schedules,
      lastTaken,
      markAsTaken,
      undoLastTaken,
      dismissFeedback,
    ],
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
