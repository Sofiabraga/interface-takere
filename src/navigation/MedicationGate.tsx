import { ReactNode } from 'react';
import { ErrorState } from '../components/ErrorState';
import { LoadingState } from '../components/LoadingState';
import { useMedicationContext } from '../contexts/MedicationProvider';
import { useAuth } from '../hooks/useAuth';

interface MedicationGateProps {
  children: ReactNode;
}

// Cobre o intervalo entre montar o MedicationProvider e a primeira
// carga do Supabase terminar. Reloads (via `reload()`) também caem
// no LoadingState — é o caminho usado pelo botão "Tentar novamente"
// após erro. Não há pull-to-refresh nesta etapa, então não há ruído
// de "spinner toda hora".
//
// O gate é separado do AppStack para que o useMedicationContext()
// rode dentro do <MedicationProvider>.
//
// **Caso "usuário sem medicamentos"** — após `isLoading=false` e
// `error=null`, mesmo com `logs.length === 0`, o gate libera as
// telas. A própria Home cuida do estado vazio ("Tudo em dia", "Não
// há medicamentos agendados para hoje"). Tratar lista vazia como
// erro seria mentir para o usuário.
export function MedicationGate({ children }: MedicationGateProps) {
  const { profile } = useAuth();
  const { isLoading, error, reload } = useMedicationContext();

  // Esperamos o profile do Auth porque a Home usa `patient.name`
  // para o "Olá, {firstName}" — se renderizássemos a Home antes,
  // veríamos um flash de "Olá, " sem nome até o profile chegar.
  if (error) {
    return (
      <ErrorState
        title="Não foi possível carregar"
        message={error}
        retryLabel="Tentar novamente"
        onRetry={reload}
      />
    );
  }

  if (isLoading || profile === null) {
    return <LoadingState message="Carregando medicamentos…" />;
  }

  return <>{children}</>;
}
