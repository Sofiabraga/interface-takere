import { StyleSheet, Text, View } from 'react-native';
import { DailySummary } from '../services/MedicationService';
import { colors, spacing, typography } from '../theme';
import { Card } from './Card';

interface MedicationSummaryCardProps {
  summary: DailySummary;
  // Linha discreta no rodapé do card. Usada pela MedicationListScreen
  // para esclarecer que o resumo considera todos os status, mesmo com
  // um filtro aplicado — sem isso, o usuário pode interpretar como
  // bug ("filtrei Atrasados, mas o resumo continua mostrando 3
  // Tomados"). Omita na Home, onde a interpretação já é direta.
  note?: string;
}

export function MedicationSummaryCard({ summary, note }: MedicationSummaryCardProps) {
  return (
    <Card>
      <Text style={styles.title}>Resumo do dia</Text>
      <Text style={styles.subtitle}>
        Você tem {summary.total}{' '}
        {summary.total === 1 ? 'medicamento' : 'medicamentos'} hoje.
      </Text>
      <View style={styles.row}>
        <SummaryStat
          label="Tomados"
          value={summary.taken}
          color={colors.statusTakenText}
        />
        <Divider />
        <SummaryStat
          label="Pendentes"
          value={summary.pending}
          color={colors.statusPendingText}
        />
        <Divider />
        <SummaryStat
          label="Atrasados"
          value={summary.late}
          color={colors.statusLateText}
        />
      </View>
      {note ? <Text style={styles.note}>{note}</Text> : null}
    </Card>
  );
}

interface SummaryStatProps {
  label: string;
  value: number;
  color: string;
}

function SummaryStat({ label, value, color }: SummaryStatProps) {
  return (
    <View
      accessibilityLabel={`${value} ${label.toLowerCase()}`}
      style={styles.stat}
    >
      <Text style={[styles.value, { color }]}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

function Divider() {
  return <View style={styles.divider} />;
}

const styles = StyleSheet.create({
  title: {
    ...typography.bodyStrong,
    color: colors.textPrimary,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.md,
  },
  stat: {
    flex: 1,
    alignItems: 'center',
    gap: spacing.xs,
  },
  value: {
    fontSize: 32,
    fontWeight: '700',
    lineHeight: 40,
  },
  label: {
    ...typography.body,
    color: colors.textSecondary,
  },
  divider: {
    width: 1,
    height: 44,
    backgroundColor: colors.border,
  },
  note: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: spacing.sm,
  },
});
