import './global.css';
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StatusBar } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { ThemeProvider, useTheme } from './src/context/ThemeContext';
import Header from './src/components/Header';
import CricbuzzHomeScreen from './src/screens/CricbuzzHomeScreen';
import MatchesScreen from './src/screens/MatchesScreen';
import SeriesScreen from './src/screens/SeriesScreen';
import VideosScreen from './src/screens/VideosScreen';
import NewsScreen from './src/screens/NewsScreen';
import CricbuzzDrawerModal from './src/components/CricbuzzDrawerModal';
import LoginModal from './src/components/LoginModal';
import ServerConfigModal from './src/components/ServerConfigModal';

function MainApp() {
  const { theme, isDarkMode } = useTheme();
  const [activeTab, setActiveTab] = useState('home'); // 'home' | 'matches' | 'series' | 'videos' | 'news'
  const [seriesInitialSubTab, setSeriesInitialSubTab] = useState('table');

  const [drawerVisible, setDrawerVisible] = useState(false);
  const [loginVisible, setLoginVisible] = useState(false);
  const [serverModalVisible, setServerModalVisible] = useState(false);

  const tabs = [
    { id: 'home', label: 'Home', icon: 'home', iconOutline: 'home-outline' },
    { id: 'matches', label: 'Matches', icon: 'baseball', iconOutline: 'baseball-outline' },
    { id: 'series', label: 'Series', icon: 'trophy', iconOutline: 'trophy-outline' },
    { id: 'videos', label: 'Videos', icon: 'play-circle', iconOutline: 'play-circle-outline' },
    { id: 'news', label: 'News', icon: 'newspaper', iconOutline: 'newspaper-outline' },
  ];

  const handleNavigateToTab = (tabId, subTab) => {
    if (tabId === 'series' && subTab) {
      setSeriesInitialSubTab(subTab);
    }
    setActiveTab(tabId);
  };

  return (
    <SafeAreaView style={{ backgroundColor: theme.headerBg }} className="flex-1" edges={['top', 'left', 'right']}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={theme.headerBg}
      />

      {/* Official Cricbuzz Header (Hamburger, Logo, Log In) */}
      <Header
        onOpenMenu={() => setDrawerVisible(true)}
        onOpenLogin={() => setLoginVisible(true)}
      />

      {/* Active Tab Screen */}
      <View style={{ backgroundColor: theme.bg }} className="flex-1">
        {activeTab === 'home' && (
          <CricbuzzHomeScreen onNavigateToTab={handleNavigateToTab} />
        )}
        {activeTab === 'matches' && <MatchesScreen />}
        {activeTab === 'series' && (
          <SeriesScreen initialSubTab={seriesInitialSubTab} key={seriesInitialSubTab} />
        )}
        {activeTab === 'videos' && <VideosScreen />}
        {activeTab === 'news' && <NewsScreen />}
      </View>

      {/* Official Cricbuzz 5-Tab Bottom Navigation Bar */}
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

      {/* Slide-out Drawer Menu */}
      <CricbuzzDrawerModal
        visible={drawerVisible}
        onClose={() => setDrawerVisible(false)}
        onNavigate={(tabId) => handleNavigateToTab(tabId)}
        onOpenServerConfig={() => setServerModalVisible(true)}
      />

      {/* Cricbuzz Login Modal */}
      <LoginModal
        visible={loginVisible}
        onClose={() => setLoginVisible(false)}
      />

      {/* Server Config Modal */}
      <ServerConfigModal
        visible={serverModalVisible}
        onClose={() => setServerModalVisible(false)}
      />
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <MainApp />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}