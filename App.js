import './global.css';
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StatusBar } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { ThemeProvider, useTheme } from './src/context/ThemeContext';
import Header from './src/components/Header';
import CricbuzzHomeScreen from './src/screens/CricbuzzHomeScreen';
import IplHubScreen from './src/screens/IplHubScreen';
import ServerConfigModal from './src/components/ServerConfigModal';

function MainApp() {
  const { theme, isDarkMode } = useTheme();
  const [activeTab, setActiveTab] = useState('matches'); // 'matches' | 'ipl'
  const [serverModalVisible, setServerModalVisible] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

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
        {activeTab === 'ipl' && <IplHubScreen />}
      </View>

      {/* Cricbuzz Clean Bottom Navigation Bar */}
      <View
        style={{
          backgroundColor: theme.navBg,
          borderColor: theme.navBorder,
        }}
        className="border-t px-6 py-2.5 flex-row justify-around items-center shadow-lg"
      >
        {[
          { id: 'matches', label: 'Matches', icon: 'baseball', iconOutline: 'baseball-outline' },
          { id: 'ipl', label: 'IPL Hub', icon: 'trophy', iconOutline: 'trophy-outline' },
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <TouchableOpacity
              key={tab.id}
              onPress={() => setActiveTab(tab.id)}
              className="items-center py-1 flex-1"
              activeOpacity={0.7}
            >
              <Ionicons
                name={isActive ? tab.icon : tab.iconOutline}
                size={24}
                color={isActive ? theme.navActive : theme.navInactive}
              />
              <Text
                style={{
                  color: isActive ? theme.navActive : theme.navInactive,
                  fontWeight: isActive ? '900' : '600',
                }}
                className="text-xs mt-0.5 tracking-tight"
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