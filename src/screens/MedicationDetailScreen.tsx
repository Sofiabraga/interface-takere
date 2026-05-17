import { ReactNode } from 'react';
import { RouteProp, useRoute } from '@react-navigation/native';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { AppHeader } from '../components/AppHeader';
import { Card } from '../components/Card';
import { EmptyState } from '../components/EmptyState';
import { FeedbackBanner } from '../components/FeedbackBanner';
import { PrimaryButton } from '../components/PrimaryButton';
import { ScreenContainer } from '../components/ScreenContainer';
import { StatusBadge } from '../components/StatusBadge';
import { useMedicationDetail } from '../hooks/useMedicationDetail';
import { useNow } from '../hooks/useNow';
import { RootStackParamList } from '../navigation/routes';
import { useAppNavigation } from '../navigation/useAppNavigation';
import { MedicationDetailView } from '../services/MedicationService';
import { colors, spacing, typography } from '../theme';
import { formatRelativeTime, RelativeTense } from '../utils/relativeTime';

type MedicationDetailRouteProp = RouteProp<RootStackParamList, 'MedicationDetail'>;

export function MedicationDetailScreen() {
  const navigation = useAppNavigation();
  const route = useRoute<MedicationDetailRouteProp>();
  const { logId } = route.params;
  const {
    detail,
    lastTaken,
    lastCorrected,
    actionError,
    markAsTaken,
    undoLastTaken,
    correctTakenLog,
    dismissFeedback,
    dismissCorrected,
    dismissActionError,
  } = useMedicationDetail(logId);
  // useNow precisa ser chamado antes do early-return de !detail.
  const now = useNow();

  // Confirma antes de alterar o registro. Mantém a sessão sem
  // poluição: o Alert é o mesmo padrão usado no logout do ProfileMenu.
  function handleCorrectPress(logId: string) {
    Alert.alert(
      'Corrigir registro?',
      'Este medicamento voltará ao status anterior para hoje.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Corrigir registro',
          onPress: () => {
            void correctTakenLog(logId);
          },
        },
      ],
    );
  }

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
  // Mostramos o tempo relativo apenas quando ainda não foi tomado —
  // após a marcação, "Atrasado em 1h" perde o sentido (já registrou).
  const relative = !isTaken ? formatRelativeTime(detail.scheduledIso, now) : null;

  return (
    <ScreenContainer>
      <AppHeader
        title={detail.medication.name}
        subtitle="Detalhes da agenda de hoje"
        onBack={() => navigation.goBack()}
      />

      {/* Error tem prioridade sobre success — mesma regra usada na
          HomeScreen, para que o feedback negativo da última ação não
          fique escondido pelo banner verde. lastCorrected é mostrado
          após lastTaken, e o provider já garante mutualidade (marcar
          limpa o lastCorrected e vice-versa). */}
      {actionError ? (
        <FeedbackBanner
          message={actionError}
          variant="error"
          onDismiss={dismissActionError}
        />
      ) : showFeedback && lastTaken ? (
        <FeedbackBanner
          message={`${lastTaken.medicationName} marcado como tomado.`}
          onUndo={undoLastTaken}
          onDismiss={dismissFeedback}
        />
      ) : lastCorrected ? (
        <FeedbackBanner
          message={`Registro de ${lastCorrected.medicationName} corrigido.`}
          onDismiss={dismissCorrected}
        />
      ) : null}

      <Card>
        <View style={styles.fieldStack}>
          <Field label="Status de hoje">
            <StatusBadge status={detail.status} />
          </Field>
          <Field label="Detalhes do registro">
            <Text style={styles.fieldValue}>{getRegistroMessage(detail)}</Text>
          </Field>
        </View>
      </Card>

      <Card>
        <Text style={styles.cardTitle}>Detalhes do medicamento</Text>
        <View style={styles.fieldStack}>
          <Field label="Horário previsto">
            <Text style={styles.fieldValue}>{detail.scheduledTime}</Text>
            {relative ? (
              <Text
                style={[
                  styles.relative,
                  relativeColorStyle(relative.tense),
                ]}
                accessibilityLabel={`Em relação ao horário do seu dispositivo: ${relative.label}.`}
              >
                {relative.label}
              </Text>
            ) : null}
          </Field>
          <Field label="Dose">
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
      ) : (
        <PrimaryButton
          label="Corrigir registro"
          variant="secondary"
          onPress={() => handleCorrectPress(detail.id)}
          accessibilityHint="Remove o registro de hoje após confirmação. O medicamento volta para o status anterior."
        />
      )}
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

// Mesma paleta usada no NextMedicationCard, para coerência entre as
// duas telas onde o tempo relativo aparece.
function relativeColorStyle(tense: RelativeTense) {
  switch (tense) {
    case 'future':
      return { color: colors.primaryDark };
    case 'now':
      return { color: colors.statusPendingText };
    case 'past':
      return { color: colors.statusLateText };
  }
}

function getRegistroMessage(detail: MedicationDetailView): string {
  if (detail.status === 'taken') {
    return detail.takenAtTime
      ? `Este medicamento já foi registrado como tomado hoje, às ${detail.takenAtTime}.`
      : 'Este medicamento já foi registrado como tomado hoje.';
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
    // 16 px / weight 500: um passo acima do caption (14) e abaixo do
    // body (18). Mantém a hierarquia entre label e fieldValue
    // (bodyStrong, 18) sem ficar pequeno demais para a persona Maria.
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 22,
    color: colors.textSecondary,
  },
  fieldValue: {
    ...typography.bodyStrong,
    color: colors.textPrimary,
  },
  relative: {
    ...typography.body,
    fontWeight: '600',
    marginTop: spacing.xs,
  },
});
