import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HistoryScreen } from '../screens/HistoryScreen';
import { HomeScreen } from '../screens/HomeScreen';
import { MedicationDetailScreen } from '../screens/MedicationDetailScreen';
import { MedicationListScreen } from '../screens/MedicationListScreen';
import { Routes, RootStackParamList } from './routes';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  return (
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
  );
}
