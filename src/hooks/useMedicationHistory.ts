import { useMemo } from 'react';
import { useMedicationContext } from '../contexts/MedicationProvider';
import {
  MedicationService,
  MonthlyHistoryView,
  WeeklyHistoryView,
} from '../services/MedicationService';

export interface UseMedicationHistoryResult {
  // Resumo dos últimos 30 dias agrupado em 4 "semanas" — base do card
  // principal da HistoryScreen.
  monthly: MonthlyHistoryView;
  // Resumo dos últimos 7 dias com 1 entrada por dia — alimenta a
  // seção "Medicamentos da semana" da HistoryScreen, que lista 1 card
  // por dia agendado. Reaproveita o mesmo conjunto de logs (a janela
  // do repository já cobre 30 dias).
  weekly: WeeklyHistoryView;
}

export function useMedicationHistory(): UseMedicationHistoryResult {
  const { patientId, logs, medications, schedules } = useMedicationContext();

  const data = useMemo(
    () => ({ logs, schedules, medications }),
    [logs, schedules, medications],
  );

  const monthly = useMemo(
    () => MedicationService.getMonthlyHistory(patientId ?? '', data),
    [patientId, data],
  );

  const weekly = useMemo(
    () => MedicationService.getWeeklyHistory(patientId ?? '', data),
    [patientId, data],
  );

  return { monthly, weekly };
}
