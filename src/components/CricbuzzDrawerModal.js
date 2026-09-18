import React from 'react';
import { View, Text, Modal, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

export default function CricbuzzDrawerModal({
  visible,
  onClose,
  onNavigate,
  onOpenServerConfig,
}) {
  const { theme, isDarkMode, toggleTheme } = useTheme();

  if (!visible) return null;

  const menuItems = [
    { id: 'home', label: 'Home', icon: 'home-outline' },
    { id: 'matches', label: 'Matches & Live Scores', icon: 'baseball-outline' },
    { id: 'series', label: 'Series / IPL Hub', icon: 'trophy-outline' },
    { id: 'videos', label: 'Featured Videos', icon: 'play-circle-outline' },
    { id: 'news', label: 'Top Stories & News', icon: 'newspaper-outline' },
  ];

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View className="flex-1 flex-row bg-black/60">
        <View
          style={{ backgroundColor: theme.card }}
          className="w-4/5 max-w-[320px] h-full shadow-2xl flex-col"
        >
          {/* Drawer Header */}
          <View
            style={{ backgroundColor: theme.headerBg }}
            className="pt-12 pb-5 px-5"
          >
            <View className="flex-row justify-between items-center mb-3">
              <View className="flex-row items-center">
                <View className="w-8 h-8 rounded-full bg-white/20 items-center justify-center mr-2">
                  <Ionicons name="baseball" size={18} color="#FFFFFF" />
                </View>
                <Text className="text-white font-black text-xl tracking-tight">
                  cric<Text className="text-emerald-300">buzz</Text>
                </Text>
              </View>
              <TouchableOpacity onPress={onClose} className="p-1">
                <Ionicons name="close" size={24} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
            <Text className="text-emerald-100 text-xs font-medium">
              Live Scores, IPL Standings & News
            </Text>
          </View>

          {/* Quick Actions */}
          <View
            style={{ borderColor: theme.divider }}
            className="border-b px-5 py-3 flex-row justify-between items-center"
          >
            <TouchableOpacity
              onPress={toggleTheme}
              style={{ backgroundColor: theme.inputBg }}
              className="flex-1 flex-row items-center justify-center py-2 px-3 rounded-xl mr-2"
            >
              <Ionicons
                name={isDarkMode ? 'sunny' : 'moon'}
                size={16}
                color={isDarkMode ? '#F59E0B' : '#4B5563'}
                style={{ marginRight: 6 }}
              />
              <Text style={{ color: theme.text }} className="text-xs font-bold">
                {isDarkMode ? 'Light Mode' : 'Dark Mode'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                onClose();
                onOpenServerConfig();
              }}
              style={{ backgroundColor: theme.accentLight }}
              className="flex-row items-center py-2 px-3 rounded-xl"
            >
              <Ionicons name="server" size={15} color={theme.accent} style={{ marginRight: 4 }} />
              <Text style={{ color: theme.accent }} className="text-xs font-bold">
                API
              </Text>
            </TouchableOpacity>
          </View>

          {/* Navigation Links */}
          <ScrollView className="flex-1 px-3 py-3" showsVerticalScrollIndicator={false}>
            {menuItems.map((item) => (
              <TouchableOpacity
                key={item.id}
                onPress={() => {
                  onClose();
                  onNavigate(item.id);
                }}
                style={{
                  borderBottomColor: theme.cardBorderSubtle,
                }}
                className="flex-row items-center px-3 py-3 rounded-xl mb-1 active:bg-slate-100 dark:active:bg-slate-800"
              >
                <Ionicons name={item.icon} size={20} color={theme.accent} style={{ marginRight: 14 }} />
                <Text style={{ color: theme.text }} className="text-sm font-semibold flex-1">
                  {item.label}
                </Text>
                <Ionicons name="chevron-forward" size={14} color={theme.textMuted} />
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Drawer Footer */}
          <View
            style={{ borderColor: theme.divider, backgroundColor: theme.cardSecondary }}
            className="border-t p-4 flex-row items-center justify-between"
          >
            <View>
              <Text style={{ color: theme.textSecondary }} className="text-xs font-bold">
                Cricbuzz Mobile
              </Text>
              <Text style={{ color: theme.textMuted }} className="text-[10px]">
                dsquaretech API v1
              </Text>
            </View>
            <View className="px-2 py-0.5 bg-emerald-500/20 rounded-full">
              <Text className="text-emerald-500 font-extrabold text-[10px]">ONLINE</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity className="flex-1" onPress={onClose} activeOpacity={1} />
      </View>
    </Modal>
  );
}
