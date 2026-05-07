import { StyleSheet, Text, View } from 'react-native';
import { mariaSilva } from '../mocks/patients.mock';

export function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.greeting}>Olá, {mariaSilva.name}</Text>
      <Text style={styles.subtitle}>Tela inicial em construção.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#fff',
  },
  greeting: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#444',
  },
});
