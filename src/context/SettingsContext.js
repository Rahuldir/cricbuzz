import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SettingsContext = createContext();

const STORAGE_KEY = '@cricbuzz_settings_v1';

export const IPL_TEAMS = [
  { code: 'CSK', name: 'Chennai Super Kings' },
  { code: 'MI', name: 'Mumbai Indians' },
  { code: 'RCB', name: 'Royal Challengers Bengaluru' },
  { code: 'KKR', name: 'Kolkata Knight Riders' },
  { code: 'GT', name: 'Gujarat Titans' },
  { code: 'RR', name: 'Rajasthan Royals' },
  { code: 'SRH', name: 'Sunrisers Hyderabad' },
  { code: 'DC', name: 'Delhi Capitals' },
];

const DEFAULT_SETTINGS = {
  matchNotifications: true,
  wicketAlerts: true,
  newsDigest: false,
  wifiOnlyVideos: true,
  soundHaptics: true,
  favoriteTeam: 'CSK',
  language: 'English',
};

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          setSettings((prev) => ({ ...prev, ...parsed }));
        }
      } catch {
        // Fall back to defaults
      } finally {
        setLoaded(true);
      }
    })();
  }, []);

  const updateSettings = useCallback((patch) => {
    setSettings((prev) => {
      const next = { ...prev, ...patch };
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next)).catch(() => {});
      return next;
    });
  }, []);

  const resetSettings = useCallback(() => {
    setSettings(DEFAULT_SETTINGS);
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_SETTINGS)).catch(() => {});
  }, []);

  return (
    <SettingsContext.Provider
      value={{
        settings,
        loaded,
        updateSettings,
        resetSettings,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => useContext(SettingsContext);
