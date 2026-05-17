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

export type FeedbackBannerVariant = 'success' | 'error';

interface FeedbackBannerProps {
  message: string;
  variant?: FeedbackBannerVariant;
  // "Desfazer" no caso success; ausente no caso error.
  undoLabel?: string;
  onUndo?: () => void;
  // Quando presente, o banner inteiro vira tocável e o tap dispensa.
  // O Pressable interno do "Desfazer" captura o gesto antes (padrão
  // do responder system do RN), então tocar no botão de Desfazer
  // ainda aciona `onUndo` e não dispara `onDismiss`. O timeout
  // automático no MedicationProvider continua funcionando como
  // fallback de segurança caso o usuário não toque.
  onDismiss?: () => void;
}

// Componente reutilizado para feedback positivo ("X marcado como
// tomado", com Desfazer) e negativo ("Não foi possível salvar a
// alteração."). Status comunicado por **texto + cor**, em linha com a
// diretriz de acessibilidade do projeto.
export function FeedbackBanner({
  message,
  variant = 'success',
  undoLabel = 'Desfazer',
  onUndo,
  onDismiss,
}: FeedbackBannerProps) {
  useEffect(() => {
    AccessibilityInfo.announceForAccessibility(message);
  }, [message]);

  const isError = variant === 'error';
  const palette = isError
    ? {
        background: colors.statusLateBg,
        text: colors.statusLateText,
        // rgba do statusLateText (#991B1B) com 12% para o pressed state
        pressedBg: 'rgba(153, 27, 27, 0.12)',
      }
    : {
        background: colors.statusTakenBg,
        text: colors.statusTakenText,
        pressedBg: 'rgba(22, 101, 52, 0.12)',
      };

  const dismissable = onDismiss != null;

  const inner = (
    <>
      <Text style={[styles.message, { color: palette.text }]}>{message}</Text>
      {onUndo ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={undoLabel}
          accessibilityHint="Reverte a última ação de marcar como tomado."
          onPress={onUndo}
          style={({ pressed }) => [
            styles.undoButton,
            pressed && { backgroundColor: palette.pressedBg },
          ]}
        >
          <Text style={[styles.undoText, { color: palette.text }]}>
            {undoLabel}
          </Text>
        </Pressable>
      ) : null}
    </>
  );

  if (dismissable) {
    return (
      <Pressable
        accessibilityRole="alert"
        accessibilityLiveRegion={Platform.OS === 'android' ? 'polite' : 'none'}
        accessibilityHint="Toque para fechar esta mensagem."
        onPress={onDismiss}
        style={({ pressed }) => [
          styles.banner,
          { backgroundColor: palette.background },
          pressed && styles.bannerPressed,
        ]}
      >
        {inner}
      </Pressable>
    );
  }

  return (
    <View
      accessibilityRole="alert"
      accessibilityLiveRegion={Platform.OS === 'android' ? 'polite' : 'none'}
      style={[styles.banner, { backgroundColor: palette.background }]}
    >
      {inner}
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
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
  bannerPressed: {
    opacity: 0.85,
  },
  message: {
    ...typography.bodyStrong,
    flex: 1,
  },
  undoButton: {
    minHeight: 44,
    paddingHorizontal: spacing.md,
    justifyContent: 'center',
    borderRadius: radius.md,
  },
  undoText: {
    ...typography.bodyStrong,
    textDecorationLine: 'underline',
  },
});
