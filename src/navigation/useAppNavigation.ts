import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from './routes';

export type AppNavigationProp = NativeStackNavigationProp<RootStackParamList>;

export function useAppNavigation(): AppNavigationProp {
  return useNavigation<AppNavigationProp>();
}
