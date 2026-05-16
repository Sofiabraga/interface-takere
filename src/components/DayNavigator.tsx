import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing, typography } from '../theme';

interface DayNavigatorProps {
  weekdayLabel: string;
  dateLabel: string;
  canGoPrevious: boolean;
  canGoNext: boolean;
  onPrevious: () => void;
  onNext: () => void;
}

// Controle de navegação por dia: "<" volta um dia, ">" avança um dia.
// Convenção de calendário — `<` aponta para o passado, `>` para o
// futuro. Não temos dados futuros agendados, então em "hoje" o `>`
// fica desabilitado e o usuário não consegue avançar além.
//
// Cada botão tem 48px de altura mínima (acima do mínimo secundário de
// 44 das diretrizes do projeto) e área de toque larga o suficiente
// para Maria. O rótulo central reaproveita o mesmo padrão visual de
// WeeklyDayProgressItem ("Hoje" + "14/05") para consistência.
export function DayNavigator({
  weekdayLabel,
  dateLabel,
  canGoPrevious,
  canGoNext,
  onPrevious,
  onNext,
}: DayNavigatorProps) {
  return (
    <View style={styles.container}>
      <NavButton
        direction="previous"
        label="Anterior"
        disabled={!canGoPrevious}
        onPress={onPrevious}
        accessibilityHint="Mostra os medicamentos do dia anterior."
      />
      <View
        accessible
        accessibilityRole="header"
        accessibilityLabel={`${weekdayLabel}, ${dateLabel}`}
        style={styles.labelStack}
      >
        <Text style={styles.weekday}>{weekdayLabel}</Text>
        <Text style={styles.date}>{dateLabel}</Text>
      </View>
      <NavButton
        direction="next"
        label="Próximo"
        disabled={!canGoNext}
        onPress={onNext}
        accessibilityHint="Mostra os medicamentos do próximo dia."
      />
    </View>
  );
}

interface NavButtonProps {
  direction: 'previous' | 'next';
  label: string;
  disabled: boolean;
  onPress: () => void;
  accessibilityHint: string;
}

function NavButton({
  direction,
  label,
  disabled,
  onPress,
  accessibilityHint,
}: NavButtonProps) {
  const isPrevious = direction === 'previous';
  const arrow = isPrevious ? '‹' : '›';
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={isPrevious ? 'Dia anterior' : 'Próximo dia'}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled }}
      style={({ pressed }) => [
        styles.button,
        pressed && !disabled && styles.buttonPressed,
        disabled && styles.buttonDisabled,
      ]}
    >
      {isPrevious ? (
        <>
          <Text style={[styles.arrow, disabled && styles.labelDisabled]}>
            {arrow}
          </Text>
          <Text style={[styles.buttonLabel, disabled && styles.labelDisabled]}>
            {label}
          </Text>
        </>
      ) : (
        <>
          <Text style={[styles.buttonLabel, disabled && styles.labelDisabled]}>
            {label}
          </Text>
          <Text style={[styles.arrow, disabled && styles.labelDisabled]}>
            {arrow}
          </Text>
        </>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  labelStack: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: spacing.xs,
  },
  weekday: {
    ...typography.bodyStrong,
    color: colors.textPrimary,
  },
  date: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  button: {
    minHeight: 48,
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.primary,
    backgroundColor: colors.surface,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
  },
  buttonPressed: {
    backgroundColor: colors.primaryLight,
  },
  buttonDisabled: {
    backgroundColor: colors.surfaceMuted,
    borderColor: colors.border,
  },
  arrow: {
    fontSize: 24,
    fontWeight: '700',
    lineHeight: 28,
    color: colors.primary,
  },
  buttonLabel: {
    ...typography.button,
    color: colors.primary,
  },
  labelDisabled: {
    color: colors.textMuted,
  },
});
