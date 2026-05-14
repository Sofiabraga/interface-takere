import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card } from '../components/Card';
import { PrimaryButton } from '../components/PrimaryButton';
import { SectionTitle } from '../components/SectionTitle';
import { useAuth } from '../hooks/useAuth';
import { colors, radius, spacing, typography } from '../theme';

interface DemoPersona {
  label: string;
  email: string;
  password: string;
}

const demoPersonas: DemoPersona[] = [
  {
    label: 'Entrar como Maria',
    email: 'maria.demo@takere.test',
    password: 'demo-maria-2026',
  },
  {
    label: 'Entrar como Carlos',
    email: 'carlos.demo@takere.test',
    password: 'demo-carlos-2026',
  },
  {
    label: 'Entrar como Ana',
    email: 'ana.demo@takere.test',
    password: 'demo-ana-2026',
  },
];

export function LoginScreen() {
  const { signIn, authError, clearError } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSignIn = async () => {
    const trimmedEmail = email.trim();
    if (!trimmedEmail || !password || isSubmitting) return;
    setIsSubmitting(true);
    await signIn(trimmedEmail, password);
    setIsSubmitting(false);
  };

  const handlePickDemo = (persona: DemoPersona) => {
    clearError();
    setEmail(persona.email);
    setPassword(persona.password);
  };

  const canSubmit =
    email.trim().length > 0 && password.length > 0 && !isSubmitting;

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Text accessibilityRole="header" style={styles.title}>
            Takere
          </Text>
          <Text style={styles.subtitle}>
            Acompanhe seus medicamentos do dia.
          </Text>

          <View style={styles.demoBadge}>
            <Text style={styles.demoBadgeText}>
              Ambiente de demonstração acadêmica. Os usuários e medicamentos
              são fictícios.
            </Text>
          </View>

          <Card>
            <Text style={styles.label}>Email</Text>
            <TextInput
              accessibilityLabel="Email"
              value={email}
              onChangeText={(text) => {
                clearError();
                setEmail(text);
              }}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
              textContentType="emailAddress"
              placeholder="seu@email.com"
              placeholderTextColor={colors.textMuted}
              style={styles.input}
              editable={!isSubmitting}
            />

            <Text style={[styles.label, styles.labelSpacing]}>Senha</Text>
            <TextInput
              accessibilityLabel="Senha"
              value={password}
              onChangeText={(text) => {
                clearError();
                setPassword(text);
              }}
              secureTextEntry
              textContentType="password"
              placeholder="Sua senha"
              placeholderTextColor={colors.textMuted}
              style={styles.input}
              editable={!isSubmitting}
              onSubmitEditing={handleSignIn}
              returnKeyType="go"
            />

            {authError ? (
              <View accessibilityRole="alert" style={styles.errorBox}>
                <Text style={styles.errorText}>{authError}</Text>
              </View>
            ) : null}

            <View style={styles.submitWrap}>
              <PrimaryButton
                label={isSubmitting ? 'Entrando…' : 'Entrar'}
                onPress={handleSignIn}
                disabled={!canSubmit}
              />
            </View>
          </Card>

          <SectionTitle>Perfis de demonstração</SectionTitle>
          <Text style={styles.helperText}>
            Toque em um perfil para preencher email e senha. Depois toque em
            "Entrar".
          </Text>
          {demoPersonas.map((persona) => (
            <PrimaryButton
              key={persona.email}
              label={persona.label}
              variant="secondary"
              onPress={() => handlePickDemo(persona)}
              disabled={isSubmitting}
            />
          ))}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  flex: {
    flex: 1,
  },
  content: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
    gap: spacing.md,
  },
  title: {
    ...typography.display,
    color: colors.primary,
    marginTop: spacing.md,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
  },
  demoBadge: {
    backgroundColor: colors.primaryLight,
    borderRadius: radius.md,
    padding: spacing.md,
  },
  demoBadgeText: {
    ...typography.body,
    color: colors.primaryDark,
  },
  label: {
    ...typography.bodyStrong,
    color: colors.textPrimary,
  },
  labelSpacing: {
    marginTop: spacing.md,
  },
  input: {
    ...typography.body,
    color: colors.textPrimary,
    minHeight: 56,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.surface,
    marginTop: spacing.xs,
  },
  errorBox: {
    backgroundColor: colors.statusLateBg,
    borderRadius: radius.md,
    padding: spacing.md,
    marginTop: spacing.md,
  },
  errorText: {
    ...typography.bodyStrong,
    color: colors.statusLateText,
  },
  submitWrap: {
    marginTop: spacing.md,
  },
  helperText: {
    ...typography.body,
    color: colors.textSecondary,
  },
});
