import { StyleSheet, Text, View } from 'react-native';
import { MedicationStatus } from '../domain/enums/MedicationStatus';
import { colors, radius, spacing, typography } from '../theme';

interface StatusBadgeProps {
  status: MedicationStatus;
}

const labels: Record<MedicationStatus, string> = {
  pending: 'Pendente',
  taken: 'Tomado',
  late: 'Atrasado',
};

const palette: Record<MedicationStatus, { background: string; text: string }> = {
  pending: { background: colors.statusPendingBg, text: colors.statusPendingText },
  taken: { background: colors.statusTakenBg, text: colors.statusTakenText },
  late: { background: colors.statusLateBg, text: colors.statusLateText },
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const { background, text } = palette[status];
  const label = labels[status];

  return (
    <View
      accessible
      accessibilityRole="text"
      accessibilityLabel={`Status: ${label}`}
      style={[styles.badge, { backgroundColor: background }]}
    >
      <Text style={[styles.label, { color: text }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.pill,
    alignSelf: 'flex-start',
  },
  label: {
    ...typography.caption,
  },
});
