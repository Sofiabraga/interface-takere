import { AppHeader } from '../components/AppHeader';
import { Card } from '../components/Card';
import { FeedbackBanner } from '../components/FeedbackBanner';
import { MedicationListItem } from '../components/MedicationListItem';
import { MedicationSummaryCard } from '../components/MedicationSummaryCard';
import { NextMedicationCard } from '../components/NextMedicationCard';
import { PrimaryButton } from '../components/PrimaryButton';
import { ScreenContainer } from '../components/ScreenContainer';
import { SectionTitle } from '../components/SectionTitle';
import { StatusLegend } from '../components/StatusLegend';
import { useTodayMedications } from '../hooks/useTodayMedications';
import { Routes } from '../navigation/routes';
import { useAppNavigation } from '../navigation/useAppNavigation';

export function HomeScreen() {
  const navigation = useAppNavigation();
  const {
    patient,
    dashboard,
    lastTaken,
    markAsTaken,
    undoLastTaken,
  } = useTodayMedications();

  const firstName = patient.name.split(' ')[0];

  function handleViewAll() {
    navigation.navigate(Routes.MedicationList);
  }

  function handleViewHistory() {
    navigation.navigate(Routes.History);
  }

  return (
    <ScreenContainer>
      <AppHeader
        title={`Olá, ${firstName}`}
        subtitle="Aqui você acompanha seus medicamentos de hoje."
      />

      {lastTaken ? (
        <FeedbackBanner
          message={`${lastTaken.medicationName} marcado como tomado.`}
          onUndo={undoLastTaken}
        />
      ) : null}

      <NextMedicationCard next={dashboard.next} onMarkAsTaken={markAsTaken} />

      <MedicationSummaryCard summary={dashboard.summary} />

      <SectionTitle>Medicamentos de hoje</SectionTitle>
      <Card>
        {dashboard.items.map((item, index) => (
          <MedicationListItem
            key={item.id}
            item={item}
            showDivider={index > 0}
            onPress={(tapped) =>
              navigation.navigate(Routes.MedicationDetail, {
                logId: tapped.id,
              })
            }
          />
        ))}
      </Card>

      <StatusLegend />

      <SectionTitle>Mais opções</SectionTitle>
      <PrimaryButton
        label="Ver agenda completa de hoje"
        variant="secondary"
        onPress={handleViewAll}
      />
      <PrimaryButton
        label="Ver histórico de hoje"
        variant="secondary"
        onPress={handleViewHistory}
      />
    </ScreenContainer>
  );
}
