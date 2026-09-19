import './global.css';
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StatusBar } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { ThemeProvider, useTheme } from './src/context/ThemeContext';
import { SettingsProvider } from './src/context/SettingsContext';
import Header from './src/components/Header';
import WelcomeQuizModal from './src/components/WelcomeQuizModal';
import SplashScreen from './src/components/SplashScreen';
import CricbuzzHomeScreen from './src/screens/CricbuzzHomeScreen';
import MatchesScreen from './src/screens/MatchesScreen';
import SeriesScreen from './src/screens/SeriesScreen';
import NewsScreen from './src/screens/NewsScreen';
import SettingsScreen from './src/screens/SettingsScreen';

function MainApp() {
  const { theme, isDarkMode } = useTheme();
  const [showSplash, setShowSplash] = useState(true);
  const [activeTab, setActiveTab] = useState('home'); // 'home' | 'matches' | 'series' | 'news' | 'settings'
  const [seriesInitialSubTab, setSeriesInitialSubTab] = useState('table');
  const [quizVisible, setQuizVisible] = useState(false);

  const tabs = [
    { id: 'home', label: 'Home', icon: 'home', iconOutline: 'home-outline' },
    { id: 'matches', label: 'Matches', icon: 'baseball', iconOutline: 'baseball-outline' },
    { id: 'series', label: 'Series', icon: 'trophy', iconOutline: 'trophy-outline' },
    { id: 'news', label: 'News', icon: 'newspaper', iconOutline: 'newspaper-outline' },
    { id: 'settings', label: 'Settings', icon: 'settings', iconOutline: 'settings-outline' },
  ];

  const handleNavigateToTab = (tabId, subTab) => {
    if (tabId === 'series' && subTab) {
      setSeriesInitialSubTab(subTab);
    }
    setActiveTab(tabId);
  };

  if (showSplash) {
    return (
      <SplashScreen
        onFinish={() => setShowSplash(false)}
        onClose={() => setShowSplash(false)}
      />
    );
  }

  return (
    <SafeAreaView style={{ backgroundColor: theme.headerBg }} className="flex-1" edges={['top', 'left', 'right']}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={theme.headerBg}
      />

      {/* Clean Header */}
      <Header onOpenQuiz={() => setQuizVisible(true)} />

      {/* Active Tab Screen */}
      <View style={{ backgroundColor: theme.bg }} className="flex-1">
        {activeTab === 'home' && (
          <CricbuzzHomeScreen onNavigateToTab={handleNavigateToTab} />
        )}
        {activeTab === 'matches' && <MatchesScreen />}
        {activeTab === 'series' && (
          <SeriesScreen initialSubTab={seriesInitialSubTab} key={seriesInitialSubTab} />
        )}
        {activeTab === 'news' && <NewsScreen />}
        {activeTab === 'settings' && (
          <SettingsScreen onPreviewSplash={() => setShowSplash(true)} />
        )}
      </View>

      {/* Welcome & Fan Quiz Modal (Image 1 & Image 4 exact match) */}
      <WelcomeQuizModal visible={quizVisible} onClose={() => setQuizVisible(false)} />

      {/* Cricbuzz 5-Tab Bottom Navigation Bar with Settings Screen */}
      <View
        style={{
          backgroundColor: theme.navBg,
          borderColor: theme.navBorder,
        }}
        className="border-t px-2 py-2 flex-row justify-around items-center shadow-lg"
      >
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <TouchableOpacity
              key={tab.id}
              onPress={() => setActiveTab(tab.id)}
              className="items-center py-1 flex-1"
              activeOpacity={0.7}
            >
              <View
                style={{
                  backgroundColor: isActive ? (isDarkMode ? '#064E3B40' : '#E6F4EA') : 'transparent',
                  paddingHorizontal: 12,
                  paddingVertical: 2.5,
                  borderRadius: 16,
                }}
                className="items-center"
              >
                <Ionicons
                  name={isActive ? tab.icon : tab.iconOutline}
                  size={21}
                  color={isActive ? theme.navActive : theme.navInactive}
                />
              </View>
              <Text
                style={{
                  color: isActive ? theme.navActive : theme.navInactive,
                  fontWeight: isActive ? '800' : '500',
                }}
                className="text-[11px] mt-0.5 tracking-tight"
                numberOfLines={1}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <SettingsProvider>
          <MainApp />
        </SettingsProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}