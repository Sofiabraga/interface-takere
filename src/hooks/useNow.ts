import { useEffect, useState } from 'react';

// Devolve um Date que atualiza periodicamente, alinhado à virada de
// minuto do relógio local — assim "Faltam 35 min" vira "Faltam 34 min"
// ao bater o próximo minuto cheio, e não 60s depois do mount.
//
// O intervalo padrão é 60s. Componentes que precisam de granularidade
// fina (ex.: "Em 30s") podem passar valores menores, mas no app o
// menor degrau de exibição é "min".
export function useNow(intervalMs: number = 60_000): Date {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    // Primeiro tick: alinha ao próximo minuto cheio quando intervalo
    // for múltiplo de 60s, para evitar drift cumulativo entre o
    // relógio do dispositivo e o estado do componente.
    const alignToMinute = intervalMs % 60_000 === 0;
    const msToNext = alignToMinute
      ? 60_000 - (Date.now() % 60_000)
      : intervalMs;

    const initial = setTimeout(() => {
      setNow(new Date());
      const interval = setInterval(() => setNow(new Date()), intervalMs);
      // O cleanup do useEffect captura `interval` pela closure abaixo.
      cleanupInterval = interval;
    }, msToNext);

    let cleanupInterval: ReturnType<typeof setInterval> | null = null;

    return () => {
      clearTimeout(initial);
      if (cleanupInterval) clearInterval(cleanupInterval);
    };
  }, [intervalMs]);

  return now;
}
