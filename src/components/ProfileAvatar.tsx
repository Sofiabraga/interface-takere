import {
  Image,
  ImageSourcePropType,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { colors, radius, typography } from '../theme';

interface ProfileAvatarProps {
  name: string;
  size?: 'sm' | 'lg';
  // Quando presente, a foto é renderizada no lugar das iniciais.
  // Aceita require() local ({ uri } funciona também, mas no escopo
  // atual só usamos asset local — sem rede, sem URL pessoal real).
  photoSource?: ImageSourcePropType;
  onPress?: () => void;
  accessibilityLabel?: string;
}

// Calcula iniciais a partir do nome completo. Pega a primeira letra
// da primeira e da última palavra. Nome de uma palavra só retorna uma
// letra. Devolve string vazia se o nome estiver vazio — o consumer
// renderiza um placeholder visual.
export function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '';
  if (parts.length === 1) return parts[0]!.charAt(0).toUpperCase();
  const first = parts[0]!.charAt(0);
  const last = parts[parts.length - 1]!.charAt(0);
  return (first + last).toUpperCase();
}

// Avatar circular com iniciais. Sem fotos reais: é um app de demo de
// TCC, e iniciais deixam claro que o "rosto" do usuário é só um
// marcador identificador, não uma imagem pessoal. Cor de fundo
// primary com texto branco garante contraste AA (testado: ~6.4:1).
//
// size="sm" é a versão clicável no topo da Home; size="lg" é a versão
// destacada dentro do ProfileMenu, onde o usuário confirma quem está
// logado.
export function ProfileAvatar({
  name,
  size = 'sm',
  photoSource,
  onPress,
  accessibilityLabel,
}: ProfileAvatarProps) {
  const initials = getInitials(name);
  const dimensionStyle = size === 'lg' ? styles.lg : styles.sm;
  const textStyle = size === 'lg' ? styles.textLg : styles.textSm;

  const content = photoSource ? (
    <Image
      source={photoSource}
      style={styles.image}
      resizeMode="cover"
      accessibilityIgnoresInvertColors
    />
  ) : (
    <Text
      style={textStyle}
      accessibilityElementsHidden
      importantForAccessibility="no"
    >
      {initials || '—'}
    </Text>
  );

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel ?? `Abrir perfil de ${name}`}
        style={({ pressed }) => [
          styles.base,
          dimensionStyle,
          pressed && styles.pressed,
        ]}
        hitSlop={8}
      >
        {content}
      </Pressable>
    );
  }

  return <View style={[styles.base, dimensionStyle]}>{content}</View>;
}

const styles = StyleSheet.create({
  base: {
    backgroundColor: colors.primary,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.primaryLight,
    // overflow: 'hidden' garante que a Image interna fique clipada no
    // círculo do avatar quando photoSource está presente.
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  sm: {
    width: 52,
    height: 52,
  },
  lg: {
    width: 72,
    height: 72,
    borderWidth: 3,
  },
  pressed: {
    backgroundColor: colors.primaryDark,
  },
  textSm: {
    ...typography.bodyStrong,
    color: colors.textOnPrimary,
    fontSize: 20,
    lineHeight: 24,
  },
  textLg: {
    ...typography.title,
    color: colors.textOnPrimary,
    fontSize: 28,
    lineHeight: 32,
  },
});
