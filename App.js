import './global.css';
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StatusBar } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { ThemeProvider, useTheme } from './src/context/ThemeContext';
import Header from './src/components/Header';
import CricbuzzHomeScreen from './src/screens/CricbuzzHomeScreen';
import PointsTableScreen from './src/screens/PointsTableScreen';
import ScheduleScreen from './src/screens/ScheduleScreen';
import PlayoffsScreen from './src/screens/PlayoffsScreen';
import ServerConfigModal from './src/components/ServerConfigModal';

function MainApp() {
  const { theme, isDarkMode } = useTheme();
  const [activeTab, setActiveTab] = useState('matches'); // 'matches' | 'table' | 'schedule' | 'playoffs'
  const [serverModalVisible, setServerModalVisible] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const tabs = [
    { id: 'matches', label: 'Matches', icon: 'baseball', iconOutline: 'baseball-outline' },
    { id: 'table', label: 'Points Table', icon: 'stats-chart', iconOutline: 'stats-chart-outline' },
    { id: 'schedule', label: 'Schedule', icon: 'calendar', iconOutline: 'calendar-outline' },
    { id: 'playoffs', label: 'Playoffs', icon: 'trophy', iconOutline: 'trophy-outline' },
  ];

  return (
    <SafeAreaView style={{ backgroundColor: theme.headerBg }} className="flex-1" edges={['top', 'left', 'right']}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={theme.headerBg}
      />

      {/* App Header with Cricbuzz Brand, Auto-Sync Status & Theme Switcher */}
      <Header
        activeTab={activeTab}
        isRefreshing={isRefreshing}
        onOpenServerConfig={() => setServerModalVisible(true)}
      />

      {/* Screen Views - 100% Real API Data */}
      <View style={{ backgroundColor: theme.bg }} className="flex-1">
        {activeTab === 'matches' && <CricbuzzHomeScreen />}
        {activeTab === 'table' && <PointsTableScreen />}
        {activeTab === 'schedule' && <ScheduleScreen />}
        {activeTab === 'playoffs' && <PlayoffsScreen />}
      </View>

      {/* Cricbuzz Clean 4-Tab Bottom Navigation Bar */}
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
                  paddingVertical: 3,
                  borderRadius: 16,
                }}
                className="items-center"
              >
                <Ionicons
                  name={isActive ? tab.icon : tab.iconOutline}
                  size={22}
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