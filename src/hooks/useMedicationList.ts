import { useMemo } from 'react';
import { useMedicationContext } from '../contexts/MedicationProvider';
import { MedicationStatus } from '../domain/enums/MedicationStatus';
import {
  DailySummary,
  MedicationService,
  TodayMedicationView,
} from '../services/MedicationService';

export type MedicationListFilter = 'all' | MedicationStatus;

export interface UseMedicationListResult {
  items: TodayMedicationView[];
  summary: DailySummary;
}

export function useMedicationList(
  filter: MedicationListFilter = 'all',
): UseMedicationListResult {
  const { patientId, logs, medications, schedules } = useMedicationContext();

  const dashboard = useMemo(
    () =>
      MedicationService.getTodayDashboard(patientId ?? '', {
        logs,
        schedules,
        medications,
      }),
    [patientId, logs, schedules, medications],
  );

  const items = useMemo(
    () =>
      filter === 'all'
        ? dashboard.items
        : dashboard.items.filter((item) => item.status === filter),
    [dashboard.items, filter],
  );

  return {
    items,
    summary: dashboard.summary,
  };
}
