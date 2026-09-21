import './global.css';
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StatusBar } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { ThemeProvider, useTheme } from './src/context/ThemeContext';
import { SettingsProvider } from './src/context/SettingsContext';
import { CricketProvider } from './src/context/CricketContext';
import Header from './src/components/Header';
import WelcomeQuizModal from './src/components/WelcomeQuizModal';
import SplashScreen from './src/components/SplashScreen';
import LiveCricketScoreScreen from './src/screens/LiveCricketScoreScreen';
import ScheduleScreen from './src/screens/ScheduleScreen';
import CricbuzzHomeScreen from './src/screens/CricbuzzHomeScreen';
import MatchesScreen from './src/screens/MatchesScreen';
import SeriesScreen from './src/screens/SeriesScreen';
import NewsScreen from './src/screens/NewsScreen';
import PointsTableScreen from './src/screens/PointsTableScreen';

function MainApp() {
  const [quizVisible, setQuizVisible] = useState(true);
  const [showSplash, setShowSplash] = useState(false);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const [currentView, setCurrentView] = useState('liveScoreHub'); // 'liveScoreHub' | 'schedule' | 'matches' | 'table'

  const handleQuizClose = () => {
    setQuizVisible(false);
    if (!hasCompletedOnboarding) {
      setShowSplash(true);
    }
  };

  const handleSplashFinish = () => {
    setShowSplash(false);
    setHasCompletedOnboarding(true);
    setCurrentView('liveScoreHub');
  };

  if (!hasCompletedOnboarding && quizVisible) {
    return (
      <WelcomeQuizModal
        visible={true}
        onClose={handleQuizClose}
      />
    );
  }

  if (showSplash) {
    return (
      <SplashScreen
        onFinish={handleSplashFinish}
        onClose={handleSplashFinish}
      />
    );
  }

  if (currentView === 'schedule') {
    return (
      <ScheduleScreen
        onBack={() => setCurrentView('liveScoreHub')}
      />
    );
  }

  if (currentView === 'matches') {
    return (
      <MatchesScreen
        onBack={() => setCurrentView('liveScoreHub')}
      />
    );
  }

  if (currentView === 'table') {
    return (
      <PointsTableScreen
        onBack={() => setCurrentView('liveScoreHub')}
      />
    );
  }

  return (
    <View className="flex-1">
      <LiveCricketScoreScreen
        onBack={() => setCurrentView('liveScoreHub')}
        onNavigateToSchedule={() => setCurrentView('schedule')}
        onNavigateToMatches={() => setCurrentView('matches')}
        onNavigateToTable={() => setCurrentView('table')}
        onNavigateToTab={(tab, subTab) => {
          if (subTab === 'table') {
            setCurrentView('table');
          } else if (tab === 'schedule') {
            setCurrentView('schedule');
          } else {
            setCurrentView('matches');
          }
        }}
      />
      <WelcomeQuizModal visible={quizVisible} onClose={handleQuizClose} />
    </View>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <SettingsProvider>
          <CricketProvider>
            <MainApp />
          </CricketProvider>
        </SettingsProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}