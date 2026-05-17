import { Pressable, StyleSheet, Text, View } from 'react-native';
import { WeeklyDaySummaryView } from '../services/MedicationService';
import { colors, radius, spacing, typography } from '../theme';

interface DayPickerStripProps {
  // `days` chega na ordem do service: days[0] = hoje, days[6] = mais
  // antigo. Internamente reordenamos para render (mais antigo à
  // esquerda → Hoje à direita, convenção de calendário), mas o
  // `selectedIndex` e o callback `onSelect` continuam falando a
  // linguagem do service (0 = hoje), para não obrigar a tela a
  // entender duas convenções de índice.
  days: WeeklyDaySummaryView[];
  selectedIndex: number;
  onSelect: (index: number) => void;
}

// Seletor horizontal de dias da semana — 7 pills com flex:1 cada,
// adapta-se a qualquer largura de tela sem scroll horizontal.
//
// Layout: a pill traz weekdayShortLabel ("Hoje" / "Seg" / "Ter"…) em
// cima e o dia do mês ("16") embaixo. Texto repetido em duas linhas
// dá hierarquia visual sem usar ícones.
//
// Estado selecionado: fundo primary + texto branco. Não-selecionado:
// fundo surface + texto primary. Pressionado (não-selecionado): fundo
// primaryLight como feedback tátil — sem animação, conforme regra do
// projeto. A diferença de cor é apenas reforço; o accessibilityState
// 'selected' garante que leitores de tela anunciam corretamente sem
// depender da cor.
//
// Tap target: minHeight 56px (acima do mínimo primário do projeto).
// Largura: flex:1 → tudo o que sobra do gap × 7 — em iPhone SE (375
// width − 48 padding − 6×4 gap) ≈ 43px por pill, suficiente para
// "Hoje" (4 chars) ou "Sáb" (3 chars com acento).
export function DayPickerStrip({
  days,
  selectedIndex,
  onSelect,
}: DayPickerStripProps) {
  // Inverte para exibição sem mutar o array original (slice antes de
  // reverse — Array.reverse() é in-place e estragaria o caller).
  const ordered = days
    .map((day, originalIndex) => ({ day, originalIndex }))
    .slice()
    .reverse();

  return (
    <View
      accessibilityRole="tablist"
      accessibilityLabel="Selecionar dia da semana"
      style={styles.row}
    >
      {ordered.map(({ day, originalIndex }) => {
        const isSelected = originalIndex === selectedIndex;
        // 'DD/MM' → 'DD'. Só o dia do mês cabe na pill; o mês fica
        // claro no header do card abaixo ("Hoje, 16/05").
        const dayOfMonth = day.dateLabel.split('/')[0];
        return (
          <Pressable
            key={day.isoDate}
            onPress={() => onSelect(originalIndex)}
            accessibilityRole="tab"
            accessibilityLabel={`${day.weekdayLabel}, ${day.dateLabel}`}
            accessibilityState={{ selected: isSelected }}
            accessibilityHint="Mostra os medicamentos deste dia."
            style={({ pressed }) => [
              styles.pill,
              isSelected && styles.pillSelected,
              pressed && !isSelected && styles.pillPressed,
            ]}
          >
            <Text
              style={[styles.label, isSelected && styles.textSelected]}
              numberOfLines={1}
            >
              {day.weekdayShortLabel}
            </Text>
            <Text
              style={[styles.date, isSelected && styles.textSelected]}
              numberOfLines={1}
            >
              {dayOfMonth}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  pill: {
    flex: 1,
    minHeight: 56,
    paddingVertical: spacing.sm,
    paddingHorizontal: 2,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  pillSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  pillPressed: {
    backgroundColor: colors.primaryLight,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 18,
    color: colors.primary,
  },
  date: {
    ...typography.bodyStrong,
    color: colors.textPrimary,
  },
  textSelected: {
    color: colors.textOnPrimary,
  },
});
