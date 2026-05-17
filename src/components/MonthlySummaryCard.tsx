import { StyleSheet, Text, View } from 'react-native';
import { MonthlySummaryView } from '../services/MedicationService';
import { colors, radius, spacing, typography } from '../theme';
import { Card } from './Card';

interface MonthlySummaryCardProps {
  summary: MonthlySummaryView;
}

// Cartão de destaque do resumo mensal. Hierarquia visual deliberada:
//   1. Percentual em fonte grande, com cor primária — primeira coisa
//      que o olho do usuário capta.
//   2. Frase em linguagem natural logo abaixo — explica o número.
//   3. Subtexto neutro ("83 de 120 registrados") como reforço.
//
// Linguagem é estritamente neutra: "registrados / previstos". Não usa
// "adesão", "cumprimento", "falha" — o app não comprova consumo
// clínico, só contabiliza o que o usuário marcou. Quando não há nada
// previsto no mês, mostra mensagem informativa em vez de 0%, que
// pareceria avaliação ruim.
export function MonthlySummaryCard({ summary }: MonthlySummaryCardProps) {
  const { totalPlanned, totalRegistered, percent, daysCovered } = summary;
  const noPlanned = percent === null;

  const headline = noPlanned
    ? `Você não tinha medicamentos previstos nos últimos ${daysCovered} dias.`
    : `Você registrou ${percent}% dos medicamentos previstos nos últimos ${daysCovered} dias.`;
  const subline = noPlanned
    ? 'Sem medicamentos previstos no período.'
    : `${totalRegistered} de ${totalPlanned} medicamentos registrados.`;

  const accessibilityLabel = noPlanned
    ? `Resumo do mês. Sem medicamentos previstos nos últimos ${daysCovered} dias.`
    : `Resumo do mês. ${percent} por cento. ` +
      `Você registrou ${totalRegistered} de ${totalPlanned} medicamentos ` +
      `previstos nos últimos ${daysCovered} dias.`;

  return (
    <Card>
      <View accessible accessibilityLabel={accessibilityLabel}>
        <Text style={styles.title}>Resumo do mês</Text>
        <View style={styles.percentBlock}>
          <Text style={styles.percentValue}>
            {noPlanned ? '—' : `${percent}%`}
          </Text>
          <Text style={styles.percentLabel}>
            {noPlanned ? 'Sem previstos' : `Últimos ${daysCovered} dias`}
          </Text>
        </View>
        <Text style={styles.headline}>{headline}</Text>
        <Text style={styles.subline}>{subline}</Text>
        <View
          style={styles.barTrack}
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
        >
          <View
            style={[
              styles.barFill,
              { width: noPlanned ? '0%' : `${percent ?? 0}%` },
            ]}
          />
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  title: {
    ...typography.bodyStrong,
    color: colors.textPrimary,
  },
  percentBlock: {
    marginTop: spacing.xs,
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: spacing.sm,
  },
  percentValue: {
    fontSize: 48,
    fontWeight: '700',
    lineHeight: 56,
    color: colors.primaryDark,
  },
  percentLabel: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  headline: {
    ...typography.body,
    color: colors.textPrimary,
    marginTop: spacing.xs,
  },
  subline: {
    ...typography.body,
    color: colors.textSecondary,
  },
  barTrack: {
    height: 10,
    backgroundColor: colors.surfaceMuted,
    borderRadius: radius.pill,
    overflow: 'hidden',
    marginTop: spacing.sm,
  },
  barFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: radius.pill,
  },
});
