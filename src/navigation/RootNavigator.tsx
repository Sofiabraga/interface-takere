import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { useAuth } from '../hooks/useAuth';
import { colors } from '../theme';
import { AppStack } from './AppStack';
import { AuthStack } from './AuthStack';

export function RootNavigator() {
  const { session, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return session ? <AppStack /> : <AuthStack />;
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
