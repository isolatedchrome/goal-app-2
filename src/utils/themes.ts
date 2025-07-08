import { ColorTheme, ThemeName } from '../types';

export const themes: Record<ThemeName, ColorTheme> = {
  'cream-espresso': {
    name: 'cream-espresso',
    displayName: 'Cream & Espresso',
    colors: {
      cream: '#faf8f5',
      warmWhite: '#ffffff',
      parchment: '#f5f2ed',
      primary: '#2d4a2b',
      primaryLight: '#4a6b47',
      primaryDark: '#1a2e19',
      secondary: '#4a3429',
      secondaryLight: '#6b4d3d',
      secondaryDark: '#2e1f17',
      accent: '#2d4a2b',
      accentLight: '#4a6b47',
      accentDark: '#1a2e19',
      warmGray: '#8b7d73',
      warmGrayLight: '#a69990',
      warmGrayDark: '#6b5d53',
      charcoal: '#2e1f17',
      ink: '#1a1a1a',
      amber: '#d4b896',
      amberLight: '#e6d1b3',
      rose: '#c4a8a8',
      lavender: '#b8b8c4'
    }
  }
};

export const applyTheme = (theme: ColorTheme) => {
  const root = document.documentElement;
  
  // Base colors
  root.style.setProperty('--color-cream', theme.colors.cream);
  root.style.setProperty('--color-warm-white', theme.colors.warmWhite);
  root.style.setProperty('--color-parchment', theme.colors.parchment);
  
  // Primary palette (main interactive elements)
  root.style.setProperty('--color-sage', theme.colors.primary);
  root.style.setProperty('--color-sage-light', theme.colors.primaryLight);
  root.style.setProperty('--color-sage-dark', theme.colors.primaryDark);
  
  // Secondary palette (supporting elements)
  root.style.setProperty('--color-terracotta', theme.colors.secondary);
  root.style.setProperty('--color-terracotta-light', theme.colors.secondaryLight);
  root.style.setProperty('--color-terracotta-dark', theme.colors.secondaryDark);
  
  // Accent palette (highlights and special elements)
  root.style.setProperty('--color-dusty-blue', theme.colors.accent);
  root.style.setProperty('--color-dusty-blue-light', theme.colors.accentLight);
  root.style.setProperty('--color-dusty-blue-dark', theme.colors.accentDark);
  
  // Neutral palette
  root.style.setProperty('--color-warm-gray', theme.colors.warmGray);
  root.style.setProperty('--color-warm-gray-light', theme.colors.warmGrayLight);
  root.style.setProperty('--color-warm-gray-dark', theme.colors.warmGrayDark);
  root.style.setProperty('--color-charcoal', theme.colors.charcoal);
  root.style.setProperty('--color-ink', theme.colors.ink);
  
  // Special colors
  root.style.setProperty('--color-amber', theme.colors.amber);
  root.style.setProperty('--color-amber-light', theme.colors.amberLight);
  root.style.setProperty('--color-rose', theme.colors.rose);
  root.style.setProperty('--color-lavender', theme.colors.lavender);
  
  // Co-Star inspired gradients and effects
  root.style.setProperty('--theme-gradient-primary', `linear-gradient(145deg, ${theme.colors.primary} 0%, ${theme.colors.secondary} 35%, ${theme.colors.primaryLight} 70%, ${theme.colors.amber} 100%)`);
  root.style.setProperty('--theme-gradient-secondary', `linear-gradient(125deg, ${theme.colors.secondary} 0%, ${theme.colors.secondaryLight} 60%, ${theme.colors.primary} 100%)`);
  root.style.setProperty('--theme-shadow-color', 'rgba(45, 74, 43, 0.25)');
  root.style.setProperty('--theme-glow-color', 'rgba(74, 107, 71, 0.35)');
  
  // Co-Star inspired analog texture
  root.style.setProperty('--theme-texture-overlay', `
    radial-gradient(ellipse at 25% 75%, rgba(45, 74, 43, 0.08) 0%, transparent 45%),
    radial-gradient(ellipse at 75% 25%, rgba(74, 52, 61, 0.06) 0%, transparent 55%),
    radial-gradient(ellipse at 50% 50%, rgba(139, 125, 115, 0.04) 0%, transparent 65%)
  `);
  
  // Analog paper grain like Co-Star
  root.style.setProperty('--theme-paper-grain', `
    repeating-linear-gradient(45deg, transparent, transparent 1px, rgba(45, 74, 43, 0.02) 1px, rgba(45, 74, 43, 0.02) 2px),
    repeating-linear-gradient(-45deg, transparent, transparent 1px, rgba(74, 52, 61, 0.015) 1px, rgba(74, 52, 61, 0.015) 2px)
  `);
};

export const getStoredTheme = (): ThemeName => {
  return 'cream-espresso';
};

export const setStoredTheme = (theme: ThemeName) => {
  localStorage.setItem('goals-app-theme', theme);
};
