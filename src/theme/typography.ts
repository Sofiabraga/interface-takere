import { TextStyle } from 'react-native';

export const typography = {
  display: { fontSize: 32, fontWeight: '700', lineHeight: 40 },
  title: { fontSize: 24, fontWeight: '700', lineHeight: 32 },
  sectionTitle: { fontSize: 20, fontWeight: '600', lineHeight: 28 },
  body: { fontSize: 18, fontWeight: '400', lineHeight: 26 },
  bodyStrong: { fontSize: 18, fontWeight: '600', lineHeight: 26 },
  caption: { fontSize: 14, fontWeight: '500', lineHeight: 20 },
  button: { fontSize: 18, fontWeight: '600', lineHeight: 24 },
} as const satisfies Record<string, TextStyle>;
