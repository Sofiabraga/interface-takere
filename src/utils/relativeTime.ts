// Formatação relativa de tempo em PT-BR para comparar horário previsto
// e horário atual do dispositivo. Função pura — recebe ISO + Date e
// devolve label + "tense" (futuro/agora/passado) para o componente
// escolher cor.
//
// Granularidade: minutos. Abaixo de 1 min consideramos "agora" — útil
// para a transição suave entre "Em 1 min" e "Atrasado 1 min".
//
// Decisões de copy:
//   - "Faltam X" (futuro) em vez de "Em X" — mais próximo ao tom
//     coloquial pedido pelo projeto, e enfatiza a janela ainda
//     disponível para tomar.
//   - "Atrasado em X" (passado) usa o verbo já usado no status badge,
//     mantendo o vocabulário consistente.
//   - "Está na hora" para diff < 60s, evitando "Em 0 min" / "há 0 min".

export type RelativeTense = 'future' | 'now' | 'past';

export interface RelativeTimeResult {
  label: string;
  tense: RelativeTense;
}

export function formatRelativeTime(
  scheduledIso: string,
  now: Date,
): RelativeTimeResult {
  const scheduled = new Date(scheduledIso).getTime();
  const diffMs = scheduled - now.getTime();
  const absMs = Math.abs(diffMs);

  if (absMs < 60_000) {
    return { label: 'Está na hora', tense: 'now' };
  }

  const totalMinutes = Math.floor(absMs / 60_000);
  const magnitude = formatMagnitude(totalMinutes);

  if (diffMs > 0) {
    return { label: `Faltam ${magnitude}`, tense: 'future' };
  }
  return { label: `Atrasado em ${magnitude}`, tense: 'past' };
}

function formatMagnitude(totalMinutes: number): string {
  if (totalMinutes < 60) {
    return `${totalMinutes} min`;
  }
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (minutes === 0) {
    return hours === 1 ? '1 hora' : `${hours} horas`;
  }
  return `${hours}h ${minutes}min`;
}
