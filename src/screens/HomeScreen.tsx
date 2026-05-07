import { Alert, StyleSheet, Text, View } from 'react-native';
import { AppHeader } from '../components/AppHeader';
import { Card } from '../components/Card';
import { PrimaryButton } from '../components/PrimaryButton';
import { ScreenContainer } from '../components/ScreenContainer';
import { SectionTitle } from '../components/SectionTitle';
import { StatusBadge } from '../components/StatusBadge';
import {
  TodayMedicationView,
  nextMedication,
  todayMedications,
  todaySummary,
} from '../mocks/medications.mock';
import { mariaSilva } from '../mocks/patients.mock';
import { colors, spacing, typography } from '../theme';

export function HomeScreen() {
  const firstName = mariaSilva.name.split(' ')[0];

  function handleMarkAsTaken() {
    Alert.alert(
      'Em breve',
      'O registro de medicamento ainda está em desenvolvimento.',
    );
  }

  return (
    <ScreenContainer>
      <AppHeader
        title={`Olá, ${firstName}`}
        subtitle="Veja seus medicamentos de hoje."
      />

      <Card>
        <Text style={styles.summaryStrong}>
          Você tem {todaySummary.total} medicamentos hoje.
        </Text>
        <Text style={styles.summary}>
          {todaySummary.taken} já {todaySummary.taken === 1 ? 'tomado' : 'tomados'} e{' '}
          {todaySummary.pending}{' '}
          {todaySummary.pending === 1 ? 'pendente' : 'pendentes'}.
        </Text>
      </Card>

      <SectionTitle>Próximo medicamento</SectionTitle>
      <Card>
        <Text style={styles.nextTime}>{nextMedication.time}</Text>
        <Text style={styles.nextName}>{nextMedication.medication.name}</Text>
        <Text style={styles.nextDose}>{nextMedication.medication.dose}</Text>
        {nextMedication.medication.instructions ? (
          <Text style={styles.nextInstructions}>
            {nextMedication.medication.instructions}
          </Text>
        ) : null}
        <View style={styles.nextActions}>
          <PrimaryButton
            label="Marcar como tomado"
            onPress={handleMarkAsTaken}
          />
        </View>
      </Card>

      <SectionTitle>Medicamentos de hoje</SectionTitle>
      {todayMedications.map((item) => (
        <MedicationRow key={item.id} item={item} />
      ))}
    </ScreenContainer>
  );
}

interface MedicationRowProps {
  item: TodayMedicationView;
}

function MedicationRow({ item }: MedicationRowProps) {
  return (
    <Card>
      <View style={styles.row}>
        <View style={styles.rowMain}>
          <Text style={styles.rowTime}>{item.time}</Text>
          <Text style={styles.rowName}>{item.medication.name}</Text>
          <Text style={styles.rowDose}>{item.medication.dose}</Text>
        </View>
        <StatusBadge status={item.status} />
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  summaryStrong: {
    ...typography.bodyStrong,
    color: colors.textPrimary,
  },
  summary: {
    ...typography.body,
    color: colors.textSecondary,
  },
  nextTime: {
    ...typography.title,
    color: colors.primary,
  },
  nextName: {
    ...typography.title,
    color: colors.textPrimary,
  },
  nextDose: {
    ...typography.body,
    color: colors.textSecondary,
  },
  nextInstructions: {
    ...typography.body,
    color: colors.textSecondary,
  },
  nextActions: {
    marginTop: spacing.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  rowMain: {
    flex: 1,
    gap: spacing.xs,
  },
  rowTime: {
    ...typography.bodyStrong,
    color: colors.primary,
  },
  rowName: {
    ...typography.bodyStrong,
    color: colors.textPrimary,
  },
  rowDose: {
    ...typography.body,
    color: colors.textSecondary,
  },
});
