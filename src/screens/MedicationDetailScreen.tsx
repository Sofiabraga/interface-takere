import { ReactNode } from 'react';
import { RouteProp, useRoute } from '@react-navigation/native';
import { StyleSheet, Text, View } from 'react-native';
import { AppHeader } from '../components/AppHeader';
import { Card } from '../components/Card';
import { EmptyState } from '../components/EmptyState';
import { FeedbackBanner } from '../components/FeedbackBanner';
import { PrimaryButton } from '../components/PrimaryButton';
import { ScreenContainer } from '../components/ScreenContainer';
import { StatusBadge } from '../components/StatusBadge';
import { useMedicationDetail } from '../hooks/useMedicationDetail';
import { RootStackParamList } from '../navigation/routes';
import { useAppNavigation } from '../navigation/useAppNavigation';
import { MedicationDetailView } from '../services/MedicationService';
import { colors, spacing, typography } from '../theme';

type MedicationDetailRouteProp = RouteProp<RootStackParamList, 'MedicationDetail'>;

export function MedicationDetailScreen() {
  const navigation = useAppNavigation();
  const route = useRoute<MedicationDetailRouteProp>();
  const { logId } = route.params;
  const { detail, lastTaken, actionError, markAsTaken, undoLastTaken } =
    useMedicationDetail(logId);

  if (!detail) {
    return (
      <ScreenContainer>
        <AppHeader
          title="Medicamento"
          subtitle="Detalhes da agenda de hoje"
          onBack={() => navigation.goBack()}
        />
        <EmptyState
          title="Medicamento não encontrado"
          message="Este item não está mais disponível na agenda de hoje."
        />
      </ScreenContainer>
    );
  }

  const isTaken = detail.status === 'taken';
  const showFeedback = lastTaken !== null && lastTaken.logId === detail.id;

  return (
    <ScreenContainer>
      <AppHeader
        title={detail.medication.name}
        subtitle="Detalhes da agenda de hoje"
        onBack={() => navigation.goBack()}
      />

      {/* Error tem prioridade sobre success — mesma regra usada na
          HomeScreen, para que o feedback negativo da última ação não
          fique escondido pelo banner verde. */}
      {actionError ? (
        <FeedbackBanner message={actionError} variant="error" />
      ) : showFeedback && lastTaken ? (
        <FeedbackBanner
          message={`${lastTaken.medicationName} marcado como tomado.`}
          onUndo={undoLastTaken}
        />
      ) : null}

      <Card>
        <View style={styles.fieldStack}>
          <Field label="Status de hoje">
            <StatusBadge status={detail.status} />
          </Field>
          <Field label="Registro da tomada">
            <Text style={styles.fieldValue}>{getRegistroMessage(detail)}</Text>
          </Field>
        </View>
      </Card>

      <Card>
        <Text style={styles.cardTitle}>Detalhes do medicamento</Text>
        <View style={styles.fieldStack}>
          <Field label="Horário previsto">
            <Text style={styles.fieldValue}>{detail.scheduledTime}</Text>
          </Field>
          <Field label="Dose cadastrada">
            <Text style={styles.fieldValue}>{detail.medication.dose}</Text>
          </Field>
          {detail.medication.instructions ? (
            <Field label="Instruções">
              <Text style={styles.fieldValue}>
                {detail.medication.instructions}
              </Text>
            </Field>
          ) : null}
        </View>
      </Card>

      {!isTaken ? (
        <PrimaryButton
          label="Marcar como tomado"
          onPress={() => markAsTaken(detail.id)}
        />
      ) : null}
    </ScreenContainer>
  );
}

interface FieldProps {
  label: string;
  children: ReactNode;
}

function Field({ label, children }: FieldProps) {
  return (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>{label}</Text>
      {children}
    </View>
  );
}

function getRegistroMessage(detail: MedicationDetailView): string {
  if (detail.status === 'taken') {
    return detail.takenAtTime
      ? `Marcado como tomado às ${detail.takenAtTime}.`
      : 'Marcado como tomado.';
  }
  if (detail.status === 'late') {
    return 'Passou do horário previsto e ainda não foi registrado.';
  }
  return 'Ainda não foi registrado.';
}

const styles = StyleSheet.create({
  cardTitle: {
    ...typography.bodyStrong,
    color: colors.textPrimary,
  },
  fieldStack: {
    gap: spacing.md,
    marginTop: spacing.xs,
  },
  field: {
    gap: spacing.xs,
  },
  fieldLabel: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  fieldValue: {
    ...typography.bodyStrong,
    color: colors.textPrimary,
  },
});
