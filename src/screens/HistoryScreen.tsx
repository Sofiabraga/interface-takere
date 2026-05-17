import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { AppHeader } from '../components/AppHeader';
import { Card } from '../components/Card';
import { DayPickerStrip } from '../components/DayPickerStrip';
import { EmptyState } from '../components/EmptyState';
import { MonthlySummaryCard } from '../components/MonthlySummaryCard';
import { MonthlyWeekProgressItem } from '../components/MonthlyWeekProgressItem';
import { ScreenContainer } from '../components/ScreenContainer';
import { SectionTitle } from '../components/SectionTitle';
import { StatusBadge } from '../components/StatusBadge';
import { useMedicationHistory } from '../hooks/useMedicationHistory';
import { useAppNavigation } from '../navigation/useAppNavigation';
import {
  DayLogView,
  WeeklyDaySummaryView,
} from '../services/MedicationService';
import { colors, spacing, typography } from '../theme';

export function HistoryScreen() {
  const navigation = useAppNavigation();
  const { monthly, weekly } = useMedicationHistory();
  const hasMonth = monthly.summary.totalPlanned > 0;

  // 0 = Hoje, 6 = mais antigo (mesma convenção do service). O picker
  // exibe na ordem inversa (mais antigo à esquerda), mas o index aqui
  // continua na linguagem do service para evitar tradução dupla.
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const selectedDay = weekly.days[selectedDayIndex];
  const isSelectedToday = selectedDayIndex === 0;

  return (
    <ScreenContainer>
      <AppHeader
        title="Histórico"
        subtitle="Veja seus registros dos últimos 30 dias."
        onBack={() => navigation.goBack()}
      />

      {!hasMonth ? (
        <EmptyState
          title="Sem registros neste mês"
          message="Quando você marcar um medicamento como tomado, ele aparece aqui."
        />
      ) : (
        <>
          <MonthlySummaryCard summary={monthly.summary} />

          <SectionTitle>Por semana</SectionTitle>
          <Card>
            {monthly.weeks.map((week, index) => (
              <MonthlyWeekProgressItem
                key={week.key}
                week={week}
                showDivider={index > 0}
              />
            ))}
          </Card>

          <SectionTitle>Medicamentos da semana</SectionTitle>
          <DayPickerStrip
            days={weekly.days}
            selectedIndex={selectedDayIndex}
            onSelect={setSelectedDayIndex}
          />
          {selectedDay && selectedDay.logs.length > 0 ? (
            <DayCard day={selectedDay} />
          ) : (
            <EmptyState
              title="Nenhum medicamento neste dia"
              message={
                isSelectedToday
                  ? 'Você não tem medicamentos agendados para hoje.'
                  : 'Não havia medicamentos agendados nesse dia.'
              }
            />
          )}
        </>
      )}
    </ScreenContainer>
  );
}

interface DayCardProps {
  day: WeeklyDaySummaryView;
}

// Card do dia selecionado. Mantém o header "Hoje, 16/05" mesmo com a
// pill selecionada acima — redundância intencional: confirma qual dia
// o usuário escolheu (Nielsen #1, visibilidade do estado) e dá ao
// leitor de tela o contexto sem depender de relação implícita com o
// tablist.
function DayCard({ day }: DayCardProps) {
  return (
    <Card>
      <View
        accessible
        accessibilityRole="header"
        accessibilityLabel={`${day.weekdayLabel}, ${day.dateLabel}`}
        style={styles.dayHeader}
      >
        <Text style={styles.dayWeekday}>{day.weekdayLabel}</Text>
        <Text style={styles.dayDate}>{day.dateLabel}</Text>
      </View>
      {day.logs.map((log, index) => (
        <HistoryRow key={log.id} log={log} showDivider={index === 0} />
      ))}
    </Card>
  );
}

interface HistoryRowProps {
  log: DayLogView;
  // Aqui `showDivider` separa a primeira linha do cabeçalho do dia
  // (e, por extensão, cada par de linhas vizinhas). Sempre true exceto
  // se você quiser embutir a primeira linha colada no header.
  showDivider: boolean;
}

function HistoryRow({ log, showDivider }: HistoryRowProps) {
  const statusText =
    log.status === 'taken'
      ? `Registrado às ${log.takenAtTime}.`
      : log.status === 'late'
        ? 'Não registrado. Marcado como atrasado.'
        : 'Não registrado.';
  const accessibilityLabel =
    `${log.medication.name}, ${log.medication.dose}. ` +
    `Horário previsto: ${log.scheduledTime}. ${statusText}`;

  return (
    <View
      accessible
      accessibilityLabel={accessibilityLabel}
      style={[styles.row, showDivider && styles.rowWithDivider]}
    >
      <View style={styles.headerRow}>
        <Text style={styles.name}>{log.medication.name}</Text>
        <StatusBadge status={log.status} />
      </View>
      <Text style={styles.dose}>{log.medication.dose}</Text>
      <View style={styles.timeStack}>
        <TimeLine label="Horário previsto" value={log.scheduledTime} />
        {log.takenAtTime ? (
          <TimeLine label="Registrado às" value={log.takenAtTime} />
        ) : null}
      </View>
    </View>
  );
}

interface TimeLineProps {
  label: string;
  value: string;
}

function TimeLine({ label, value }: TimeLineProps) {
  return (
    <View style={styles.timeLine}>
      <Text style={styles.timeLabel}>{label}</Text>
      <Text style={styles.timeValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  dayHeader: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: spacing.sm,
  },
  dayWeekday: {
    ...typography.bodyStrong,
    color: colors.textPrimary,
  },
  dayDate: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  row: {
    paddingVertical: spacing.md,
    gap: spacing.sm,
  },
  rowWithDivider: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  name: {
    ...typography.bodyStrong,
    color: colors.textPrimary,
    flex: 1,
  },
  dose: {
    ...typography.body,
    color: colors.textSecondary,
  },
  timeStack: {
    gap: spacing.xs,
    marginTop: spacing.xs,
  },
  timeLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  timeLabel: {
    ...typography.body,
    color: colors.textSecondary,
  },
  timeValue: {
    ...typography.bodyStrong,
    color: colors.textPrimary,
  },
});
