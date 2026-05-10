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
import { MedicationRepository } from '../repositories/MedicationRepository';
import { SupabaseMedicationRepository } from '../repositories/SupabaseMedicationRepository';
import { useAuth } from '../hooks/useAuth';

const FEEDBACK_DURATION_MS = 6000;

export interface LastTakenAction {
  logId: string;
  medicationName: string;
}

interface MedicationContextValue {
  patientId: string | null;
  logs: MedicationLog[];
  medications: Medication[];
  schedules: MedicationSchedule[];
  lastTaken: LastTakenAction | null;
  isLoading: boolean;
  error: string | null;
  reload: () => void;
  markAsTaken: (logId: string) => void;
  undoLastTaken: () => void;
  dismissFeedback: () => void;
}

const MedicationContext = createContext<MedicationContextValue | null>(null);

interface MedicationProviderProps {
  children: ReactNode;
  // Repository é injetável — `SupabaseMedicationRepository` é o
  // default em produção; testes/mocks podem passar
  // `mockMedicationRepository` para isolar a UI do banco.
  repository?: MedicationRepository;
}

export function MedicationProvider({
  children,
  repository,
}: MedicationProviderProps) {
  const { user } = useAuth();
  const patientId = user?.id ?? null;

  // Default em useMemo para que repository não troque de identidade a
  // cada render (caso contrário o effect de load dispararia em loop).
  const resolvedRepository = useMemo<MedicationRepository>(
    () => repository ?? new SupabaseMedicationRepository(),
    [repository],
  );

  const [medications, setMedications] = useState<Medication[]>([]);
  const [schedules, setSchedules] = useState<MedicationSchedule[]>([]);
  const [logs, setLogs] = useState<MedicationLog[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastTaken, setLastTaken] = useState<LastTakenAction | null>(null);

  const previousLogRef = useRef<MedicationLog | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Cada chamada de load incrementa o token e o then/catch verifica
  // se ainda é o token corrente — assim duas trocas rápidas de
  // usuário não fazem o resultado da primeira sobrescrever a segunda.
  const loadTokenRef = useRef(0);

  const clearMedicationState = useCallback(() => {
    setMedications([]);
    setSchedules([]);
    setLogs([]);
    setError(null);
    setIsLoading(false);
    setLastTaken(null);
    previousLogRef.current = null;
  }, []);

  const load = useCallback(
    (targetPatientId: string) => {
      const token = ++loadTokenRef.current;
      setIsLoading(true);
      setError(null);
      Promise.all([
        resolvedRepository.listMedications(targetPatientId),
        resolvedRepository.listSchedules(targetPatientId),
        resolvedRepository.listLogs(targetPatientId),
      ])
        .then(([nextMeds, nextSchedules, nextLogs]) => {
          if (token !== loadTokenRef.current) return;
          setMedications(nextMeds);
          setSchedules(nextSchedules);
          setLogs(nextLogs);
          setIsLoading(false);
        })
        .catch((err: unknown) => {
          if (token !== loadTokenRef.current) return;
          if (__DEV__) {
            console.warn('[MedicationProvider] falha ao carregar', err);
          }
          setError(
            'Não foi possível carregar seus medicamentos. ' +
              'Verifique sua internet e tente novamente.',
          );
          setIsLoading(false);
        });
    },
    [resolvedRepository],
  );

  // Recarrega ao trocar de usuário (login → load; logout → limpa). O
  // token em load() já protege contra setState pós-unmount/troca.
  useEffect(() => {
    if (!patientId) {
      // Invalida qualquer load em voo da sessão anterior.
      loadTokenRef.current += 1;
      clearMedicationState();
      return;
    }
    load(patientId);
  }, [patientId, load, clearMedicationState]);

  const reload = useCallback(() => {
    if (!patientId) return;
    load(patientId);
  }, [patientId, load]);

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

  // Optimistic update: muda o estado local imediatamente e dispara o
  // repository.markAsTaken em paralelo. Em C17, o
  // SupabaseMedicationRepository ainda não persiste — só atualiza um
  // cache interno. Em C18, o resultado real do banco deve confirmar
  // (ou reverter) a UI.
  const markAsTaken = useCallback(
    (logId: string) => {
      const target = logs.find((log) => log.id === logId);
      if (!target || target.status === 'taken') return;

      const medicationName = findMedicationName(logId);
      if (!medicationName) return;

      const previous: MedicationLog = { ...target };
      const takenAt = new Date().toISOString();
      const optimistic: MedicationLog = {
        ...target,
        status: 'taken',
        takenAt,
      };

      previousLogRef.current = previous;
      setLogs((prev) =>
        prev.map((log) => (log.id === logId ? optimistic : log)),
      );
      setLastTaken({ logId, medicationName });

      clearFeedbackTimer();
      timerRef.current = setTimeout(() => {
        setLastTaken(null);
        previousLogRef.current = null;
        timerRef.current = null;
      }, FEEDBACK_DURATION_MS);

      // Não bloqueia a UI; nesta etapa o retorno é meramente
      // informativo. C18 deve passar a checar o resultado e reverter
      // a UI em caso de erro.
      void resolvedRepository.markAsTaken(logId, takenAt);
    },
    [logs, findMedicationName, resolvedRepository, clearFeedbackTimer],
  );

  const undoLastTaken = useCallback(() => {
    const previous = previousLogRef.current;
    if (!previous) return;

    setLogs((prev) =>
      prev.map((log) => (log.id === previous.id ? { ...previous } : log)),
    );
    previousLogRef.current = null;
    setLastTaken(null);
    clearFeedbackTimer();

    void resolvedRepository.restoreLog(previous);
  }, [resolvedRepository, clearFeedbackTimer]);

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
      patientId,
      logs,
      medications,
      schedules,
      lastTaken,
      isLoading,
      error,
      reload,
      markAsTaken,
      undoLastTaken,
      dismissFeedback,
    }),
    [
      patientId,
      logs,
      medications,
      schedules,
      lastTaken,
      isLoading,
      error,
      reload,
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
