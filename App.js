import './global.css';
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StatusBar } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { CricketProvider } from './src/context/CricketContext';
import { ThemeProvider, useTheme } from './src/context/ThemeContext';
import Header from './src/components/Header';
import CricbuzzHomeScreen from './src/screens/CricbuzzHomeScreen';
import IplHubScreen from './src/screens/IplHubScreen';
import LiveMatchScreen from './src/screens/LiveMatchScreen';
import ScorecardScreen from './src/screens/ScorecardScreen';
import MatchesHistoryScreen from './src/screens/MatchesHistoryScreen';
import NewMatchModal from './src/components/NewMatchModal';
import MatchResultModal from './src/components/MatchResultModal';
import ServerConfigModal from './src/components/ServerConfigModal';

function MainApp() {
  const { theme, isDarkMode } = useTheme();
  const [activeTab, setActiveTab] = useState('matches'); // 'matches' | 'ipl' | 'scorer' | 'scorecard' | 'history'
  const [newMatchModalVisible, setNewMatchModalVisible] = useState(false);
  const [serverModalVisible, setServerModalVisible] = useState(false);

  return (
    <SafeAreaView style={{ backgroundColor: theme.headerBg }} className="flex-1" edges={['top', 'left', 'right']}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={theme.headerBg}
      />

      {/* App Header with Cricbuzz Brand & Theme Switcher */}
      <Header
        activeTab={activeTab}
        onOpenNewMatch={() => setNewMatchModalVisible(true)}
        onOpenServerConfig={() => setServerModalVisible(true)}
      />

      {/* Screen Views */}
      <View style={{ backgroundColor: theme.bg }} className="flex-1">
        {activeTab === 'matches' && <CricbuzzHomeScreen />}
        {activeTab === 'ipl' && <IplHubScreen />}
        {activeTab === 'scorer' && <LiveMatchScreen />}
        {activeTab === 'scorecard' && <ScorecardScreen />}
        {activeTab === 'history' && (
          <MatchesHistoryScreen onOpenNewMatch={() => setNewMatchModalVisible(true)} />
        )}
      </View>

      {/* Cricbuzz Premium Bottom Navigation Tab Bar */}
      <View
        style={{
          backgroundColor: theme.navBg,
          borderColor: theme.navBorder,
        }}
        className="border-t px-2 py-2 flex-row justify-around items-center shadow-lg"
      >
        {[
          { id: 'matches', label: 'Matches', icon: 'baseball', iconOutline: 'baseball-outline' },
          { id: 'ipl', label: 'IPL 2025', icon: 'trophy', iconOutline: 'trophy-outline' },
          { id: 'scorer', label: 'Live Scorer', icon: 'radio', iconOutline: 'radio-outline' },
          { id: 'scorecard', label: 'Scorecard', icon: 'document-text', iconOutline: 'document-text-outline' },
          { id: 'history', label: 'History', icon: 'time', iconOutline: 'time-outline' },
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
                size={22}
                color={isActive ? theme.navActive : theme.navInactive}
              />
              <Text
                style={{
                  color: isActive ? theme.navActive : theme.navInactive,
                  fontWeight: isActive ? '900' : '500',
                }}
                className="text-[10px] mt-0.5 tracking-tight"
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* New Match Modal */}
      <NewMatchModal
        visible={newMatchModalVisible}
        onClose={() => setNewMatchModalVisible(false)}
      />

      {/* Server Config Modal */}
      <ServerConfigModal
        visible={serverModalVisible}
        onClose={() => setServerModalVisible(false)}
      />

      {/* Match Result / Innings Break Modal */}
      <MatchResultModal
        onOpenScorecard={() => setActiveTab('scorecard')}
        onOpenNewMatch={() => setNewMatchModalVisible(true)}
      />
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <CricketProvider>
          <MainApp />
        </CricketProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}