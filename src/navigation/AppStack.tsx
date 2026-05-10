import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MedicationProvider } from '../contexts/MedicationProvider';
import { HistoryScreen } from '../screens/HistoryScreen';
import { HomeScreen } from '../screens/HomeScreen';
import { MedicationDetailScreen } from '../screens/MedicationDetailScreen';
import { MedicationListScreen } from '../screens/MedicationListScreen';
import { AppStackParamList, Routes } from './routes';

const Stack = createNativeStackNavigator<AppStackParamList>();

// MedicationProvider vive aqui dentro: só monta após login e
// desmonta no logout, evitando que estado de uma sessão "vaze" para a próxima.
export function AppStack() {
  return (
    <MedicationProvider>
      <Stack.Navigator
        initialRouteName={Routes.Home}
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name={Routes.Home} component={HomeScreen} />
        <Stack.Screen
          name={Routes.MedicationList}
          component={MedicationListScreen}
        />
        <Stack.Screen
          name={Routes.MedicationDetail}
          component={MedicationDetailScreen}
        />
        <Stack.Screen name={Routes.History} component={HistoryScreen} />
      </Stack.Navigator>
    </MedicationProvider>
  );
}
