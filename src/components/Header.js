import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

export default function Header({
  onRefresh,
  isRefreshing = false,
  lastUpdatedText = 'Just now',
  onOpenServerConfig,
}) {
  const { theme, isDarkMode, toggleTheme } = useTheme();

  return (
    <View
      style={{ backgroundColor: theme.headerBg, borderColor: theme.divider }}
      className="border-b px-4 pt-3 pb-3 flex-row items-center justify-between shadow-md"
    >
      {/* Brand logo & Live status */}
      <View className="flex-row items-center space-x-2">
        <View className="w-8 h-8 rounded-full bg-emerald-500/25 border border-emerald-400/40 items-center justify-center mr-2 shadow-inner">
          <Ionicons name="baseball" size={18} color="#10B981" />
        </View>
        <View>
          <View className="flex-row items-center">
            <Text className="text-white font-black text-base tracking-wider">
              CRIC<Text className="text-emerald-400 font-extrabold">BUZZ</Text>
            </Text>
            <View className="ml-1.5 px-1.5 py-0.2 bg-emerald-500/30 rounded border border-emerald-400/40 flex-row items-center">
              <View className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1 animate-pulse" />
              <Text className="text-emerald-300 font-black text-[9px] tracking-widest uppercase">LIVE API</Text>
            </View>
          </View>
          <Text className="text-emerald-200/80 text-[10px] font-medium tracking-wide">
            Auto-Sync • {lastUpdatedText}
          </Text>
        </View>
      </View>

      {/* Action Icons */}
      <View className="flex-row items-center space-x-2">
        {/* Instant Refresh Button with Loading Indicator */}
        {onRefresh && (
          <TouchableOpacity
            onPress={onRefresh}
            disabled={isRefreshing}
            style={{ backgroundColor: isDarkMode ? '#1E293B' : '#007A5E' }}
            className="w-8 h-8 rounded-xl items-center justify-center border border-white/20 mr-1.5"
            activeOpacity={0.7}
          >
            {isRefreshing ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Ionicons name="refresh" size={16} color="#FFFFFF" />
            )}
          </TouchableOpacity>
        )}

        {/* Light / Dark Mode Switcher */}
        <TouchableOpacity
          onPress={toggleTheme}
          style={{ backgroundColor: isDarkMode ? '#1E293B' : '#007A5E' }}
          className="w-8 h-8 rounded-xl items-center justify-center border border-white/20 mr-1.5"
          activeOpacity={0.7}
        >
          <Ionicons
            name={isDarkMode ? 'sunny' : 'moon'}
            size={16}
            color={isDarkMode ? '#F59E0B' : '#FFFFFF'}
          />
        </TouchableOpacity>

        {/* Server Config Button */}
        <TouchableOpacity
          onPress={onOpenServerConfig}
          style={{ backgroundColor: isDarkMode ? '#1E293B' : '#007A5E' }}
          className="w-8 h-8 rounded-xl items-center justify-center border border-white/20"
          activeOpacity={0.7}
        >
          <Ionicons name="server-outline" size={15} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
