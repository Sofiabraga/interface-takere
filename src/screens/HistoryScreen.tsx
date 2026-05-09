import { StyleSheet, Text, View } from 'react-native';
import { AppHeader } from '../components/AppHeader';
import { Card } from '../components/Card';
import { EmptyState } from '../components/EmptyState';
import { ScreenContainer } from '../components/ScreenContainer';
import { StatusBadge } from '../components/StatusBadge';
import { useMedicationHistory } from '../hooks/useMedicationHistory';
import { useAppNavigation } from '../navigation/useAppNavigation';
import { HistoryEntryView } from '../services/MedicationService';
import { colors, spacing, typography } from '../theme';

export function HistoryScreen() {
  const navigation = useAppNavigation();
  const { history } = useMedicationHistory();

  return (
    <ScreenContainer>
      <AppHeader
        title="Histórico de hoje"
        subtitle="Veja os medicamentos que você marcou como tomados hoje."
        onBack={() => navigation.goBack()}
      />

      {history.total === 0 ? (
        <EmptyState
          title="Nenhuma tomada registrada"
          message="Quando você marcar um medicamento como tomado, ele aparece aqui."
        />
      ) : (
        <>
          <Text style={styles.summaryText}>
            {summaryLabel(history.total)}
          </Text>
          <Card>
            {history.entries.map((entry, index) => (
              <HistoryRow
                key={entry.id}
                entry={entry}
                showDivider={index > 0}
              />
            ))}
          </Card>
        </>
      )}
    </ScreenContainer>
  );
}

interface HistoryRowProps {
  entry: HistoryEntryView;
  showDivider: boolean;
}

function HistoryRow({ entry, showDivider }: HistoryRowProps) {
  const accessibilityLabel =
    `${entry.medication.name}, ${entry.medication.dose}. ` +
    `Horário previsto: ${entry.scheduledTime}. ` +
    `Registrado às ${entry.takenAtTime}. Tomado.`;

  return (
    <View
      accessible
      accessibilityLabel={accessibilityLabel}
      style={[styles.row, showDivider && styles.rowWithDivider]}
    >
      <View style={styles.headerRow}>
        <Text style={styles.name}>{entry.medication.name}</Text>
        <StatusBadge status={entry.status} />
      </View>
      <Text style={styles.dose}>{entry.medication.dose}</Text>
      <View style={styles.timeStack}>
        <TimeLine label="Horário previsto" value={entry.scheduledTime} />
        <TimeLine label="Registrado às" value={entry.takenAtTime} />
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

function summaryLabel(total: number): string {
  if (total === 1) {
    return 'Você registrou 1 medicamento como tomado hoje.';
  }
  return `Você registrou ${total} medicamentos como tomados hoje.`;
}

const styles = StyleSheet.create({
  summaryText: {
    ...typography.body,
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
