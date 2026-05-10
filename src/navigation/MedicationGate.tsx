import { ReactNode } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card } from '../components/Card';
import { PrimaryButton } from '../components/PrimaryButton';
import { useMedicationContext } from '../contexts/MedicationProvider';
import { useAuth } from '../hooks/useAuth';
import { colors, spacing, typography } from '../theme';

interface MedicationGateProps {
  children: ReactNode;
}

// Esconde a navegação enquanto a primeira carga de medicamentos /
// profile está em andamento, e troca por uma tela de erro com
// "Tentar novamente" se a carga falhar. Reloads explícitos (via
// reload()) também passam pelo loading; nesta etapa não há
// pull-to-refresh, então não há ruído de "spinner toda hora".
//
// O gate é separado do AppStack para que o useMedicationContext()
// rode dentro do <MedicationProvider>.
export function MedicationGate({ children }: MedicationGateProps) {
  const { profile } = useAuth();
  const { isLoading, error, reload, logs, medications, schedules } =
    useMedicationContext();

  const hasData =
    logs.length > 0 || medications.length > 0 || schedules.length > 0;
  const showLoading = (isLoading || profile === null) && !error;

  if (showLoading && !hasData) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Carregando medicamentos…</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.errorWrapper}>
          <Card>
            <Text accessibilityRole="header" style={styles.errorTitle}>
              Não foi possível carregar
            </Text>
            <Text style={styles.errorMessage}>{error}</Text>
            <View style={styles.errorButton}>
              <PrimaryButton label="Tentar novamente" onPress={reload} />
            </View>
          </Card>
        </View>
      </SafeAreaView>
    );
  }

  return <>{children}</>;
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
  loadingText: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  errorWrapper: {
    flex: 1,
    justifyContent: 'center',
    padding: spacing.lg,
    gap: spacing.md,
  },
  errorTitle: {
    ...typography.title,
    color: colors.textPrimary,
  },
  errorMessage: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  errorButton: {
    marginTop: spacing.md,
  },
});
