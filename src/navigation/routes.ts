export const Routes = {
  Home: 'Home',
  MedicationList: 'MedicationList',
} as const;

export type RootStackParamList = {
  Home: undefined;
  MedicationList: undefined;
};
