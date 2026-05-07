import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { MedicationProvider } from './src/contexts/MedicationProvider';
import { RootNavigator } from './src/navigation/RootNavigator';

export default function App() {
  return (
    <SafeAreaProvider>
      <MedicationProvider>
        <NavigationContainer>
          <RootNavigator />
        </NavigationContainer>
      </MedicationProvider>
    </SafeAreaProvider>
  );
}
