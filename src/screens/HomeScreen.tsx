import { Alert } from 'react-native';
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
import { useAuth } from '../hooks/useAuth';
import { useTodayMedications } from '../hooks/useTodayMedications';
import { Routes } from '../navigation/routes';
import { useAppNavigation } from '../navigation/useAppNavigation';

export function HomeScreen() {
  const navigation = useAppNavigation();
  const { signOut } = useAuth();
  const {
    patient,
    dashboard,
    lastTaken,
    actionError,
    markAsTaken,
    undoLastTaken,
  } = useTodayMedications();

  // Gate em AppStack garante que patient não é null aqui em prática;
  // o ?? '' é defensivo e evita um crash em razões pontuais.
  const firstName = patient?.name.split(' ')[0] ?? '';

  function handleViewAll() {
    navigation.navigate(Routes.MedicationList);
  }

  function handleViewHistory() {
    navigation.navigate(Routes.History);
  }

  function handleSignOut() {
    Alert.alert(
      'Sair do app',
      'Tem certeza que quer sair? Você precisará entrar de novo na próxima vez.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sair',
          style: 'destructive',
          onPress: () => {
            void signOut();
          },
        },
      ],
    );
  }

  return (
    <ScreenContainer>
      <AppHeader
        title={`Olá, ${firstName}`}
        subtitle="Aqui você acompanha seus medicamentos de hoje."
      />

      {/* Error tem prioridade sobre success: enquanto o banner de
          erro está visível (~6s), o de sucesso fica esperando; quando
          o timer do erro expira, lastTaken volta a aparecer e o
          usuário pode tentar Desfazer de novo. */}
      {actionError ? (
        <FeedbackBanner message={actionError} variant="error" />
      ) : lastTaken ? (
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
      <PrimaryButton
        label="Sair"
        variant="secondary"
        onPress={handleSignOut}
      />
    </ScreenContainer>
  );
}
