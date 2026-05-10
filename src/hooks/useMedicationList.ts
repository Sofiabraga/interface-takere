import { useMemo } from 'react';
import { useMedicationContext } from '../contexts/MedicationProvider';
import { MedicationStatus } from '../domain/enums/MedicationStatus';
import { currentPatient } from '../mocks/patients.mock';
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
  const { logs, medications, schedules } = useMedicationContext();

  const dashboard = useMemo(
    () =>
      MedicationService.getTodayDashboard(currentPatient.id, {
        logs,
        schedules,
        medications,
      }),
    [logs, schedules, medications],
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
