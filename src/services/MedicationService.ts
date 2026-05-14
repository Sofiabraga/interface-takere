import { MedicationStatus } from '../domain/enums/MedicationStatus';
import { Medication } from '../domain/models/Medication';
import { MedicationLog } from '../domain/models/MedicationLog';
import { MedicationSchedule } from '../domain/models/MedicationSchedule';

export interface MedicationData {
  logs: MedicationLog[];
  schedules: MedicationSchedule[];
  medications: Medication[];
}

export interface TodayMedicationView {
  id: string;
  medication: Medication;
  scheduledTime: string;
  status: MedicationStatus;
}

export interface DailySummary {
  total: number;
  taken: number;
  pending: number;
  late: number;
}

export interface TodayDashboard {
  patientId: string;
  items: TodayMedicationView[];
  next: TodayMedicationView | null;
  summary: DailySummary;
}

export interface MedicationDetailView {
  id: string;
  medication: Medication;
  scheduledTime: string;
  takenAtTime?: string;
  status: MedicationStatus;
}

export interface HistoryEntryView {
  id: string;
  medication: Medication;
  scheduledTime: string;
  takenAtTime: string;
  takenAtIso: string;
  status: MedicationStatus;
}

// Resumo de um único dia da semana. `percent` é null quando não há
// medicamentos previstos naquele dia — a UI traduz isso para "Sem
// medicamentos previstos" em vez de exibir 0%, que pareceria um
// resultado negativo.
export interface WeeklyDaySummaryView {
  isoDate: string;        // 'YYYY-MM-DD' em horário local do dispositivo
  weekdayLabel: string;   // 'Hoje' | 'Ontem' | 'Segunda' ... 'Domingo'
  dateLabel: string;      // 'DD/MM'
  planned: number;
  registered: number;
  percent: number | null;
}

export interface WeeklySummaryView {
  totalPlanned: number;
  totalRegistered: number;
  percent: number | null;
}

export interface WeeklyHistoryView {
  patientId: string;
  summary: WeeklySummaryView;
  // Mais recente primeiro: days[0] = hoje, days[6] = 6 dias atrás.
  days: WeeklyDaySummaryView[];
  // Apenas logs com status 'taken' + takenAt, dentro da janela de 7
  // dias, ordenados do mais recente para o mais antigo.
  entries: HistoryEntryView[];
  total: number;
}

const WEEKDAY_NAMES_PT = [
  'Domingo',
  'Segunda',
  'Terça',
  'Quarta',
  'Quinta',
  'Sexta',
  'Sábado',
] as const;

const MS_PER_DAY = 24 * 60 * 60 * 1000;

function findMedication(
  medicationId: string,
  medications: Medication[],
): Medication | undefined {
  return medications.find((med) => med.id === medicationId);
}

function findSchedule(
  scheduleId: string,
  schedules: MedicationSchedule[],
): MedicationSchedule | undefined {
  return schedules.find((sched) => sched.id === scheduleId);
}

function formatScheduledTime(iso: string): string {
  const date = new Date(iso);
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
}

