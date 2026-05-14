import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, typography } from '../theme';
import { Card } from './Card';
import { PrimaryButton } from './PrimaryButton';

interface ErrorStateProps {
  title: string;
  message: string;
  // Quando definido, renderiza um botão primário com este texto e
  // dispara onRetry. Omita para erros sem ação de recuperação direta.
  retryLabel?: string;
  onRetry?: () => void;
  // Mesma semântica do LoadingState — fullScreen embrulha em
  // SafeAreaView e ocupa a viewport. Use `false` para encaixar o
  // estado em um layout pré-existente.
  fullScreen?: boolean;
}

// Componente único para erros que substituem o conteúdo principal —
// "Não foi possível carregar os medicamentos" e similares. Para
// erros pontuais de ação (Marcar/Desfazer) o app usa o
// FeedbackBanner com variant='error' — ver MedicationProvider.
//
// Status comunicado por **texto + cor**: o título usa a cor de texto
// primária (alto contraste) e fica em um Card branco padrão; não
// dependemos só de cor para sinalizar "isto é um erro".
export function ErrorState({
  title,
  message,
  retryLabel,
  onRetry,
  fullScreen = true,
}: ErrorStateProps) {
  const block = (
    <View style={styles.wrapper}>
      <Card>
        <Text accessibilityRole="header" style={styles.title}>
          {title}
        </Text>
        <Text style={styles.message}>{message}</Text>
        {retryLabel && onRetry ? (
          <View style={styles.action}>
            <PrimaryButton label={retryLabel} onPress={onRetry} />
          </View>
        ) : null}
      </Card>
    </View>
  );

  if (!fullScreen) return block;

  return <SafeAreaView style={styles.safe}>{block}</SafeAreaView>;
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  wrapper: {
    flex: 1,
    justifyContent: 'center',
    padding: spacing.lg,
    gap: spacing.md,
  },
  title: {
    ...typography.title,
    color: colors.textPrimary,
  },
  message: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  action: {
    marginTop: spacing.md,
  },
});
