import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import type { AuthError, Session, User } from '@supabase/supabase-js';
import { supabase } from '../adapters/supabaseClient';
import { Patient } from '../domain/models/Patient';
import {
  mapProfile,
  ProfileRow,
} from '../repositories/mappers/supabaseMedicationMapper';

export interface SignInResult {
  ok: boolean;
}

interface AuthContextValue {
  session: Session | null;
  user: User | null;
  // profile vem de public.profiles e é carregado após cada mudança de
  // sessão. Fica null durante o carregamento inicial e logo após
  // signIn — o RootNavigator/MedicationGate só liberam as telas
  // protegidas quando profile passa a ser não-nulo (ou erro).
  profile: Patient | null;
  isLoading: boolean;
  authError: string | null;
  signIn: (email: string, password: string) => Promise<SignInResult>;
  signOut: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Patient | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;

    // Catch defensivo: `getSession()` lê do AsyncStorage e
    // normalmente não rejeita, mas se rejeitar (ex.: storage
    // corrompido) o isLoading ficaria preso em true e a RootNavigator
    // não sairia da tela de "Carregando…". Forçamos a transição para
    // false e tratamos como ausência de sessão.
    supabase.auth
      .getSession()
      .then(({ data }) => {
        if (!alive) return;
        setSession(data.session);
        setIsLoading(false);
      })
      .catch((err: unknown) => {
        if (!alive) return;
        if (__DEV__) {
          console.warn('[AuthProvider] getSession falhou', err);
        }
        setSession(null);
        setIsLoading(false);
      });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      if (!alive) return;
      setSession(newSession);
    });

    return () => {
      alive = false;
      subscription.unsubscribe();
    };
  }, []);

  // Quando a sessão muda, recarrega o profile do usuário autenticado.
  // Sem sessão → limpa o profile. Falha silenciosa por enquanto: se a
  // query falhar, o app trata profile=null como ainda-não-disponível e
  // o MedicationGate cobre o vazio. Ainda assim logamos no console em
  // dev para não esconder regressões.
  useEffect(() => {
    let cancelled = false;

    const userId = session?.user.id ?? null;
    if (userId === null) {
      setProfile(null);
      return () => {
        cancelled = true;
      };
    }

    void supabase
      .from('profiles')
      .select('id, display_name, age, tech_familiarity')
      .eq('id', userId)
      .single<ProfileRow>()
      .then(({ data, error }) => {
        if (cancelled) return;
        if (error || !data) {
          if (__DEV__) {
            console.warn('[AuthProvider] falha ao carregar profile', error);
          }
          setProfile(null);
          return;
        }
        setProfile(mapProfile(data));
      });

    return () => {
      cancelled = true;
    };
  }, [session?.user.id]);

  const signIn = useCallback(
    async (email: string, password: string): Promise<SignInResult> => {
      setAuthError(null);
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        setAuthError(translateAuthError(error));
        return { ok: false };
      }
      return { ok: true };
    },
    [],
  );

  const signOut = useCallback(async () => {
    setAuthError(null);
    await supabase.auth.signOut();
  }, []);

  const clearError = useCallback(() => {
    setAuthError(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      user: session?.user ?? null,
      profile,
      isLoading,
      authError,
      signIn,
      signOut,
      clearError,
    }),
    [session, profile, isLoading, authError, signIn, signOut, clearError],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext(): AuthContextValue {
  const value = useContext(AuthContext);
  if (!value) {
    throw new Error('useAuthContext must be used within an AuthProvider.');
  }
  return value;
}

function translateAuthError(error: AuthError): string {
  const message = error.message.toLowerCase();
  if (message.includes('invalid login credentials')) {
    return 'Email ou senha incorretos. Verifique e tente novamente.';
  }
  if (message.includes('email not confirmed')) {
    return 'Este email ainda não foi confirmado.';
  }
  if (message.includes('network') || message.includes('fetch')) {
    return 'Sem conexão com a internet. Verifique e tente de novo.';
  }
  return 'Não foi possível entrar agora. Tente novamente em alguns instantes.';
}
