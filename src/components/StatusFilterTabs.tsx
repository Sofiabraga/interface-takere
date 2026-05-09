import { Pressable, StyleSheet, Text, View } from 'react-native';
import { MedicationListFilter } from '../hooks/useMedicationList';
import { colors, radius, spacing } from '../theme';

interface FilterOption {
  value: MedicationListFilter;
  label: string;
}

const options: FilterOption[] = [
  { value: 'all', label: 'Todos' },
  { value: 'pending', label: 'Pendentes' },
  { value: 'taken', label: 'Tomados' },
  { value: 'late', label: 'Atrasados' },
];

interface StatusFilterTabsProps {
  value: MedicationListFilter;
  onChange: (value: MedicationListFilter) => void;
}

export function StatusFilterTabs({ value, onChange }: StatusFilterTabsProps) {
  return (
    <View accessibilityRole="tablist" style={styles.container}>
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <Pressable
            key={option.value}
            onPress={() => onChange(option.value)}
            accessibilityRole="tab"
            accessibilityState={{ selected }}
            accessibilityLabel={option.label}
            style={({ pressed }) => [
              styles.tab,
              selected && styles.tabSelected,
              pressed && !selected && styles.tabPressed,
            ]}
          >
            <Text
              numberOfLines={1}
              adjustsFontSizeToFit
              minimumFontScale={0.85}
              style={[styles.tabLabel, selected && styles.tabLabelSelected]}
            >
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  tab: {
    flex: 1,
    minHeight: 48,
    paddingHorizontal: spacing.xs,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceMuted,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  tabPressed: {
    backgroundColor: colors.primaryLight,
  },
  tabLabel: {
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 22,
    color: colors.textPrimary,
  },
  tabLabelSelected: {
    color: colors.textOnPrimary,
  },
});
