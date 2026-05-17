import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, radius, spacing, typography } from '../theme';
import { PrimaryButton } from './PrimaryButton';
import { ProfileAvatar } from './ProfileAvatar';

interface MonthlyAdherence {
  totalPlanned: number;
  totalRegistered: number;
  percent: number | null;
}

interface ProfileMenuProps {
  visible: boolean;
  name: string;
  email: string | null;
  age: number | null;
  totalMedications: number;
  monthlyAdherence: MonthlyAdherence | null;
  onClose: () => void;
  onSignOut: () => void;
}

// Menu de perfil expandido. Hierarquia do conteúdo, de cima pra
// baixo: identidade (quem está logado) → resumo neutro de dados →
// transparência sobre o status de demo → ações (sair/fechar) →
// rodapé acadêmico. A ação destrutiva fica próxima do final, mas
// acima do rodapé, separando "interação" de "informação".
//
// Envolvemos o conteúdo num ScrollView pra não correr o risco de o
// botão Sair sair da tela em aparelhos pequenos (iPhone SE) — o
// menu cresceu o suficiente pra justificar isso.
export function ProfileMenu({
  visible,
  name,
  email,
  age,
  totalMedications,
  monthlyAdherence,
  onClose,
  onSignOut,
}: ProfileMenuProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable
        style={styles.backdrop}
        accessibilityLabel="Fechar menu de perfil"
        accessibilityRole="button"
        onPress={onClose}
      >
        {/* Pressable interno absorve toques no card para que ele não
            feche junto com o backdrop. */}
        <Pressable style={styles.sheetWrapper} onPress={() => undefined}>
          <SafeAreaView edges={['bottom']} style={styles.safe}>
            <ScrollView
              contentContainerStyle={styles.sheet}
              showsVerticalScrollIndicator={false}
              bounces={false}
            >
              <View style={styles.handle} />

              <View style={styles.identityRow}>
                <ProfileAvatar name={name} size="lg" />
                <View style={styles.identityText}>
                  <Text
                    accessibilityRole="header"
                    style={styles.name}
                  >
                    {name}
                  </Text>
                  {email ? (
                    <Text style={styles.identityLine}>{email}</Text>
                  ) : null}
                  {age !== null ? (
                    <Text style={styles.identityLine}>{age} anos</Text>
                  ) : null}
                  <Text style={styles.demoLabel}>
                    Perfil de demonstração
                  </Text>
                </View>
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Seus números</Text>
                <Text style={styles.body}>
                  {totalMedications === 1
                    ? '1 medicamento cadastrado'
                    : `${totalMedications} medicamentos cadastrados`}
                </Text>
                <AdherenceBlock adherence={monthlyAdherence} />
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>
                  Sobre esta demonstração
                </Text>
                <Text style={styles.helper}>
                  Os dados deste app são fictícios e existem para fins de
                  avaliação acadêmica. Nenhuma informação real de saúde é
                  coletada.
                </Text>
              </View>

              <Text style={styles.helper}>
                Você precisará entrar novamente para acessar seus registros.
              </Text>

              <View style={styles.actions}>
                <PrimaryButton
                  label="Sair da conta"
                  variant="secondary"
                  onPress={onSignOut}
                />
                <PrimaryButton
                  label="Fechar"
                  variant="secondary"
                  onPress={onClose}
                />
              </View>

              <Text style={styles.footer}>
                Takere · TCC em Ciência da Computação · UFRGS · 2026
              </Text>
            </ScrollView>
          </SafeAreaView>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

// Bloco de aderência dos últimos 30 dias. Quando percent é null
// (paciente sem prescrição na janela) mostramos um placeholder neutro
// em vez de barra zerada — barra zerada poderia ser interpretada como
// "você não tomou nada", que não é o significado real.
//
// Cor única (primary) na barra: evitar verde/amarelo/vermelho aqui é
// uma escolha consciente. Aderência neste app é contabilidade
// passiva, não avaliação clínica — usar paleta de status sugeriria
// julgamento e abriria espaço pra avaliador de IHC questionar o tom.
function AdherenceBlock({ adherence }: { adherence: MonthlyAdherence | null }) {
  if (!adherence || adherence.percent === null) {
    return (
      <>
        <Text style={styles.body}>Últimos 30 dias: —</Text>
        <Text style={styles.caption}>
          Sem registros nos últimos 30 dias.
        </Text>
      </>
    );
  }

  const widthPercent = Math.min(100, Math.max(0, adherence.percent));

  return (
    <>
      <Text style={styles.body}>Últimos 30 dias: {adherence.percent}%</Text>
      <View
        style={styles.barTrack}
        accessibilityRole="progressbar"
        accessibilityLabel={`Aderência dos últimos 30 dias: ${adherence.percent}%`}
        accessibilityValue={{ min: 0, max: 100, now: adherence.percent }}
      >
        <View style={[styles.barFill, { width: `${widthPercent}%` }]} />
      </View>
      <Text style={styles.caption}>
        {adherence.totalRegistered} de {adherence.totalPlanned} registros
      </Text>
    </>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
    justifyContent: 'flex-end',
  },
  sheetWrapper: {
    width: '100%',
    maxHeight: '90%',
  },
  safe: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
  },
  sheet: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.lg,
    gap: spacing.md,
  },
  handle: {
    alignSelf: 'center',
    width: 48,
    height: 5,
    borderRadius: radius.pill,
    backgroundColor: colors.border,
    marginBottom: spacing.sm,
  },
  identityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  identityText: {
    flex: 1,
    gap: spacing.xs,
  },
  name: {
    ...typography.title,
    color: colors.textPrimary,
  },
  identityLine: {
    ...typography.body,
    color: colors.textSecondary,
  },
  demoLabel: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },
  section: {
    gap: spacing.sm,
  },
  sectionTitle: {
    ...typography.bodyStrong,
    color: colors.textPrimary,
  },
  body: {
    ...typography.body,
    color: colors.textSecondary,
  },
  caption: {
    ...typography.caption,
    color: colors.textMuted,
  },
  helper: {
    ...typography.body,
    color: colors.textSecondary,
  },
  barTrack: {
    height: 8,
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceMuted,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: radius.pill,
  },
  actions: {
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  footer: {
    ...typography.caption,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
});
