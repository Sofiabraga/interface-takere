import { StyleSheet, Text } from 'react-native';
import { colors, spacing, typography } from '../theme';
import { Card } from './Card';

interface EmptyStateProps {
  title: string;
  message: string;
}

export function EmptyState({ title, message }: EmptyStateProps) {
  return (
    <Card>
      <Text accessibilityRole="header" style={styles.title}>
        {title}
      </Text>
      <Text style={styles.message}>{message}</Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  title: {
    ...typography.sectionTitle,
    color: colors.textPrimary,
  },
  message: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
});
