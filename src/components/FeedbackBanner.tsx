import { useEffect } from 'react';
import {
  AccessibilityInfo,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { colors, radius, spacing, typography } from '../theme';

interface FeedbackBannerProps {
  message: string;
  undoLabel?: string;
  onUndo?: () => void;
}

export function FeedbackBanner({
  message,
  undoLabel = 'Desfazer',
  onUndo,
}: FeedbackBannerProps) {
  useEffect(() => {
    AccessibilityInfo.announceForAccessibility(message);
  }, [message]);

  return (
    <View
      accessibilityRole="alert"
      accessibilityLiveRegion={Platform.OS === 'android' ? 'polite' : 'none'}
      style={styles.banner}
    >
      <Text style={styles.message}>{message}</Text>
      {onUndo ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={undoLabel}
          onPress={onUndo}
          style={({ pressed }) => [styles.undoButton, pressed && styles.undoPressed]}
        >
          <Text style={styles.undoText}>{undoLabel}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    backgroundColor: colors.statusTakenBg,
    borderRadius: radius.lg,
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  message: {
    ...typography.bodyStrong,
    color: colors.statusTakenText,
    flex: 1,
  },
  undoButton: {
    minHeight: 44,
    paddingHorizontal: spacing.md,
    justifyContent: 'center',
    borderRadius: radius.md,
  },
  undoPressed: {
    backgroundColor: 'rgba(22, 101, 52, 0.12)',
  },
  undoText: {
    ...typography.bodyStrong,
    color: colors.statusTakenText,
    textDecorationLine: 'underline',
  },
});
