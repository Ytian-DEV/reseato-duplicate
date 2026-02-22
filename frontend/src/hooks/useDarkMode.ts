import { useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';

export const useDarkMode = () => {
  const { theme, toggleTheme, setTheme } = useTheme();

  const isDark = theme === 'dark';
  const isLight = theme === 'light';

  return {
    isDark,
    isLight,
    theme,
    toggleTheme,
    setTheme,
  };
};