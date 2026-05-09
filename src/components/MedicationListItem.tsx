import { Pressable, StyleSheet, Text, View } from 'react-native';
import { MedicationStatus } from '../domain/enums/MedicationStatus';
import { TodayMedicationView } from '../services/MedicationService';
import { colors, spacing, typography } from '../theme';
import { StatusBadge } from './StatusBadge';

interface MedicationListItemProps {
  item: TodayMedicationView;
  showDivider?: boolean;
  onPress?: (item: TodayMedicationView) => void;
}

const statusLabel: Record<MedicationStatus, string> = {
  pending: 'pendente',
  taken: 'tomado',
  late: 'atrasado',
};

export function MedicationListItem({
  item,
  showDivider = false,
  onPress,
}: MedicationListItemProps) {
  const interactive = onPress != null;

  const inner = (
    <>
      <Text style={styles.time}>{item.scheduledTime}</Text>
      <View style={styles.middle}>
        <Text style={styles.name}>{item.medication.name}</Text>
        <Text style={styles.dose}>{item.medication.dose}</Text>
      </View>
      <StatusBadge status={item.status} />
      {interactive ? <Text style={styles.chevron}>›</Text> : null}
    </>
  );

  if (interactive) {
    return (
      <Pressable
        onPress={() => onPress!(item)}
        accessibilityRole="button"
        accessibilityLabel={`${item.medication.name}, ${item.medication.dose}, às ${item.scheduledTime}, ${statusLabel[item.status]}`}
        accessibilityHint="Abre os detalhes deste medicamento"
        style={({ pressed }) => [
          styles.row,
          showDivider && styles.rowWithDivider,
          pressed && styles.rowPressed,
        ]}
      >
        {inner}
      </Pressable>
    );
  }

  return (
    <View style={[styles.row, showDivider && styles.rowWithDivider]}>
      {inner}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.md,
  },
  rowWithDivider: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  rowPressed: {
    backgroundColor: colors.primaryLight,
  },
  time: {
    ...typography.bodyStrong,
    color: colors.primary,
    width: 64,
  },
  middle: {
    flex: 1,
    gap: 2,
  },
  name: {
    ...typography.bodyStrong,
    color: colors.textPrimary,
  },
  dose: {
    ...typography.body,
    color: colors.textSecondary,
  },
  chevron: {
    fontSize: 22,
    color: colors.textMuted,
  },
});
