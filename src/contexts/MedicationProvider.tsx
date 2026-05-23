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

// Feedback exibido após "Corrigir registro" — banner verde discreto,
// sem botão "Desfazer". A confirmação prévia via Alert na tela de
// Detail já protege contra acidente; expor undo aqui criaria
// correção-em-cascata sem ganho real (o usuário pode simplesmente
// marcar como tomado de novo). Linguagem: "corrigido" em vez de
// "removido" — o registro não é destruído, volta ao status anterior.
export interface LastCorrectedAction {
  medicationName: string;
}

interface MedicationContextValue {
  patientId: string | null;
  logs: MedicationLog[];
  medications: Medication[];
  schedules: MedicationSchedule[];
  lastTaken: LastTakenAction | null;
  lastCorrected: LastCorrectedAction | null;
  // Mensagem amigável, exposta pelo provider, mostrada nas telas via
  // FeedbackBanner com variant='error'. Tem prioridade sobre o
  // banner de sucesso (lastTaken/lastCorrected) quando ambos existirem.
  actionError: string | null;
  isLoading: boolean;
  error: string | null;
  reload: () => void;
  markAsTaken: (logId: string) => Promise<void>;
  undoLastTaken: () => Promise<void>;
  // Reverte um log já 'taken' para 'pending'/'late' (calculado por
  // scheduledFor vs agora) e limpa takenAt. Confirmação fica na tela.
  correctTakenLog: (logId: string) => Promise<void>;
  dismissFeedback: () => void;
  dismissCorrected: () => void;
  dismissActionError: () => void;
}

const MedicationContext = createContext<MedicationContextValue | null>(null);

interface MedicationProviderProps {
  children: ReactNode;
}

