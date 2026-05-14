import { useEffect } from 'react';
import {
  AccessibilityInfo,
  ActivityIndicator,
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, typography } from '../theme';

interface LoadingStateProps {
  // Mensagem exibida abaixo do indicador. Texto curto e em PT-BR
  // coloquial — é o que o usuário ouve quando o leitor de tela
  // anuncia o "alert" desta tela.
  message?: string;
  // Quando passa `fullScreen`, ocupa a viewport inteira com SafeArea
  // (usado pelo RootNavigator e MedicationGate). Quando `false`,
  // renderiza só o bloco — útil para futuros usos inline.
  fullScreen?: boolean;
}

// Componente único para qualquer estado de carregamento — auth
// restaurando sessão, primeira carga de medicamentos, retry após
// erro. Mantém visual coerente (mesma família tipográfica, mesma
// cor primária) e acessibilidade consistente.
export function LoadingState({
  message = 'Carregando…',
  fullScreen = true,
}: LoadingStateProps) {
  useEffect(() => {
    AccessibilityInfo.announceForAccessibility(message);
  }, [message]);

  const content = (
    <View
      accessible
      accessibilityRole="alert"
      accessibilityLabel={message}
      accessibilityLiveRegion={Platform.OS === 'android' ? 'polite' : 'none'}
      style={styles.center}
    >
      <ActivityIndicator size="large" color={colors.primary} />
      <Text style={styles.label}>{message}</Text>
    </View>
  );

  if (!fullScreen) return content;

  return <SafeAreaView style={styles.safe}>{content}</SafeAreaView>;
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
    padding: spacing.lg,
  },
  label: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
