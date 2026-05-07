import { Alert } from 'react-native';
import { AppHeader } from '../components/AppHeader';
import { Card } from '../components/Card';
import { MedicationListItem } from '../components/MedicationListItem';
import { MedicationSummaryCard } from '../components/MedicationSummaryCard';
import { NextMedicationCard } from '../components/NextMedicationCard';
import { PrimaryButton } from '../components/PrimaryButton';
import { ScreenContainer } from '../components/ScreenContainer';
import { SectionTitle } from '../components/SectionTitle';
import { StatusLegend } from '../components/StatusLegend';
import { useTodayMedications } from '../hooks/useTodayMedications';

export function HomeScreen() {
  const { patient, dashboard } = useTodayMedications();
  const firstName = patient.name.split(' ')[0];

  function handleMarkAsTaken() {
    Alert.alert(
      'Em breve',
      'O registro de medicamento ainda está em desenvolvimento.',
    );
  }

  function handleViewAll() {
    Alert.alert(
      'Em breve',
      'A lista completa de medicamentos será disponibilizada em uma próxima etapa.',
    );
  }

  return (
    <ScreenContainer>
      <AppHeader
        title={`Olá, ${firstName}`}
        subtitle="Aqui você acompanha seus medicamentos de hoje."
      />

      <NextMedicationCard
        next={dashboard.next}
        onMarkAsTaken={handleMarkAsTaken}
      />

      <MedicationSummaryCard summary={dashboard.summary} />

      <SectionTitle>Medicamentos de hoje</SectionTitle>
      <Card>
        {dashboard.items.map((item, index) => (
          <MedicationListItem
            key={item.id}
            item={item}
            showDivider={index > 0}
          />
        ))}
      </Card>

      <StatusLegend />

      <PrimaryButton
        label="Ver todos os medicamentos"
        variant="secondary"
        onPress={handleViewAll}
      />
    </ScreenContainer>
  );
}
