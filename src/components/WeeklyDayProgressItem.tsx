import { StyleSheet, Text, View } from 'react-native';
import { WeeklyDaySummaryView } from '../services/MedicationService';
import { colors, radius, spacing, typography } from '../theme';

interface WeeklyDayProgressItemProps {
  day: WeeklyDaySummaryView;
  showDivider: boolean;
}

// Linha por dia da semana com:
//   - rótulo do dia (Hoje / Ontem / nome do dia) + data DD/MM;
//   - texto "X de Y registrados" — fonte primária de informação;
//   - percentual em texto;
//   - barra horizontal como reforço visual (nunca a única fonte).
//
// A barra é montada com Views simples (track + fill) para não
// introduzir dependência de biblioteca de gráficos. O componente
// não é clicável e não usa estilos de toque — não deve parecer
// interativo. A barra é marcada como invisível para leitor de tela
// porque toda a informação está duplicada em texto acima.
export function WeeklyDayProgressItem({
  day,
  showDivider,
}: WeeklyDayProgressItemProps) {
  const noPlanned = day.percent === null;
  const description = noPlanned
    ? 'Sem medicamentos previstos'
    : `${day.registered} de ${day.planned} registrados`;
  const percentText = noPlanned ? '—' : `${day.percent}%`;

  const accessibilityLabel = noPlanned
    ? `${day.weekdayLabel}, ${day.dateLabel}. Sem medicamentos previstos.`
    : `${day.weekdayLabel}, ${day.dateLabel}. ` +
      `${day.registered} de ${day.planned} medicamentos registrados. ` +
      `${day.percent} por cento.`;

  return (
    <View
      accessible
      accessibilityLabel={accessibilityLabel}
      style={[styles.row, showDivider && styles.rowWithDivider]}
    >
      <View style={styles.headerRow}>
        <View style={styles.labelStack}>
          <Text style={styles.weekday}>{day.weekdayLabel}</Text>
          <Text style={styles.date}>{day.dateLabel}</Text>
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
            { width: noPlanned ? '0%' : `${day.percent ?? 0}%` },
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
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  labelStack: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: spacing.sm,
  },
  weekday: {
    ...typography.bodyStrong,
    color: colors.textPrimary,
  },
  date: {
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
