export const Routes = {
  Home: 'Home',
  MedicationList: 'MedicationList',
  MedicationDetail: 'MedicationDetail',
  History: 'History',
} as const;

export type RootStackParamList = {
  Home: undefined;
  MedicationList: undefined;
  MedicationDetail: { logId: string };
  History: undefined;
};
