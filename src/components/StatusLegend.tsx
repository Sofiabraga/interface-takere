import { StyleSheet, Text, View } from 'react-native';
import { MedicationStatus } from '../domain/enums/MedicationStatus';
import { colors, spacing, typography } from '../theme';
import { Card } from './Card';
import { StatusBadge } from './StatusBadge';

interface LegendEntry {
  status: MedicationStatus;
  description: string;
}

const entries: LegendEntry[] = [
  { status: 'taken', description: 'Você já tomou este medicamento.' },
  { status: 'pending', description: 'Ainda no horário de tomar.' },
  { status: 'late', description: 'Passou do horário e ainda não foi tomado.' },
];

export function StatusLegend() {
  return (
    <Card>
      <Text style={styles.title}>O que cada status significa</Text>
      <View style={styles.list}>
        {entries.map((entry) => (
          <View key={entry.status} style={styles.row}>
            <StatusBadge status={entry.status} />
            <Text style={styles.description}>{entry.description}</Text>
          </View>
        ))}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  title: {
    ...typography.bodyStrong,
    color: colors.textPrimary,
  },
  list: {
    gap: spacing.md,
    marginTop: spacing.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  description: {
    ...typography.body,
    color: colors.textSecondary,
    flex: 1,
  },
});
