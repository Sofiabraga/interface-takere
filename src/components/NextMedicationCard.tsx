import { StyleSheet, Text, View } from 'react-native';
import { TodayMedicationView } from '../services/MedicationService';
import { colors, spacing, typography } from '../theme';
import { Card } from './Card';
import { PrimaryButton } from './PrimaryButton';
import { StatusBadge } from './StatusBadge';

interface NextMedicationCardProps {
  next: TodayMedicationView | null;
  onMarkAsTaken: (logId: string) => void;
}

// Card destacado da Home. Layout otimizado para escaneamento rápido
// pela Maria (68 anos): hora grande à esquerda como "carimbo" visual,
// info do medicamento empilhada à direita. Eyebrow no topo substitui
// o pill chip da versão anterior — economiza altura sem perder a
// pista de contexto ("Próximo medicamento") e deixa o badge de status
// ocupar o canto direito sem competir com outro pill colorido.
export function NextMedicationCard({ next, onMarkAsTaken }: NextMedicationCardProps) {
  if (!next) {
    return (
      <Card>
        <Text style={styles.eyebrowPositive}>Tudo em dia</Text>
        <Text style={styles.emptyText}>
          Nenhum medicamento pendente neste momento. Continue assim!
        </Text>
      </Card>
    );
  }

  return (
    <Card>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>Próximo medicamento</Text>
        <StatusBadge status={next.status} />
      </View>

      <View style={styles.mainRow}>
        <Text style={styles.time}>{next.scheduledTime}</Text>
        <View style={styles.info}>
          <Text style={styles.name}>{next.medication.name}</Text>
          <Text style={styles.dose}>{next.medication.dose}</Text>
        </View>
      </View>

      {next.medication.instructions ? (
        <Text style={styles.instructions}>{next.medication.instructions}</Text>
      ) : null}

      <View style={styles.actions}>
        <PrimaryButton
          label="Marcar como tomado"
          onPress={() => onMarkAsTaken(next.id)}
        />
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  eyebrow: {
    ...typography.caption,
    color: colors.primaryDark,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  eyebrowPositive: {
    ...typography.caption,
    color: colors.statusTakenText,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  emptyText: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  mainRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginTop: spacing.xs,
  },
  time: {
    ...typography.display,
    color: colors.primary,
  },
  info: {
    flex: 1,
    gap: 2,
  },
  name: {
    ...typography.title,
    color: colors.textPrimary,
  },
  dose: {
    ...typography.body,
    color: colors.textSecondary,
  },
  instructions: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  actions: {
    marginTop: spacing.md,
  },
});
