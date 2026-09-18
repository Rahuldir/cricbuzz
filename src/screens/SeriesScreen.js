import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import PointsTableScreen from './PointsTableScreen';
import ScheduleScreen from './ScheduleScreen';
import PlayoffsScreen from './PlayoffsScreen';

export default function SeriesScreen({ initialSubTab = 'table' }) {
  const { theme } = useTheme();
  const [activeSubTab, setActiveSubTab] = useState(initialSubTab); // 'table' | 'schedule' | 'playoffs'

  const subTabs = [
    { id: 'table', label: 'Points Table' },
    { id: 'schedule', label: 'Schedule' },
    { id: 'playoffs', label: 'Playoffs' },
  ];

  return (
    <View style={{ backgroundColor: theme.bg }} className="flex-1">
      {/* Top Segmented Sub-Nav */}
      <View
        style={{
          backgroundColor: theme.headerBg,
          borderBottomColor: theme.divider,
        }}
        className="flex-row px-4 pt-1 pb-2 shadow-xs"
      >
        {subTabs.map((tab) => {
          const isActive = activeSubTab === tab.id;
          return (
            <TouchableOpacity
              key={tab.id}
              onPress={() => setActiveSubTab(tab.id)}
              className="flex-1 items-center pb-1.5"
              activeOpacity={0.7}
            >
              <Text
                style={{
                  color: isActive ? '#FFFFFF' : '#A7F3D0',
                  fontWeight: isActive ? '800' : '600',
                }}
                className="text-xs"
              >
                {tab.label}
              </Text>
              {isActive && (
                <View className="h-0.5 w-12 bg-white rounded-full mt-1.5" />
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Screen view */}
      <View className="flex-1">
        {activeSubTab === 'table' && <PointsTableScreen />}
        {activeSubTab === 'schedule' && <ScheduleScreen />}
        {activeSubTab === 'playoffs' && <PlayoffsScreen />}
      </View>
    </View>
  );
}
