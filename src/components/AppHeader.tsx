import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing, typography } from '../theme';

interface AppHeaderProps {
  title: string;
  subtitle?: string;
  onBack?: () => void;
}

export function AppHeader({ title, subtitle, onBack }: AppHeaderProps) {
  return (
    <View style={styles.container}>
      {onBack ? (
        <Pressable
          onPress={onBack}
          accessibilityRole="button"
          accessibilityLabel="Voltar"
          style={({ pressed }) => [
            styles.backButton,
            pressed && styles.backPressed,
          ]}
        >
          <Text style={styles.backText}>← Voltar</Text>
        </Pressable>
      ) : null}
      <Text accessibilityRole="header" style={styles.title}>
        {title}
      </Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: spacing.sm,
    gap: spacing.sm,
  },
  backButton: {
    minHeight: 44,
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    marginLeft: -spacing.sm,
    borderRadius: radius.sm,
    justifyContent: 'center',
  },
  backPressed: {
    backgroundColor: colors.primaryLight,
  },
  backText: {
    ...typography.bodyStrong,
    color: colors.primary,
  },
  title: {
    ...typography.title,
    color: colors.textPrimary,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
  },
});
