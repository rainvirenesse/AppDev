export const COLORS = {
  burgundy: '#35051d',
  burgundyLight: '#4a0a2a',
  gold: '#C9A96E',
  goldLight: '#E8D5A8',
  white: '#FFFFFF',
  offWhite: '#F8F5F0',
  textDark: '#1a1a1a',
  textMuted: '#6b6b6b',
  border: 'rgba(53, 5, 29, 0.12)',
  danger: '#c0392b',
  success: '#2d6a4f',
} as const;

export const formatPrice = (amount: number): string =>
  `₱${amount.toLocaleString('en-PH', { minimumFractionDigits: 2 })}`;
