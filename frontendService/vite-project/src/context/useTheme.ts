import { useContext } from 'react';
import { ThemeContext } from './themeContextInstance';

// Custom hook to use the theme context easily
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
