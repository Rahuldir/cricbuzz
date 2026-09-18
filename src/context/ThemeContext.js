import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ThemeContext = createContext();
const THEME_STORAGE_KEY = '@cricbuzz_theme_v1';

export const THEME_COLORS = {
  light: {
    mode: 'light',
    bg: '#F3F4F6',
    bgSecondary: '#FFFFFF',
    card: '#FFFFFF',
    cardSecondary: '#F9FAFB',
    cardBorder: '#E5E7EB',
    cardBorderSubtle: '#F3F4F6',
    headerBg: '#009270', // Cricbuzz signature green
    headerText: '#FFFFFF',
    text: '#111827',
    textSecondary: '#4B5563',
    textMuted: '#9CA3AF',
    textInverse: '#FFFFFF',
    accent: '#009270',
    accentLight: '#E6F4EA',
    accentHover: '#007A5E',
    liveBadge: '#DC2626',
    liveBadgeBg: '#FEE2E2',
    navBg: '#FFFFFF',
    navBorder: '#E5E7EB',
    navActive: '#009270',
    navInactive: '#6B7280',
    tabActiveBg: '#009270',
    tabActiveText: '#FFFFFF',
    tabInactiveBg: '#E5E7EB',
    tabInactiveText: '#4B5563',
    divider: '#E5E7EB',
    inputBg: '#F3F4F6',
    inputBorder: '#D1D5DB',
    statCardBg: '#F9FAFB',
    statCardBorder: '#E5E7EB',
    wicketBadge: '#DC2626',
    fourBadge: '#2563EB',
    sixBadge: '#7C3AED',
    extraBadge: '#D97706',
    dotBadge: '#6B7280',
  },
  dark: {
    mode: 'dark',
    bg: '#0A0F18',
    bgSecondary: '#111827',
    card: '#131D2E',
    cardSecondary: '#1A2639',
    cardBorder: '#223348',
    cardBorderSubtle: '#1B2738',
    headerBg: '#0D1B2A',
    headerText: '#FFFFFF',
    text: '#F9FAFB',
    textSecondary: '#94A3B8',
    textMuted: '#64748B',
    textInverse: '#0B131E',
    accent: '#00B589',
    accentLight: '#073B2C',
    accentHover: '#009270',
    liveBadge: '#EF4444',
    liveBadgeBg: '#3F1219',
    navBg: '#0D1726',
    navBorder: '#1E293B',
    navActive: '#00B589',
    navInactive: '#64748B',
    tabActiveBg: '#00B589',
    tabActiveText: '#0B131E',
    tabInactiveBg: '#1A2639',
    tabInactiveText: '#94A3B8',
    divider: '#1E293B',
    inputBg: '#1A2639',
    inputBorder: '#334155',
    statCardBg: '#1A2639',
    statCardBorder: '#223348',
    wicketBadge: '#EF4444',
    fourBadge: '#3B82F6',
    sixBadge: '#8B5CF6',
    extraBadge: '#F59E0B',
    dotBadge: '#64748B',
  },
};

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (stored === 'light') setIsDarkMode(false);
        else if (stored === 'dark') setIsDarkMode(true);
      } catch {
        // Keep default
      }
    })();
  }, []);

  const persist = useCallback((value) => {
    AsyncStorage.setItem(THEME_STORAGE_KEY, value ? 'dark' : 'light').catch(() => {});
  }, []);

  const toggleTheme = () => {
    setIsDarkMode((prev) => {
      const next = !prev;
      persist(next);
      return next;
    });
  };

  const setDarkMode = (value) => {
    setIsDarkMode(value);
    persist(value);
  };

  const theme = isDarkMode ? THEME_COLORS.dark : THEME_COLORS.light;

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme, setDarkMode, theme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
