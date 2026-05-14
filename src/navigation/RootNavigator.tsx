import { LoadingState } from '../components/LoadingState';
import { useAuth } from '../hooks/useAuth';
import { AppStack } from './AppStack';
import { AuthStack } from './AuthStack';

export function RootNavigator() {
  const { session, isLoading } = useAuth();

  // Enquanto a sessão é restaurada do AsyncStorage usamos o mesmo
  // LoadingState que o MedicationGate renderiza — assim o usuário vê
  // uma transição contínua "Carregando…" → "Carregando medicamentos…"
  // em vez de uma troca brusca entre um spinner pelado e o gate.
  if (isLoading) {
    return <LoadingState message="Carregando…" />;
  }

  return session ? <AppStack /> : <AuthStack />;
}
