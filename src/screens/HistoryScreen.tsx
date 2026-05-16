import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { AppHeader } from '../components/AppHeader';
import { Card } from '../components/Card';
import { DayNavigator } from '../components/DayNavigator';
import { EmptyState } from '../components/EmptyState';
import { ScreenContainer } from '../components/ScreenContainer';
import { SectionTitle } from '../components/SectionTitle';
import { StatusBadge } from '../components/StatusBadge';
import { WeeklyDayProgressItem } from '../components/WeeklyDayProgressItem';
import { WeeklySummaryCard } from '../components/WeeklySummaryCard';
import { useMedicationHistory } from '../hooks/useMedicationHistory';
import { useAppNavigation } from '../navigation/useAppNavigation';
import { DayLogView } from '../services/MedicationService';
import { colors, spacing, typography } from '../theme';

export function HistoryScreen() {
  const navigation = useAppNavigation();
  const { history } = useMedicationHistory();
  const hasWeek = history.summary.totalPlanned > 0;

  // 0 = hoje, 1 = ontem, ..., (days.length-1) = 6 dias atrás.
  // O service garante 7 dias em `history.days`; usar o tamanho da
  // lista mantém o limite sincronizado se isso mudar no futuro.
  const [daysFromToday, setDaysFromToday] = useState(0);
  const maxDaysBack = history.days.length - 1;
  const selectedDay = history.days[daysFromToday];
  const dayLogs = selectedDay?.logs ?? [];

  const canGoPrevious = daysFromToday < maxDaysBack;
  const canGoNext = daysFromToday > 0;
  const isToday = daysFromToday === 0;

  return (
    <ScreenContainer>
      <AppHeader
        title="Histórico da semana"
        subtitle="Veja os medicamentos que você registrou nos últimos 7 dias."
        onBack={() => navigation.goBack()}
      />

      {!hasWeek ? (
        <EmptyState
          title="Sem registros nesta semana"
          message="Quando você marcar um medicamento como tomado, ele aparece aqui."
        />
      ) : (
        <>
          <WeeklySummaryCard summary={history.summary} />

          <SectionTitle>Resumo por dia</SectionTitle>
          <Card>
            {history.days.map((day, index) => (
              <WeeklyDayProgressItem
                key={day.isoDate}
                day={day}
                showDivider={index > 0}
              />
            ))}
          </Card>

          <SectionTitle>Medicamentos do dia</SectionTitle>
          {selectedDay ? (
            <DayNavigator
              weekdayLabel={selectedDay.weekdayLabel}
              dateLabel={selectedDay.dateLabel}
              canGoPrevious={canGoPrevious}
              canGoNext={canGoNext}
              onPrevious={() => setDaysFromToday((value) => value + 1)}
              onNext={() =>
                setDaysFromToday((value) => Math.max(0, value - 1))
              }
            />
          ) : null}
          {dayLogs.length > 0 ? (
            <Card>
              {dayLogs.map((log, index) => (
                <HistoryRow key={log.id} log={log} showDivider={index > 0} />
              ))}
            </Card>
          ) : (
            <EmptyState
              title="Nenhum medicamento nesse dia"
              message={
                isToday
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

interface HistoryRowProps {
  log: DayLogView;
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
