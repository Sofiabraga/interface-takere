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
const ACTION_ERROR_DURATION_MS = 6000;
const ACTION_ERROR_MESSAGE =
  'Não foi possível salvar a alteração. Tente novamente.';

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
  // Mensagem amigável, exposta pelo provider, mostrada nas telas via
  // FeedbackBanner com variant='error'. Tem prioridade sobre o
  // banner de sucesso (lastTaken) quando ambos existirem.
  actionError: string | null;
  isLoading: boolean;
  error: string | null;
  reload: () => void;
  markAsTaken: (logId: string) => Promise<void>;
  undoLastTaken: () => Promise<void>;
  dismissFeedback: () => void;
  dismissActionError: () => void;
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
  const [actionError, setActionError] = useState<string | null>(null);

  const previousLogRef = useRef<MedicationLog | null>(null);
  const feedbackTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const errorTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Cada chamada de load incrementa o token e o then/catch verifica
  // se ainda é o token corrente — assim duas trocas rápidas de
  // usuário não fazem o resultado da primeira sobrescrever a segunda.
  const loadTokenRef = useRef(0);
  // Guarda contra setState após unmount nas ações async (markAsTaken
  // e undoLastTaken). Logout durante um persist em voo desmonta o
  // provider; sem este flag o catch tentaria atualizar estado morto.
  const mountedRef = useRef(true);
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const clearFeedbackTimer = useCallback(() => {
    if (feedbackTimerRef.current !== null) {
      clearTimeout(feedbackTimerRef.current);
      feedbackTimerRef.current = null;
    }
  }, []);

  const clearActionErrorTimer = useCallback(() => {
    if (errorTimerRef.current !== null) {
      clearTimeout(errorTimerRef.current);
      errorTimerRef.current = null;
    }
  }, []);

  const armFeedbackTimer = useCallback(() => {
    clearFeedbackTimer();
    feedbackTimerRef.current = setTimeout(() => {
      if (!mountedRef.current) return;
      setLastTaken(null);
      previousLogRef.current = null;
      feedbackTimerRef.current = null;
    }, FEEDBACK_DURATION_MS);
  }, [clearFeedbackTimer]);

  const showActionError = useCallback(() => {
    setActionError(ACTION_ERROR_MESSAGE);
    clearActionErrorTimer();
    errorTimerRef.current = setTimeout(() => {
      if (!mountedRef.current) return;
      setActionError(null);
      errorTimerRef.current = null;
    }, ACTION_ERROR_DURATION_MS);
  }, [clearActionErrorTimer]);

  const clearMedicationState = useCallback(() => {
    setMedications([]);
    setSchedules([]);
    setLogs([]);
    setError(null);
    setIsLoading(false);
    setLastTaken(null);
    setActionError(null);
    previousLogRef.current = null;
    clearFeedbackTimer();
    clearActionErrorTimer();
  }, [clearFeedbackTimer, clearActionErrorTimer]);

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

  // Optimistic update + persist. Se o backend rejeitar, faz rollback
  // para o estado anterior, limpa o banner de sucesso e exibe o
  // banner de erro. Em sucesso, substitui o optimistic pelo registro
  // que voltou do banco — útil porque o servidor pode normalizar
  // taken_at (precisão de ms, fuso etc).
  const markAsTaken = useCallback(
    async (logId: string): Promise<void> => {
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
      setActionError(null);
      clearActionErrorTimer();
      armFeedbackTimer();

      try {
        const persisted = await resolvedRepository.markAsTaken(logId, takenAt);
        if (!mountedRef.current) return;
        if (!persisted) {
          throw new Error('Update retornou vazio (RLS ou id inválido).');
        }
        // Substitui optimistic pelo registro confirmado pelo banco.
        setLogs((prev) =>
          prev.map((log) => (log.id === logId ? persisted : log)),
        );
      } catch (err) {
        if (!mountedRef.current) return;
        if (__DEV__) {
          console.warn('[MedicationProvider] markAsTaken falhou', err);
        }
        // Rollback completo: estado anterior, sem banner de sucesso.
        setLogs((prev) =>
          prev.map((log) => (log.id === logId ? previous : log)),
        );
        setLastTaken(null);
        previousLogRef.current = null;
        clearFeedbackTimer();
        showActionError();
      }
    },
    [
      logs,
      findMedicationName,
      resolvedRepository,
      armFeedbackTimer,
      clearFeedbackTimer,
      clearActionErrorTimer,
      showActionError,
    ],
  );

  // "Desfazer" também é optimistic + persist. Em falha, refazemos o
  // optimistic-anterior (estado 'taken') e restauramos o banner de
  // sucesso para que o usuário tenha uma segunda chance de tentar
  // "Desfazer". O banner de erro ganha prioridade enquanto está
  // visível; quando o timer dele expira, o success banner volta a
  // aparecer (lastTaken ainda preenchido).
  const undoLastTaken = useCallback(async (): Promise<void> => {
    const previous = previousLogRef.current;
    if (!previous) return;

    const lastTakenSnapshot = lastTaken;
    // Captura o estado atual ('taken') antes do optimistic, para
    // poder reaplicá-lo em caso de erro.
    const currentTaken = logs.find((log) => log.id === previous.id);

    setLogs((prev) =>
      prev.map((log) => (log.id === previous.id ? { ...previous } : log)),
    );
    setLastTaken(null);
    clearFeedbackTimer();

    try {
      const persisted = await resolvedRepository.restoreLog(previous);
      if (!mountedRef.current) return;
      if (!persisted) {
        throw new Error('Update retornou vazio (RLS ou id inválido).');
      }
      setLogs((prev) =>
        prev.map((log) => (log.id === previous.id ? persisted : log)),
      );
      previousLogRef.current = null;
    } catch (err) {
      if (!mountedRef.current) return;
      if (__DEV__) {
        console.warn('[MedicationProvider] restoreLog falhou', err);
      }
      // Rollback do optimistic: volta para 'taken' e re-arma o
      // banner de sucesso para uma nova tentativa de Desfazer.
      if (currentTaken) {
        setLogs((prev) =>
          prev.map((log) => (log.id === previous.id ? currentTaken : log)),
        );
      }
      if (lastTakenSnapshot) {
        setLastTaken(lastTakenSnapshot);
        armFeedbackTimer();
      }
      showActionError();
    }
  }, [
    lastTaken,
    logs,
    resolvedRepository,
    clearFeedbackTimer,
    armFeedbackTimer,
    showActionError,
  ]);

  const dismissFeedback = useCallback(() => {
    setLastTaken(null);
    previousLogRef.current = null;
    clearFeedbackTimer();
  }, [clearFeedbackTimer]);

  const dismissActionError = useCallback(() => {
    clearActionErrorTimer();
    setActionError(null);
  }, [clearActionErrorTimer]);

  useEffect(() => {
    return () => {
      clearFeedbackTimer();
      clearActionErrorTimer();
    };
  }, [clearFeedbackTimer, clearActionErrorTimer]);

  const value = useMemo<MedicationContextValue>(
    () => ({
      patientId,
      logs,
      medications,
      schedules,
      lastTaken,
      actionError,
      isLoading,
      error,
      reload,
      markAsTaken,
      undoLastTaken,
      dismissFeedback,
      dismissActionError,
    }),
    [
      patientId,
      logs,
      medications,
      schedules,
      lastTaken,
      actionError,
      isLoading,
      error,
      reload,
      markAsTaken,
      undoLastTaken,
      dismissFeedback,
      dismissActionError,
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
