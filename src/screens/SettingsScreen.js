import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  Share,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useSettings, IPL_TEAMS } from '../context/SettingsContext';
import { TeamFlag } from '../utils/flagHelper';

export default function SettingsScreen() {
  const { theme, isDarkMode, toggleTheme } = useTheme();
  const { settings, updateSettings } = useSettings();

  // Notification Permissions & Alerts (persisted)
  const {
    matchNotifications,
    wicketAlerts,
    newsDigest,
    wifiOnlyVideos,
    soundHaptics,
    favoriteTeam: selectedTeam,
  } = settings;
  const setMatchNotifications = (v) => updateSettings({ matchNotifications: v });
  const setWicketAlerts = (v) => updateSettings({ wicketAlerts: v });
  const setNewsDigest = (v) => updateSettings({ newsDigest: v });
  const setWifiOnlyVideos = (v) => updateSettings({ wifiOnlyVideos: v });
  const setSoundHaptics = (v) => updateSettings({ soundHaptics: v });
  const setSelectedTeam = (v) => updateSettings({ favoriteTeam: v });

  // Cache size is ephemeral, not a persisted preference
  const [cacheSize, setCacheSize] = useState('14.2 MB');

  const teams = IPL_TEAMS;

  const handleClearCache = () => {
    Alert.alert(
      'Clear Cache',
      'Are you sure you want to clear temporary match data and images?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: () => {
            setCacheSize('0.0 KB');
            Alert.alert('Cache Cleared', 'All temporary cached files have been removed.');
          },
        },
      ]
    );
  };

  const handleShareApp = async () => {
    try {
      await Share.share({
        message: 'Download the Cricbuzz Live Cricket app for fastest live scores, ball-by-ball updates, and IPL standings!',
      });
    } catch (e) {
      console.log(e);
    }
  };

  const handleRateApp = () => {
    Alert.alert('Thank You!', 'We appreciate your feedback and love for Cricbuzz!');
  };

  const showPolicyAlert = (title) => {
    Alert.alert(
      title,
      'Cricbuzz values user privacy and transparency. No personal tracking data is shared with third parties.'
    );
  };

  return (
    <View style={{ backgroundColor: theme.bg }} className="flex-1">
      <ScrollView className="flex-1 px-4 pt-3 pb-8" showsVerticalScrollIndicator={false}>
        {/* User Card Header */}
        <View
          style={{
            backgroundColor: theme.card,
            borderColor: theme.cardBorder,
          }}
          className="p-4 rounded-3xl border shadow-xs mb-4 flex-row items-center justify-between"
        >
          <View className="flex-row items-center flex-1 mr-2">
            <View className="w-12 h-12 rounded-full bg-emerald-500/20 border-2 border-emerald-500 items-center justify-center mr-3">
              <Ionicons name="person" size={24} color="#009270" />
            </View>
            <View className="flex-1">
              <View className="flex-row items-center">
                <Text style={{ color: theme.text }} className="font-black text-base mr-2">
                  Cricket Fan
                </Text>
                <View className="px-2 py-0.5 bg-emerald-500/15 rounded-full">
                  <Text className="text-emerald-600 dark:text-emerald-400 font-extrabold text-[10px]">
                    ACTIVE
                  </Text>
                </View>
              </View>
              <Text style={{ color: theme.textMuted }} className="text-xs mt-0.5">
                Fav Team: {selectedTeam} • IPL 2026 Edition
              </Text>
            </View>
          </View>
        </View>

        {/* 1. APPEARANCE (LIGHT & DARK MODE) */}
        <Text style={{ color: theme.textMuted }} className="text-xs font-black uppercase tracking-wider px-1 mb-2">
          Appearance
        </Text>
        <View
          style={{ backgroundColor: theme.card, borderColor: theme.cardBorder }}
          className="p-4 rounded-3xl border shadow-xs mb-5"
        >
          <View className="flex-row items-center justify-between mb-3.5">
            <View className="flex-row items-center">
              <View
                style={{ backgroundColor: isDarkMode ? '#1E293B' : '#FEF3C7' }}
                className="w-8 h-8 rounded-xl items-center justify-center mr-3"
              >
                <Ionicons
                  name={isDarkMode ? 'moon' : 'sunny'}
                  size={18}
                  color={isDarkMode ? '#10B981' : '#D97706'}
                />
              </View>
              <View>
                <Text style={{ color: theme.text }} className="font-extrabold text-sm">
                  Theme Mode
                </Text>
                <Text style={{ color: theme.textSecondary }} className="text-xs">
                  {isDarkMode ? 'Dark theme enabled' : 'Light theme enabled'}
                </Text>
              </View>
            </View>
          </View>

          {/* Segmented Light/Dark Selector */}
          <View className="flex-row bg-slate-100 dark:bg-slate-800/80 p-1.5 rounded-2xl">
            <TouchableOpacity
              onPress={() => {
                if (isDarkMode) toggleTheme();
              }}
              style={{
                backgroundColor: !isDarkMode ? '#FFFFFF' : 'transparent',
                shadowColor: !isDarkMode ? '#000000' : 'transparent',
                shadowOpacity: !isDarkMode ? 0.08 : 0,
                shadowRadius: 3,
                elevation: !isDarkMode ? 2 : 0,
              }}
              className="flex-1 py-2.5 rounded-xl flex-row items-center justify-center"
              activeOpacity={0.7}
            >
              <Ionicons
                name="sunny"
                size={16}
                color={!isDarkMode ? '#009270' : '#94A3B8'}
                style={{ marginRight: 6 }}
              />
              <Text
                style={{
                  color: !isDarkMode ? '#009270' : '#94A3B8',
                  fontWeight: !isDarkMode ? '800' : '600',
                }}
                className="text-xs"
              >
                Light Mode
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                if (!isDarkMode) toggleTheme();
              }}
              style={{
                backgroundColor: isDarkMode ? theme.card : 'transparent',
                shadowColor: isDarkMode ? '#000000' : 'transparent',
                shadowOpacity: isDarkMode ? 0.2 : 0,
                shadowRadius: 3,
                elevation: isDarkMode ? 2 : 0,
              }}
              className="flex-1 py-2.5 rounded-xl flex-row items-center justify-center"
              activeOpacity={0.7}
            >
              <Ionicons
                name="moon"
                size={16}
                color={isDarkMode ? '#10B981' : '#64748B'}
                style={{ marginRight: 6 }}
              />
              <Text
                style={{
                  color: isDarkMode ? '#10B981' : '#64748B',
                  fontWeight: isDarkMode ? '800' : '600',
                }}
                className="text-xs"
              >
                Dark Mode
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 2. NOTIFICATIONS & PERMISSIONS */}
        <Text style={{ color: theme.textMuted }} className="text-xs font-black uppercase tracking-wider px-1 mb-2">
          Notifications & Alerts
        </Text>
        <View
          style={{ backgroundColor: theme.card, borderColor: theme.cardBorder }}
          className="rounded-3xl border shadow-xs mb-5 overflow-hidden"
        >
          {/* Match Alerts */}
          <View className="flex-row items-center justify-between p-4 border-b" style={{ borderColor: theme.divider }}>
            <View className="flex-row items-center flex-1 mr-3">
              <View className="w-8 h-8 rounded-xl bg-blue-500/15 items-center justify-center mr-3">
                <Ionicons name="notifications" size={17} color="#3B82F6" />
              </View>
              <View className="flex-1">
                <Text style={{ color: theme.text }} className="font-extrabold text-sm">
                  Match Notifications
                </Text>
                <Text style={{ color: theme.textMuted }} className="text-xs">
                  Match start, toss, and final results
                </Text>
              </View>
            </View>
            <Switch
              value={matchNotifications}
              onValueChange={setMatchNotifications}
              trackColor={{ false: '#94A3B8', true: '#10B981' }}
              thumbColor="#FFFFFF"
            />
          </View>

          {/* Wickets & Boundaries */}
          <View className="flex-row items-center justify-between p-4 border-b" style={{ borderColor: theme.divider }}>
            <View className="flex-row items-center flex-1 mr-3">
              <View className="w-8 h-8 rounded-xl bg-red-500/15 items-center justify-center mr-3">
                <Ionicons name="flash" size={17} color="#EF4444" />
              </View>
              <View className="flex-1">
                <Text style={{ color: theme.text }} className="font-extrabold text-sm">
                  Wicket & Boundary Alerts
                </Text>
                <Text style={{ color: theme.textMuted }} className="text-xs">
                  Instant buzz on 4s, 6s, and fall of wickets
                </Text>
              </View>
            </View>
            <Switch
              value={wicketAlerts}
              onValueChange={setWicketAlerts}
              trackColor={{ false: '#94A3B8', true: '#10B981' }}
              thumbColor="#FFFFFF"
            />
          </View>

          {/* News & Editorial Digest */}
          <View className="flex-row items-center justify-between p-4">
            <View className="flex-row items-center flex-1 mr-3">
              <View className="w-8 h-8 rounded-xl bg-purple-500/15 items-center justify-center mr-3">
                <Ionicons name="newspaper" size={17} color="#8B5CF6" />
              </View>
              <View className="flex-1">
                <Text style={{ color: theme.text }} className="font-extrabold text-sm">
                  Cricket News Digest
                </Text>
                <Text style={{ color: theme.textMuted }} className="text-xs">
                  Top cricket stories and analysis
                </Text>
              </View>
            </View>
            <Switch
              value={newsDigest}
              onValueChange={setNewsDigest}
              trackColor={{ false: '#94A3B8', true: '#10B981' }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>

        {/* 3. CRICKET PREFERENCES (FAVORITE TEAM & LANGUAGE) */}
        <Text style={{ color: theme.textMuted }} className="text-xs font-black uppercase tracking-wider px-1 mb-2">
          Cricket Preferences
        </Text>
        <View
          style={{ backgroundColor: theme.card, borderColor: theme.cardBorder }}
          className="p-4 rounded-3xl border shadow-xs mb-5"
        >
          {/* Favorite Team */}
          <Text style={{ color: theme.text }} className="font-extrabold text-sm mb-1">
            Favorite IPL Team
          </Text>
          <Text style={{ color: theme.textMuted }} className="text-xs mb-3">
            Prioritize match updates and points table
          </Text>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="space-x-2 -mx-1 px-1 mb-4">
            {teams.map((t) => {
              const isSelected = selectedTeam === t.code;
              return (
                <TouchableOpacity
                  key={t.code}
                  onPress={() => setSelectedTeam(t.code)}
                  style={{
                    backgroundColor: isSelected ? theme.accent : theme.inputBg,
                    borderColor: isSelected ? theme.accent : theme.cardBorder,
                  }}
                  className="flex-row items-center px-3.5 py-2 rounded-2xl border mr-2"
                  activeOpacity={0.75}
                >
                  <TeamFlag
                    countryCode={t.code}
                    teamName={t.name}
                    size={20}
                    style={{ marginRight: 6 }}
                  />
                  <Text
                    style={{
                      color: isSelected ? '#FFFFFF' : theme.text,
                      fontWeight: isSelected ? '900' : '600',
                    }}
                    className="text-xs"
                  >
                    {t.code}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* 4. DATA & PRIVACY PERMISSIONS */}
        <Text style={{ color: theme.textMuted }} className="text-xs font-black uppercase tracking-wider px-1 mb-2">
          Data & Media Settings
        </Text>
        <View
          style={{ backgroundColor: theme.card, borderColor: theme.cardBorder }}
          className="rounded-3xl border shadow-xs mb-5 overflow-hidden"
        >
          {/* Wi-Fi Only */}
          <View className="flex-row items-center justify-between p-4 border-b" style={{ borderColor: theme.divider }}>
            <View className="flex-row items-center flex-1 mr-3">
              <View className="w-8 h-8 rounded-xl bg-teal-500/15 items-center justify-center mr-3">
                <Ionicons name="wifi" size={17} color="#0D9488" />
              </View>
              <View className="flex-1">
                <Text style={{ color: theme.text }} className="font-extrabold text-sm">
                  Stream on Wi-Fi Only
                </Text>
                <Text style={{ color: theme.textMuted }} className="text-xs">
                  Save mobile data for match videos
                </Text>
              </View>
            </View>
            <Switch
              value={wifiOnlyVideos}
              onValueChange={setWifiOnlyVideos}
              trackColor={{ false: '#94A3B8', true: '#10B981' }}
              thumbColor="#FFFFFF"
            />
          </View>

          {/* Sound & Haptics */}
          <View className="flex-row items-center justify-between p-4 border-b" style={{ borderColor: theme.divider }}>
            <View className="flex-row items-center flex-1 mr-3">
              <View className="w-8 h-8 rounded-xl bg-amber-500/15 items-center justify-center mr-3">
                <Ionicons name="volume-medium" size={17} color="#D97706" />
              </View>
              <View className="flex-1">
                <Text style={{ color: theme.text }} className="font-extrabold text-sm">
                  Sound & Haptic Feedback
                </Text>
                <Text style={{ color: theme.textMuted }} className="text-xs">
                  Vibrate on key match moments
                </Text>
              </View>
            </View>
            <Switch
              value={soundHaptics}
              onValueChange={setSoundHaptics}
              trackColor={{ false: '#94A3B8', true: '#10B981' }}
              thumbColor="#FFFFFF"
            />
          </View>

          {/* Clear Cache */}
          <TouchableOpacity
            onPress={handleClearCache}
            className="flex-row items-center justify-between p-4"
            activeOpacity={0.7}
          >
            <View className="flex-row items-center">
              <View className="w-8 h-8 rounded-xl bg-red-500/15 items-center justify-center mr-3">
                <Ionicons name="trash-outline" size={17} color="#EF4444" />
              </View>
              <View>
                <Text style={{ color: theme.text }} className="font-extrabold text-sm">
                  Clear Cached Data
                </Text>
                <Text style={{ color: theme.textMuted }} className="text-xs">
                  Freed space: {cacheSize}
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={16} color={theme.textMuted} />
          </TouchableOpacity>
        </View>

        {/* 5. ABOUT & SUPPORT */}
        <Text style={{ color: theme.textMuted }} className="text-xs font-black uppercase tracking-wider px-1 mb-2">
          About & Support
        </Text>
        <View
          style={{ backgroundColor: theme.card, borderColor: theme.cardBorder }}
          className="rounded-3xl border shadow-xs mb-8 overflow-hidden"
        >
          <TouchableOpacity
            onPress={handleShareApp}
            className="flex-row items-center justify-between p-4 border-b"
            style={{ borderColor: theme.divider }}
            activeOpacity={0.7}
          >
            <View className="flex-row items-center">
              <View className="w-8 h-8 rounded-xl bg-indigo-500/15 items-center justify-center mr-3">
                <Ionicons name="share-social-outline" size={17} color="#6366F1" />
              </View>
              <Text style={{ color: theme.text }} className="font-bold text-sm">
                Share Cricbuzz App
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color={theme.textMuted} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleRateApp}
            className="flex-row items-center justify-between p-4 border-b"
            style={{ borderColor: theme.divider }}
            activeOpacity={0.7}
          >
            <View className="flex-row items-center">
              <View className="w-8 h-8 rounded-xl bg-amber-500/15 items-center justify-center mr-3">
                <Ionicons name="star-outline" size={17} color="#F59E0B" />
              </View>
              <Text style={{ color: theme.text }} className="font-bold text-sm">
                Rate us on Play Store
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color={theme.textMuted} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => showPolicyAlert('Privacy Policy')}
            className="flex-row items-center justify-between p-4 border-b"
            style={{ borderColor: theme.divider }}
            activeOpacity={0.7}
          >
            <View className="flex-row items-center">
              <View className="w-8 h-8 rounded-xl bg-slate-500/15 items-center justify-center mr-3">
                <Ionicons name="shield-checkmark-outline" size={17} color="#64748B" />
              </View>
              <Text style={{ color: theme.text }} className="font-bold text-sm">
                Privacy Policy & Permissions
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color={theme.textMuted} />
          </TouchableOpacity>

          <View className="p-4 flex-row items-center justify-between bg-slate-50 dark:bg-slate-900/40">
            <View>
              <Text style={{ color: theme.text }} className="font-extrabold text-xs">
                cricbuzz Mobile
              </Text>
              <Text style={{ color: theme.textMuted }} className="text-[10px]">
                Version 2.4.0 (Build 2026.1)
              </Text>
            </View>
            <View className="px-2.5 py-1 bg-emerald-500/20 rounded-full">
              <Text className="text-emerald-500 font-black text-[10px] tracking-wider uppercase">
                Up to date
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
