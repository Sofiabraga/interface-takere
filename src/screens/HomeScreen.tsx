import { useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { Card } from '../components/Card';
import { FeedbackBanner } from '../components/FeedbackBanner';
import { MedicationListItem } from '../components/MedicationListItem';
import { MedicationSummaryCard } from '../components/MedicationSummaryCard';
import { NextMedicationCard } from '../components/NextMedicationCard';
import { PrimaryButton } from '../components/PrimaryButton';
import { ProfileAvatar } from '../components/ProfileAvatar';
import { ProfileMenu } from '../components/ProfileMenu';
import { ScreenContainer } from '../components/ScreenContainer';
import { SectionTitle } from '../components/SectionTitle';
import { StatusLegend } from '../components/StatusLegend';
import { getProfilePhoto } from '../assets/profilePhotos';
import { useMedicationContext } from '../contexts/MedicationProvider';
import { useAuth } from '../hooks/useAuth';
import { useMedicationHistory } from '../hooks/useMedicationHistory';
import { useTodayMedications } from '../hooks/useTodayMedications';
import { Routes } from '../navigation/routes';
import { useAppNavigation } from '../navigation/useAppNavigation';
import { colors, spacing, typography } from '../theme';

export function HomeScreen() {
  const navigation = useAppNavigation();
  const { user, signOut } = useAuth();
  const { medications } = useMedicationContext();
  const { monthly } = useMedicationHistory();
  const {
    patient,
    dashboard,
    lastTaken,
    actionError,
    markAsTaken,
    undoLastTaken,
  } = useTodayMedications();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Gate em AppStack garante que patient não é null aqui em prática;
  // o ?? '' é defensivo e evita um crash em razões pontuais.
  const fullName = patient?.name ?? '';
  const firstName = fullName.split(' ')[0] ?? '';
  const photoSource = getProfilePhoto(user?.email);

  function handleViewAll() {
    navigation.navigate(Routes.MedicationList);
  }

  function handleViewHistory() {
    navigation.navigate(Routes.History);
  }

  function handleOpenProfile() {
    setIsProfileOpen(true);
  }

  function handleCloseProfile() {
    setIsProfileOpen(false);
  }

  function handleSignOutPress() {
    Alert.alert(
      'Sair da conta',
      'Você precisará entrar novamente para acessar seus registros.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sair',
          style: 'destructive',
          onPress: () => {
            setIsProfileOpen(false);
            void signOut();
          },
        },
      ],
    );
  }

  return (
    <ScreenContainer>
      {/* Cabeçalho da Home: saudação ocupa o lado esquerdo (peso
          visual normal); avatar fica encostado à direita como
          ponto de entrada discreto pro menu de perfil. Não compete
          com a NextMedicationCard, que continua sendo o destaque
          principal da tela. */}
      <View style={styles.header}>
        <View style={styles.greeting}>
          <Text accessibilityRole="header" style={styles.title}>
            Olá, {firstName}
          </Text>
          <Text style={styles.subtitle}>
            Aqui você acompanha seus medicamentos de hoje.
          </Text>
        </View>
        {fullName ? (
          <ProfileAvatar
            name={fullName}
            photoSource={photoSource}
            onPress={handleOpenProfile}
            accessibilityLabel={`Perfil de ${fullName}. Toque para abrir o menu.`}
          />
        ) : null}
      </View>

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

      {dashboard.items.length > 0 ? (
        <>
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
        </>
      ) : null}

      <SectionTitle>Mais opções</SectionTitle>
      <PrimaryButton
        label="Ver agenda completa de hoje"
        variant="secondary"
        onPress={handleViewAll}
      />
      <PrimaryButton
        label="Ver histórico"
        variant="secondary"
        onPress={handleViewHistory}
      />

      <ProfileMenu
        visible={isProfileOpen}
        name={fullName}
        email={user?.email ?? null}
        age={patient?.age ?? null}
        totalMedications={medications.length}
        monthlyAdherence={monthly?.summary ?? null}
        photoSource={photoSource}
        onClose={handleCloseProfile}
        onSignOut={handleSignOutPress}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.sm,
  },
  greeting: {
    flex: 1,
    gap: spacing.sm,
  },
  title: {
    ...typography.title,
    color: colors.textPrimary,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
  },
});
