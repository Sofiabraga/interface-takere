import { Pressable, StyleSheet, Text } from 'react-native';
import { colors, radius, spacing, typography } from '../theme';

interface PrimaryButtonProps {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
  // Frase curta que descreve o resultado do toque para leitores de
  // tela ("Preenche email e senha automaticamente"). Não substitui o
  // label; é lida em seguida pelo VoiceOver/TalkBack.
  accessibilityHint?: string;
}

// Botão padrão do app. Cantos suavemente arredondados (radius.xl) dão
// um ar mais convidativo sem perder a forma reconhecível de botão. O
// primary ainda usa altura 56 (mínimo para ação principal segundo a
// diretriz do projeto); o secondary cai para 48, ainda confortável
// acima do mínimo de 44 e visualmente mais leve para ações de
// navegação. Sombra sutil só no primary cria hierarquia: a ação
// principal "flutua" enquanto as secundárias ficam discretas.
export function PrimaryButton({
  label,
  onPress,
  variant = 'primary',
  disabled = false,
  accessibilityHint,
}: PrimaryButtonProps) {
  const isSecondary = variant === 'secondary';

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled }}
      style={({ pressed }) => [
        styles.base,
        isSecondary ? styles.secondary : styles.primary,
        !isSecondary && !disabled && !pressed && styles.primaryShadow,
        pressed && !disabled && (isSecondary ? styles.secondaryPressed : styles.primaryPressed),
        disabled && styles.disabled,
      ]}
    >
      <Text
        style={[
          styles.label,
          isSecondary && styles.labelSecondary,
          disabled && styles.labelDisabled,
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    width: '100%',
    paddingHorizontal: spacing.lg,
    borderRadius: radius.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primary: {
    minHeight: 56,
    backgroundColor: colors.primary,
  },
  primaryShadow: {
    shadowColor: colors.primaryDark,
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  primaryPressed: {
    backgroundColor: colors.primaryDark,
  },
  secondary: {
    minHeight: 48,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  secondaryPressed: {
    backgroundColor: colors.primaryLight,
  },
  disabled: {
    backgroundColor: colors.surfaceMuted,
    borderColor: colors.border,
  },
  label: {
    ...typography.button,
    color: colors.textOnPrimary,
  },
  labelSecondary: {
    color: colors.primary,
  },
  labelDisabled: {
    color: colors.textMuted,
  },
});
