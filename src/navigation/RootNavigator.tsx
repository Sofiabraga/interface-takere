import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeScreen } from '../screens/HomeScreen';
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
    </Stack.Navigator>
  );
}
