export const Routes = {
  Login: 'Login',
  Home: 'Home',
  MedicationList: 'MedicationList',
  MedicationDetail: 'MedicationDetail',
  History: 'History',
} as const;

export type AuthStackParamList = {
  Login: undefined;
};

export type AppStackParamList = {
  Home: undefined;
  MedicationList: undefined;
  MedicationDetail: { logId: string };
  History: undefined;
};

// Mantido por retrocompatibilidade com `useAppNavigation`/screens existentes.
export type RootStackParamList = AppStackParamList;