export function MedicationProvider({ children }: MedicationProviderProps) {
  const { user } = useAuth();
  const patientId = user?.id ?? null;

  // Instância única do repositório, memoizada para não trocar de
  // identidade a cada render (caso contrário o effect de load
  // dispararia em loop).
  const resolvedRepository = useMemo<MedicationRepository>(
    () => new SupabaseMedicationRepository(),
    [],
  );

  const [medications, setMedications] = useState<Medication[]>([]);
  const [schedules, setSchedules] = useState<MedicationSchedule[]>([]);
  const [logs, setLogs] = useState<MedicationLog[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastTaken, setLastTaken] = useState<LastTakenAction | null>(null);
  const [lastCorrected, setLastCorrected] = useState<LastCorrectedAction | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const previousLogRef = useRef<MedicationLog | null>(null);
  const feedbackTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const correctedTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const errorTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Cada chamada de load incrementa o token e o then/catch verifica
  // se ainda é o token corrente — assim duas trocas rápidas de
  // usuário não fazem o resultado da primeira sobrescrever a segunda.
  const loadTokenRef = useRef(0);
  // Guarda contra setState após unmount nas ações async (markAsTaken
  // e undoLastTaken). Logout durante um persist em voo desmonta o
  // provider; sem este flag o catch tentaria atualizar estado morto.
  const mountedRef = useRef(true);
  // Serializa operações por logId. Resolve dois problemas:
  //   (a) duplo-toque rápido em "Marcar como tomado" — silenciosamente
  //       descartado (a segunda tap volta de imediato porque a
  //       primeira ainda está em voo);
  //   (b) "Desfazer" enquanto o markAsTaken ainda está persistindo —
  //       o undo aguarda a primeira op terminar antes de disparar a
  //       segunda; sem isso, o undo poderia chegar ANTES do mark no
  //       banco e o estado final ficaria 'taken' (inconsistência
  //       permanente).
  // O usuário não precisa enxergar isso — não há "Salvando…" no
  // botão; o feedback do optimistic update já comunica que o tap
  // teve efeito. Em casos extremos (rede ruim), o tap em Desfazer
  // pode demorar até o mark terminar antes de aparecer.
  const ongoingOpsRef = useRef(new Map<string, Promise<void>>());
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

  const clearCorrectedTimer = useCallback(() => {
    if (correctedTimerRef.current !== null) {
      clearTimeout(correctedTimerRef.current);
      correctedTimerRef.current = null;
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

  const armCorrectedTimer = useCallback(() => {
    clearCorrectedTimer();
    correctedTimerRef.current = setTimeout(() => {
      if (!mountedRef.current) return;
      setLastCorrected(null);
      correctedTimerRef.current = null;
    }, FEEDBACK_DURATION_MS);
  }, [clearCorrectedTimer]);

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
    setLastCorrected(null);
    setActionError(null);
    previousLogRef.current = null;
    ongoingOpsRef.current.clear();
    clearFeedbackTimer();
    clearCorrectedTimer();
    clearActionErrorTimer();
  }, [clearFeedbackTimer, clearCorrectedTimer, clearActionErrorTimer]);

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

  // Registra a Promise da op atual no Map e remove ao terminar.
  // Outras chamadas em sequência usam o mesmo Map para esperar/dedup.
  const trackOp = useCallback((logId: string, op: Promise<void>) => {
    ongoingOpsRef.current.set(logId, op);
    void op.finally(() => {
      if (ongoingOpsRef.current.get(logId) === op) {
        ongoingOpsRef.current.delete(logId);
      }
    });
  }, []);

  // Optimistic update + persist. Se o backend rejeitar, faz rollback
  // para o estado anterior, limpa o banner de sucesso e exibe o
  // banner de erro. Em sucesso, substitui o optimistic pelo registro
  // que voltou do banco — útil porque o servidor pode normalizar
  // taken_at (precisão de ms, fuso etc).
  const markAsTaken = useCallback(
    async (logId: string): Promise<void> => {
      // Dedup: outro mark para o mesmo logId ainda está em voo.
      if (ongoingOpsRef.current.has(logId)) return;

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
      // Marcar como tomado anula um feedback de correção anterior —
      // os dois banners verdes não devem competir pelo mesmo slot.
      setLastCorrected(null);
      clearCorrectedTimer();
      setActionError(null);
      clearActionErrorTimer();
      armFeedbackTimer();

      const op = (async () => {
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
      })();

      trackOp(logId, op);
      await op;
    },
    [
      logs,
      findMedicationName,
      resolvedRepository,
      armFeedbackTimer,
      clearFeedbackTimer,
      clearCorrectedTimer,
      clearActionErrorTimer,
      showActionError,
      trackOp,
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

    // Aguarda o mark (ou um undo anterior) terminar antes de disparar
    // este undo — evita race onde o undo chega no banco antes do mark
    // e o estado final fica errado. catch(()=>{}) garante que mesmo
    // se a op anterior falhou, este undo segue (sobre a base do
    // estado já rebobinado pelo rollback do mark).
    const prior = ongoingOpsRef.current.get(previous.id);
    if (prior) {
      await prior.catch(() => undefined);
      if (!mountedRef.current) return;
      // Após esperar, re-checamos: se o mark falhou e o rollback
      // limpou previousLogRef, não temos mais para onde desfazer.
      const stillPrevious = previousLogRef.current;
      if (!stillPrevious || stillPrevious.id !== previous.id) return;
    }

    const lastTakenSnapshot = lastTaken;
    // Captura o estado atual ('taken') antes do optimistic, para
    // poder reaplicá-lo em caso de erro.
    const currentTaken = logs.find((log) => log.id === previous.id);

    setLogs((prev) =>
      prev.map((log) => (log.id === previous.id ? { ...previous } : log)),
    );
    setLastTaken(null);
    clearFeedbackTimer();

    const op = (async () => {
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
    })();

    trackOp(previous.id, op);
    await op;
  }, [
    lastTaken,
    logs,
    resolvedRepository,
    clearFeedbackTimer,
    armFeedbackTimer,
    showActionError,
    trackOp,
  ]);

  // "Corrigir registro" — voltar um log já 'taken' para 'pending' ou
  // 'late' (de acordo com scheduledFor vs agora), limpando takenAt.
  // Diferente de undoLastTaken, que só atua sobre o ÚLTIMO mark via
  // previousLogRef, esta ação aceita qualquer log 'taken' do dia.
  //
  // Optimistic + persist + rollback, mesmo padrão de markAsTaken. O
  // banner de sucesso é separado (lastCorrected) e não traz Desfazer
  // — a confirmação prévia via Alert na tela já protege, e oferecer
  // "Desfazer da correção" criaria correção em cascata sem ganho real
  // (o usuário pode tocar "Marcar como tomado" de novo).
  const correctTakenLog = useCallback(
    async (logId: string): Promise<void> => {
      // Dedup contra mark/undo/correct em voo para o mesmo log.
      if (ongoingOpsRef.current.has(logId)) return;

      const target = logs.find((log) => log.id === logId);
      if (!target || target.status !== 'taken') return;

      const medicationName = findMedicationName(logId);
      if (!medicationName) return;

      const previous: MedicationLog = { ...target };
      // Recalcula em tempo real: se o horário previsto já passou,
      // volta como 'late'; se ainda não chegou, volta como 'pending'.
      const scheduledMs = new Date(target.scheduledFor).getTime();
      const recomputedStatus: MedicationLog['status'] =
        scheduledMs <= Date.now() ? 'late' : 'pending';
      const optimistic: MedicationLog = {
        ...target,
        status: recomputedStatus,
        takenAt: undefined,
      };

      setLogs((prev) =>
        prev.map((log) => (log.id === logId ? optimistic : log)),
      );
      // Limpa qualquer feedback anterior conflitante.
      setLastTaken(null);
      previousLogRef.current = null;
      clearFeedbackTimer();
      setActionError(null);
      clearActionErrorTimer();
      setLastCorrected({ medicationName });
      armCorrectedTimer();

      const op = (async () => {
        try {
          const persisted = await resolvedRepository.restoreLog(optimistic);
          if (!mountedRef.current) return;
          if (!persisted) {
            throw new Error('Update retornou vazio (RLS ou id inválido).');
          }
          setLogs((prev) =>
            prev.map((log) => (log.id === logId ? persisted : log)),
          );
        } catch (err) {
          if (!mountedRef.current) return;
          if (__DEV__) {
            console.warn('[MedicationProvider] correctTakenLog falhou', err);
          }
          setLogs((prev) =>
            prev.map((log) => (log.id === logId ? previous : log)),
          );
          setLastCorrected(null);
          clearCorrectedTimer();
          showActionError();
        }
      })();

      trackOp(logId, op);
      await op;
    },
    [
      logs,
      findMedicationName,
      resolvedRepository,
      armCorrectedTimer,
      clearCorrectedTimer,
      clearFeedbackTimer,
      clearActionErrorTimer,
      showActionError,
      trackOp,
    ],
  );

  const dismissFeedback = useCallback(() => {
    setLastTaken(null);
    previousLogRef.current = null;
    clearFeedbackTimer();
  }, [clearFeedbackTimer]);

  const dismissCorrected = useCallback(() => {
    setLastCorrected(null);
    clearCorrectedTimer();
  }, [clearCorrectedTimer]);

  const dismissActionError = useCallback(() => {
    clearActionErrorTimer();
    setActionError(null);
  }, [clearActionErrorTimer]);

  useEffect(() => {
    return () => {
      clearFeedbackTimer();
      clearCorrectedTimer();
      clearActionErrorTimer();
    };
  }, [clearFeedbackTimer, clearCorrectedTimer, clearActionErrorTimer]);

  const value = useMemo<MedicationContextValue>(
    () => ({
      patientId,
      logs,
      medications,
      schedules,
      lastTaken,
      lastCorrected,
      actionError,
      isLoading,
      error,
      reload,
      markAsTaken,
      undoLastTaken,
      correctTakenLog,
      dismissFeedback,
      dismissCorrected,
      dismissActionError,
    }),
    [
      patientId,
      logs,
      medications,
      schedules,
      lastTaken,
      lastCorrected,
      actionError,
      isLoading,
      error,
      reload,
      markAsTaken,
      undoLastTaken,
      correctTakenLog,
      dismissFeedback,
      dismissCorrected,
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
