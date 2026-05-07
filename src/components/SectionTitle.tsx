import { ReactNode } from 'react';
import { StyleSheet, Text } from 'react-native';
import { colors, spacing, typography } from '../theme';

interface SectionTitleProps {
  children: ReactNode;
}

export function SectionTitle({ children }: SectionTitleProps) {
  return (
    <Text accessibilityRole="header" style={styles.text}>
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  text: {
    ...typography.sectionTitle,
    color: colors.textPrimary,
    marginTop: spacing.sm,
  },
});
