import { StyleSheet, Text, View } from 'react-native';
import { TodayMedicationView } from '../services/MedicationService';
import { colors, radius, spacing, typography } from '../theme';
import { Card } from './Card';
import { PrimaryButton } from './PrimaryButton';
import { StatusBadge } from './StatusBadge';

interface NextMedicationCardProps {
  next: TodayMedicationView | null;
  onMarkAsTaken: () => void;
}

export function NextMedicationCard({ next, onMarkAsTaken }: NextMedicationCardProps) {
  if (!next) {
    return (
      <Card>
        <View style={styles.chipPositive}>
          <Text style={styles.chipPositiveText}>Tudo em dia</Text>
        </View>
        <Text style={styles.emptyText}>
          Nenhum medicamento pendente neste momento. Continue assim!
        </Text>
      </Card>
    );
  }

  return (
    <Card>
      <View style={styles.header}>
        <View style={styles.chip}>
          <Text style={styles.chipText}>Próximo medicamento</Text>
        </View>
        <StatusBadge status={next.status} />
      </View>

      <Text style={styles.time}>{next.scheduledTime}</Text>
      <Text style={styles.name}>{next.medication.name}</Text>
      <Text style={styles.dose}>{next.medication.dose}</Text>

      {next.medication.instructions ? (
        <Text style={styles.instructions}>{next.medication.instructions}</Text>
      ) : null}

      <View style={styles.actions}>
        <PrimaryButton label="Marcar como tomado" onPress={onMarkAsTaken} />
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.pill,
    backgroundColor: colors.primaryLight,
  },
  chipText: {
    ...typography.caption,
    color: colors.primaryDark,
  },
  chipPositive: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.pill,
    backgroundColor: colors.statusTakenBg,
    alignSelf: 'flex-start',
  },
  chipPositiveText: {
    ...typography.caption,
    color: colors.statusTakenText,
  },
  emptyText: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  time: {
    ...typography.display,
    color: colors.primary,
    marginTop: spacing.sm,
  },
  name: {
    ...typography.title,
    color: colors.textPrimary,
  },
  dose: {
    ...typography.body,
    color: colors.textSecondary,
  },
  instructions: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  actions: {
    marginTop: spacing.md,
  },
});
