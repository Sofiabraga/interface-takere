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
  // ISO original do horário previsto. Mantido aqui (além do
  // scheduledTime já formatado) para que componentes possam calcular
  // distância até "agora" sem reparsar string HH:MM e sem reimportar
  // a regra de fuso. Sempre em UTC (vem do timestamptz do Postgres);
  // `new Date(scheduledIso)` no cliente devolve em horário local.
  scheduledIso: string;
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
  scheduledIso: string;
  takenAtTime?: string;
  status: MedicationStatus;
}

// Log do dia exposto pela HistoryScreen. Difere de TodayMedicationView
// por incluir takenAtTime quando o medicamento foi registrado — assim
// a lista do dia mostra tanto os tomados (com horário registrado)
// quanto os não-tomados (apenas o horário previsto + badge de status),
// mantendo coerência com o "X de Y registrados" exibido logo acima.
export interface DayLogView {
  id: string;
  medication: Medication;
  scheduledTime: string;
  takenAtTime?: string;
  status: MedicationStatus;
}

// Resumo de um único dia da semana. `percent` é null quando não há
// medicamentos previstos naquele dia — a UI traduz isso para "Sem
// medicamentos previstos" em vez de exibir 0%, que pareceria um
// resultado negativo. `logs` traz todos os medicamentos do dia
// (qualquer status), ordenados por horário previsto crescente, para
// alimentar a lista paginada por dia.
export interface WeeklyDaySummaryView {
  isoDate: string;             // 'YYYY-MM-DD' em horário local do dispositivo
  weekdayLabel: string;        // 'Hoje' | 'Ontem' | 'Segunda' ... 'Domingo' — usado em headers
  weekdayShortLabel: string;   // 'Hoje' | 'Seg' | 'Ter' ... 'Dom' — usado no DayPickerStrip
  dateLabel: string;           // 'DD/MM'
  planned: number;
  registered: number;
  percent: number | null;
  logs: DayLogView[];
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
}

// Resumo agregado dos últimos 30 dias. Linguagem deliberadamente
// neutra: "registrados / previstos" — não é adesão, não é avaliação
// clínica, é só a contabilidade do que o usuário marcou no app.
export interface MonthlySummaryView {
  totalPlanned: number;
  totalRegistered: number;
  percent: number | null;
  daysCovered: number;     // 30 — fixo para esta versão
}

// Bucket de uma "semana" do resumo mensal. Os 30 dias são divididos
// em 4 blocos contíguos: 3 de 7 dias + o mais antigo com 9 dias.
// `dateRangeLabel` ("DD/MM a DD/MM") torna a assimetria do último
// bloco visível em vez de escondida — usuário sabe exatamente qual
// período aquela linha cobre.
export interface MonthlyWeekSummaryView {
  key: string;             // 'this-week' | 'last-week' | 'two-weeks-ago' | 'three-weeks-ago'
  label: string;           // 'Esta semana' | 'Semana passada' | 'Há 2 semanas' | 'Há 3 semanas'
  dateRangeLabel: string;  // 'DD/MM a DD/MM' (data mais antiga primeiro)
  planned: number;
  registered: number;
  percent: number | null;
  daysInBucket: number;    // 7 ou 9
}

