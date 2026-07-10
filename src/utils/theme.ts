export const Theme = {
  colors: {
    primary: '#05C48F',
    secondary: '#05C48F',
    background: '#0A0B0D',
    card: '#13151A',
    text: '#FFFFFF', // White text
    textSecondary: '#8E9AA6', // Muted grey-blue text
    border: '#1E222A', // Dark borders
    success: '#05C48F', // Emerald green
    warning: '#EAB308', // Amber yellow
    error: '#EF4444', // Red
    white: '#FFFFFF',
    overlay: 'rgba(0, 0, 0, 0.6)',
    glassBackground: 'rgba(19, 21, 26, 0.85)',
  },
  roundness: {
    small: 8,
    medium: 12,
    large: 16,
    extraLarge: 24,
    round: 9999,
  },
  shadows: {
    small: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 3,
      elevation: 2,
    },
    medium: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.4,
      shadowRadius: 6,
      elevation: 4,
    },
    large: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.5,
      shadowRadius: 12,
      elevation: 8,
    },
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
};