// Tudo que envolve "dia" usa fronteiras em horário local do
// dispositivo. Logs gravados com timestamptz no banco chegam como ISO
// em UTC; ao instanciar `new Date(iso)` o JS converte para local, e
// `getFullYear/Month/Date` devolvem o dia local — exatamente como o
// usuário espera ver "hoje".
function startOfLocalDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function formatLocalIsoDate(d: Date): string {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

function formatLocalDateLabel(d: Date): string {
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  return `${dd}/${mm}`;
}

function weekdayLabel(d: Date, daysFromToday: number): string {
  if (daysFromToday === 0) return 'Hoje';
  if (daysFromToday === 1) return 'Ontem';
  return WEEKDAY_NAMES_PT[d.getDay()];
}

function computePercent(num: number, denom: number): number | null {
  if (denom === 0) return null;
  return Math.round((num / denom) * 100);
}

function joinLog(
  log: MedicationLog,
  schedules: MedicationSchedule[],
  medications: Medication[],
): TodayMedicationView | null {
  const schedule = findSchedule(log.scheduleId, schedules);
  if (!schedule) return null;
  const medication = findMedication(schedule.medicationId, medications);
  if (!medication) return null;
  return {
    id: log.id,
    medication,
    scheduledTime: formatScheduledTime(log.scheduledFor),
    status: log.status,
  };
}

function buildHistoryEntry(
  log: MedicationLog,
  schedules: MedicationSchedule[],
  medications: Medication[],
): HistoryEntryView | null {
  if (!log.takenAt) return null;
  const schedule = findSchedule(log.scheduleId, schedules);
  if (!schedule) return null;
  const medication = findMedication(schedule.medicationId, medications);
  if (!medication) return null;
  return {
    id: log.id,
    medication,
    scheduledTime: formatScheduledTime(log.scheduledFor),
    takenAtTime: formatScheduledTime(log.takenAt),
    takenAtIso: log.takenAt,
    status: log.status,
  };
}

function getLogsForPatient(
  patientId: string,
  logs: MedicationLog[],
  schedules: MedicationSchedule[],
): MedicationLog[] {
  const patientScheduleIds = new Set(
    schedules
      .filter((sched) => sched.patientId === patientId)
      .map((sched) => sched.id),
  );
  return logs.filter((log) => patientScheduleIds.has(log.scheduleId));
}

function buildSummary(items: TodayMedicationView[]): DailySummary {
  return {
    total: items.length,
    taken: items.filter((item) => item.status === 'taken').length,
    pending: items.filter((item) => item.status === 'pending').length,
    late: items.filter((item) => item.status === 'late').length,
  };
}

function pickNext(items: TodayMedicationView[]): TodayMedicationView | null {
  const late = items.find((item) => item.status === 'late');
  if (late) return late;
  const pending = items.find((item) => item.status === 'pending');
  return pending ?? null;
}

export const MedicationService = {
  getTodayDashboard(
    patientId: string,
    data: MedicationData,
    now: Date = new Date(),
  ): TodayDashboard {
    // Repository agora carrega logs dos últimos 7 dias para alimentar
    // o resumo semanal — então a Home precisa filtrar explicitamente
    // pelas fronteiras locais de "hoje" para não exibir logs de
    // ontem como se fossem do dia corrente.
    const todayStart = startOfLocalDay(now);
    const tomorrowStart = new Date(todayStart);
    tomorrowStart.setDate(todayStart.getDate() + 1);

    const items = getLogsForPatient(patientId, data.logs, data.schedules)
      .filter((log) => {
        const scheduled = new Date(log.scheduledFor);
        return scheduled >= todayStart && scheduled < tomorrowStart;
      })
      .map((log) => joinLog(log, data.schedules, data.medications))
      .filter((view): view is TodayMedicationView => view !== null)
      .sort((a, b) => a.scheduledTime.localeCompare(b.scheduledTime));

    return {
      patientId,
      items,
      summary: buildSummary(items),
      next: pickNext(items),
    };
  },

  getMedicationDetail(
    logId: string,
    data: MedicationData,
  ): MedicationDetailView | null {
    const log = data.logs.find((entry) => entry.id === logId);
    if (!log) return null;
    const schedule = findSchedule(log.scheduleId, data.schedules);
    if (!schedule) return null;
    const medication = findMedication(schedule.medicationId, data.medications);
    if (!medication) return null;
    return {
      id: log.id,
      medication,
      scheduledTime: formatScheduledTime(log.scheduledFor),
      takenAtTime: log.takenAt ? formatScheduledTime(log.takenAt) : undefined,
      status: log.status,
    };
  },

  // Resumo semanal puro: recebe logs/schedules/medications e devolve a
  // visão de 7 dias (hoje + 6 dias anteriores), o resumo agregado e a
  // lista de tomadas registradas no período. Não acessa Supabase nem UI.
  //
  // "Previstos" = todos os logs do dia (qualquer status). "Registrados"
  // = subconjunto com status 'taken' e takenAt preenchido — a regra de
  // que registrar equivale a "marcou como tomado", não a comprovação
  // clínica de consumo.
  getWeeklyHistory(
    patientId: string,
    data: MedicationData,
    now: Date = new Date(),
  ): WeeklyHistoryView {
    const todayStart = startOfLocalDay(now);
    const tomorrowStart = new Date(todayStart);
    tomorrowStart.setDate(todayStart.getDate() + 1);
    const windowStart = new Date(todayStart);
    windowStart.setDate(todayStart.getDate() - 6);

    const patientLogs = getLogsForPatient(
      patientId,
      data.logs,
      data.schedules,
    );

    // Bucket por offset de dias: 0 = hoje, 6 = há 6 dias.
    // Math.round absorve DST: dias com 23h ou 25h ainda mapeiam para o
    // inteiro correto.
    const buckets: MedicationLog[][] = Array.from({ length: 7 }, () => []);
    for (const log of patientLogs) {
      const scheduled = new Date(log.scheduledFor);
      if (scheduled < windowStart || scheduled >= tomorrowStart) continue;
      const dayStart = startOfLocalDay(scheduled);
      const idx = Math.round(
        (todayStart.getTime() - dayStart.getTime()) / MS_PER_DAY,
      );
      if (idx >= 0 && idx < 7) {
        buckets[idx].push(log);
      }
    }

    const days: WeeklyDaySummaryView[] = [];
    for (let i = 0; i < 7; i++) {
      const dayDate = new Date(todayStart);
      dayDate.setDate(todayStart.getDate() - i);
      const dayLogs = buckets[i];
      const planned = dayLogs.length;
      const registered = dayLogs.filter(
        (log) => log.status === 'taken' && log.takenAt,
      ).length;
      days.push({
        isoDate: formatLocalIsoDate(dayDate),
        weekdayLabel: weekdayLabel(dayDate, i),
        dateLabel: formatLocalDateLabel(dayDate),
        planned,
        registered,
        percent: computePercent(registered, planned),
      });
    }

    const totalPlanned = days.reduce((sum, day) => sum + day.planned, 0);
    const totalRegistered = days.reduce(
      (sum, day) => sum + day.registered,
      0,
    );

    const summary: WeeklySummaryView = {
      totalPlanned,
      totalRegistered,
      percent: computePercent(totalRegistered, totalPlanned),
    };

    const entries: HistoryEntryView[] = patientLogs
      .filter((log) => {
        if (log.status !== 'taken' || !log.takenAt) return false;
        const scheduled = new Date(log.scheduledFor);
        return scheduled >= windowStart && scheduled < tomorrowStart;
      })
      .map((log) => buildHistoryEntry(log, data.schedules, data.medications))
      .filter((entry): entry is HistoryEntryView => entry !== null)
      .sort((a, b) => b.takenAtIso.localeCompare(a.takenAtIso));

    return {
      patientId,
      summary,
      days,
      entries,
      total: entries.length,
    };
  },
};
