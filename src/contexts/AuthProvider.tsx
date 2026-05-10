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

export interface SignInResult {
  ok: boolean;
}

interface AuthContextValue {
  session: Session | null;
  user: User | null;
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
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!alive) return;
      setSession(data.session);
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
      isLoading,
      authError,
      signIn,
      signOut,
      clearError,
    }),
    [session, isLoading, authError, signIn, signOut, clearError],
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
