import { StyleSheet, Text, View } from 'react-native';
import { MonthlyWeekSummaryView } from '../services/MedicationService';
import { colors, radius, spacing, typography } from '../theme';

interface MonthlyWeekProgressItemProps {
  week: MonthlyWeekSummaryView;
  showDivider: boolean;
}

// Linha por "semana" no resumo mensal. Anatomia simples (rótulo +
// texto + barra) para leitura imediata:
//   - rótulo principal: "Esta semana / Semana passada / Há N semanas";
//   - sublabel: faixa de datas ("DD/MM a DD/MM") — assim o bucket
//     "Há 3 semanas", que abrange 9 dias, fica honesto sobre seu
//     período em vez de fingir ter o mesmo tamanho dos outros.
//
// Não é clicável: não usa estilo de toque, não recebe onPress, não
// tem accessibilityRole='button'. Toda a informação é exposta por
// texto antes da barra; a barra é apenas reforço visual e fica
// invisível para leitores de tela.
export function MonthlyWeekProgressItem({
  week,
  showDivider,
}: MonthlyWeekProgressItemProps) {
  const noPlanned = week.percent === null;
  const description = noPlanned
    ? 'Sem medicamentos previstos'
    : `${week.registered} de ${week.planned} registrados`;
  const percentText = noPlanned ? '—' : `${week.percent}%`;

  const accessibilityLabel = noPlanned
    ? `${week.label}, ${week.dateRangeLabel}. Sem medicamentos previstos.`
    : `${week.label}, ${week.dateRangeLabel}. ` +
      `${week.registered} de ${week.planned} medicamentos registrados. ` +
      `${week.percent} por cento.`;

  return (
    <View
      accessible
      accessibilityLabel={accessibilityLabel}
      style={[styles.row, showDivider && styles.rowWithDivider]}
    >
      <View style={styles.headerRow}>
        <View style={styles.labelStack}>
          <Text style={styles.label}>{week.label}</Text>
          <Text style={styles.dateRange}>{week.dateRangeLabel}</Text>
        </View>
        <Text style={styles.percent}>{percentText}</Text>
      </View>
      <Text style={styles.description}>{description}</Text>
      <View
        style={styles.barTrack}
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
      >
        <View
          style={[
            styles.barFill,
            { width: noPlanned ? '0%' : `${week.percent ?? 0}%` },
          ]}
        />
      </View>
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
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  labelStack: {
    flex: 1,
    gap: 2,
  },
  label: {
    ...typography.bodyStrong,
    color: colors.textPrimary,
  },
  dateRange: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  percent: {
    ...typography.bodyStrong,
    color: colors.primaryDark,
  },
  description: {
    ...typography.body,
    color: colors.textSecondary,
  },
  barTrack: {
    height: 8,
    backgroundColor: colors.surfaceMuted,
    borderRadius: radius.pill,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: radius.pill,
  },
});
