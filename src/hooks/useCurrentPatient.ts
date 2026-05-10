import { Patient } from '../domain/models/Patient';
import { useAuth } from './useAuth';

// Retorna o paciente correspondente ao usuário autenticado.
//
// Pode retornar null nos primeiros frames após login (enquanto o
// AuthProvider ainda está buscando o profile em public.profiles). As
// telas dentro do AppStack ficam atrás de gates (RootNavigator +
// MedicationGate) que só liberam quando profile e dados estão
// prontos, então em prática consumidores recebem sempre um Patient
// válido — mas o tipo permite null para que outros usos (ex.: log
// debug, telemetria futura) não quebrem.
export function useCurrentPatient(): Patient | null {
  const { profile } = useAuth();
  return profile;
}
