import { StyleSheet, Text, View } from 'react-native';
import { TodayMedicationView } from '../services/MedicationService';
import { colors, spacing, typography } from '../theme';
import { StatusBadge } from './StatusBadge';

interface MedicationListItemProps {
  item: TodayMedicationView;
  showDivider?: boolean;
}

export function MedicationListItem({ item, showDivider = false }: MedicationListItemProps) {
  return (
    <View style={[styles.row, showDivider && styles.rowWithDivider]}>
      <Text style={styles.time}>{item.scheduledTime}</Text>
      <View style={styles.middle}>
        <Text style={styles.name}>{item.medication.name}</Text>
        <Text style={styles.dose}>{item.medication.dose}</Text>
      </View>
      <StatusBadge status={item.status} />
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
});
