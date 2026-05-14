import { StyleSheet, Text, View } from 'react-native';
import { WeeklySummaryView } from '../services/MedicationService';
import { colors, spacing, typography } from '../theme';
import { Card } from './Card';

interface WeeklySummaryCardProps {
  summary: WeeklySummaryView;
}

// Cartão de visão geral da semana. Linguagem deliberadamente neutra:
// "registrados / previstos" em vez de "consumidos" ou "cumpriu" — o
// app não comprova consumo clínico, apenas registra a marcação que o
// usuário fez. Quando não há nada previsto na semana, mostramos uma
// mensagem informativa em vez de 0% (que pareceria uma avaliação ruim).
export function WeeklySummaryCard({ summary }: WeeklySummaryCardProps) {
  const { totalPlanned, totalRegistered, percent } = summary;
  const noPlanned = percent === null;

  const headline = noPlanned
    ? 'Você não tinha medicamentos previstos nesta semana.'
    : `Você registrou ${percent}% dos medicamentos previstos nesta semana.`;

  const accessibilityLabel = noPlanned
    ? 'Resumo da semana. Sem medicamentos previstos nos últimos 7 dias.'
    : `Resumo da semana. Você registrou ${totalRegistered} de ${totalPlanned} ` +
      `medicamentos previstos. ${percent} por cento.`;

  return (
    <Card>
      <View accessible accessibilityLabel={accessibilityLabel}>
        <Text style={styles.title}>Resumo da semana</Text>
        <Text style={styles.headline}>{headline}</Text>
        <View style={styles.statsRow}>
          <Stat label="Registrados" value={String(totalRegistered)} />
          <Divider />
          <Stat label="Previstos" value={String(totalPlanned)} />
          <Divider />
          <Stat
            label="Percentual"
            value={noPlanned ? '—' : `${percent}%`}
          />
        </View>
      </View>
    </Card>
  );
}

interface StatProps {
  label: string;
  value: string;
}

function Stat({ label, value }: StatProps) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
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
  headline: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  statsRow: {
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
  statValue: {
    fontSize: 28,
    fontWeight: '700',
    lineHeight: 36,
    color: colors.primaryDark,
  },
  statLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  divider: {
    width: 1,
    height: 44,
    backgroundColor: colors.border,
  },
});
