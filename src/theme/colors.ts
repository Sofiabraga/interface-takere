export const colors = {
  primary: '#0F766E',
  primaryDark: '#0B5953',
  primaryLight: '#CCFBF1',

  background: '#F8FAFC',
  surface: '#FFFFFF',
  surfaceMuted: '#F1F5F9',

  textPrimary: '#0F172A',
  textSecondary: '#475569',
  // textMuted é slate-500 (#64748B): contraste ~4.85:1 sobre branco,
  // passa AA para texto normal e textos pequenos. Antes era slate-400
  // (#94A3B8 → ~2.9:1), que falhava AA em legendas e placeholders.
  textMuted: '#64748B',
  textOnPrimary: '#FFFFFF',

  border: '#E2E8F0',

  statusPendingBg: '#FEF3C7',
  statusPendingText: '#92400E',

  statusTakenBg: '#DCFCE7',
  statusTakenText: '#166534',

  statusLateBg: '#FEE2E2',
  statusLateText: '#991B1B',
} as const;
