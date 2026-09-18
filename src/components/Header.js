import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

export default function Header() {
  const { theme } = useTheme();

  return (
    <View
      style={{ backgroundColor: theme.headerBg }}
      className="px-4 py-3 flex-row items-center justify-center shadow-md relative"
    >
      {/* Centered Official Cricbuzz Logo */}
      <View className="flex-row items-center">
        <View className="w-7 h-7 rounded-full bg-white/20 items-center justify-center mr-2">
          <Ionicons name="baseball" size={17} color="#FFFFFF" />
        </View>
        <Text className="text-white font-black text-2xl tracking-tighter lowercase">
          cric<Text className="text-emerald-300 font-black">buzz</Text>
        </Text>
      </View>

      {/* Right Live Dot */}
      <View className="absolute right-4 flex-row items-center">
        <View className="w-2 h-2 rounded-full bg-emerald-400 mr-1 animate-pulse" />
        <Text className="text-emerald-200 text-[10px] font-extrabold uppercase tracking-widest">
          LIVE
        </Text>
      </View>
    </View>
  );
}