export interface MonthlyHistoryView {
  patientId: string;
  summary: MonthlySummaryView;
  // Mais recente primeiro: weeks[0] = esta semana, weeks[3] = há 3 semanas.
  weeks: MonthlyWeekSummaryView[];
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

// Abreviações de 3 letras para o DayPickerStrip — onde cada pill tem
// largura limitada (≈ 47px no iPhone SE) e nome inteiro não cabe sem
// quebrar ou truncar.
const WEEKDAY_SHORT_NAMES_PT = [
  'Dom',
  'Seg',
  'Ter',
  'Qua',
  'Qui',
  'Sex',
  'Sáb',
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

// Para o DayPickerStrip só "Hoje" recebe rótulo especial — "Ontem"
// teria 5 caracteres e quebraria visualmente o ritmo das 6 outras
// pills (3 letras). O dia 15/05 já é claramente "ontem" pelo número
// do dia ao lado da pill de Hoje.
function weekdayShortLabel(d: Date, daysFromToday: number): string {
  if (daysFromToday === 0) return 'Hoje';
  return WEEKDAY_SHORT_NAMES_PT[d.getDay()];
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
    scheduledIso: log.scheduledFor,
    status: log.status,
  };
}

function buildDayLog(
  log: MedicationLog,
  schedules: MedicationSchedule[],
  medications: Medication[],
): DayLogView | null {
  const schedule = findSchedule(log.scheduleId, schedules);
  if (!schedule) return null;
  const medication = findMedication(schedule.medicationId, medications);
  if (!medication) return null;
  return {
    id: log.id,
    medication,
    scheduledTime: formatScheduledTime(log.scheduledFor),
    takenAtTime: log.takenAt ? formatScheduledTime(log.takenAt) : undefined,
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
      scheduledIso: log.scheduledFor,
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
      const logs = dayLogs
        .map((log) => buildDayLog(log, data.schedules, data.medications))
        .filter((view): view is DayLogView => view !== null)
        .sort((a, b) => a.scheduledTime.localeCompare(b.scheduledTime));
      days.push({
        isoDate: formatLocalIsoDate(dayDate),
        weekdayLabel: weekdayLabel(dayDate, i),
        weekdayShortLabel: weekdayShortLabel(dayDate, i),
        dateLabel: formatLocalDateLabel(dayDate),
        planned,
        registered,
        percent: computePercent(registered, planned),
        logs,
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

    return {
      patientId,
      summary,
      days,
    };
  },

  // Resumo mensal puro: agrega os últimos 30 dias (hoje + 29 dias
  // anteriores) em 4 buckets de "semana". Não acessa Supabase nem UI;
  // recebe os mesmos dados que o weekly e devolve um view-model
  // imutável. A definição de "previsto" e "registrado" é a mesma do
  // weekly: previsto = todos os logs do dia, registrado = subconjunto
  // com status 'taken' e takenAt preenchido.
  //
  // Divisão dos 30 dias:
  //   - Esta semana       → D-0  .. D-6   (7 dias)
  //   - Semana passada    → D-7  .. D-13  (7 dias)
  //   - Há 2 semanas      → D-14 .. D-20  (7 dias)
  //   - Há 3 semanas      → D-21 .. D-29  (9 dias)
  //
  // O último bucket carrega 9 dias para fechar exatamente 30 dias sem
  // criar uma 5ª "meia-semana" que polui a tela. O dateRangeLabel
  // mostra a faixa real para que a assimetria seja honesta.
  getMonthlyHistory(
    patientId: string,
    data: MedicationData,
    now: Date = new Date(),
  ): MonthlyHistoryView {
    const todayStart = startOfLocalDay(now);
    const tomorrowStart = new Date(todayStart);
    tomorrowStart.setDate(todayStart.getDate() + 1);
    const windowStart = new Date(todayStart);
    windowStart.setDate(todayStart.getDate() - 29);

    const patientLogs = getLogsForPatient(
      patientId,
      data.logs,
      data.schedules,
    );

    // Mapeia cada log para o índice 0..29 (0 = hoje, 29 = há 29 dias).
    // Math.round absorve mudanças de DST (dias de 23h ou 25h).
    const logsByDayOffset: MedicationLog[][] = Array.from(
      { length: 30 },
      () => [],
    );
    for (const log of patientLogs) {
      const scheduled = new Date(log.scheduledFor);
      if (scheduled < windowStart || scheduled >= tomorrowStart) continue;
      const dayStart = startOfLocalDay(scheduled);
      const idx = Math.round(
        (todayStart.getTime() - dayStart.getTime()) / MS_PER_DAY,
      );
      if (idx >= 0 && idx < 30) {
        logsByDayOffset[idx].push(log);
      }
    }

    // [labelKey, label, offsetMin, offsetMax]. offsetMin é o mais
    // recente (menor offset); offsetMax é o mais antigo.
    const bucketDefs: Array<[
      MonthlyWeekSummaryView['key'],
      string,
      number,
      number,
    ]> = [
      ['this-week', 'Esta semana', 0, 6],
      ['last-week', 'Semana passada', 7, 13],
      ['two-weeks-ago', 'Há 2 semanas', 14, 20],
      ['three-weeks-ago', 'Há 3 semanas', 21, 29],
    ];

    const weeks: MonthlyWeekSummaryView[] = bucketDefs.map(
      ([key, label, offsetMin, offsetMax]) => {
        let planned = 0;
        let registered = 0;
        for (let i = offsetMin; i <= offsetMax; i++) {
          const bucket = logsByDayOffset[i];
          planned += bucket.length;
          registered += bucket.filter(
            (log) => log.status === 'taken' && log.takenAt,
          ).length;
        }
        // Datas de extremidade do bucket. `recent` é o dia mais novo,
        // `oldest` o mais antigo. O rótulo formata "DD/MM a DD/MM"
        // do mais antigo para o mais recente — leitura natural.
        const recent = new Date(todayStart);
        recent.setDate(todayStart.getDate() - offsetMin);
        const oldest = new Date(todayStart);
        oldest.setDate(todayStart.getDate() - offsetMax);
        return {
          key,
          label,
          dateRangeLabel: `${formatLocalDateLabel(oldest)} a ${formatLocalDateLabel(recent)}`,
          planned,
          registered,
          percent: computePercent(registered, planned),
          daysInBucket: offsetMax - offsetMin + 1,
        };
      },
    );

    const totalPlanned = weeks.reduce((sum, w) => sum + w.planned, 0);
    const totalRegistered = weeks.reduce((sum, w) => sum + w.registered, 0);

    const summary: MonthlySummaryView = {
      totalPlanned,
      totalRegistered,
      percent: computePercent(totalRegistered, totalPlanned),
      daysCovered: 30,
    };

    return {
      patientId,
      summary,
      weeks,
    };
  },
};
