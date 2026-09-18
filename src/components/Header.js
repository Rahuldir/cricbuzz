import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useCricket } from '../context/CricketContext';
import { useTheme } from '../context/ThemeContext';

export default function Header({ onOpenNewMatch, onOpenServerConfig, activeTab }) {
  const { canUndo, undoLastBall } = useCricket();
  const { theme, isDarkMode, toggleTheme } = useTheme();

  return (
    <View
      style={{ backgroundColor: theme.headerBg, borderColor: theme.divider }}
      className="border-b px-4 pt-3 pb-3 flex-row items-center justify-between shadow-md"
    >
      {/* Brand logo & tagline */}
      <View className="flex-row items-center space-x-2">
        <View className="w-8 h-8 rounded-full bg-emerald-500/25 border border-emerald-400/40 items-center justify-center mr-2 shadow-inner">
          <Ionicons name="baseball" size={18} color="#10B981" />
        </View>
        <View>
          <View className="flex-row items-center">
            <Text className="text-white font-black text-base tracking-wider">
              CRIC<Text className="text-emerald-400 font-extrabold">BUZZ</Text>
            </Text>
            <View className="ml-1.5 px-1.5 py-0.2 bg-emerald-500/30 rounded border border-emerald-400/40">
              <Text className="text-emerald-300 font-black text-[9px] tracking-widest uppercase">PRO</Text>
            </View>
          </View>
          <Text className="text-emerald-200/80 text-[10px] font-medium tracking-wide">
            Live Cricket Scores & Scorer
          </Text>
        </View>
      </View>

      {/* Action Icons */}
      <View className="flex-row items-center space-x-2">
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

        {/* Undo button (relevant when in live scorer) */}
        {activeTab === 'scorer' && (
          <TouchableOpacity
            onPress={undoLastBall}
            disabled={!canUndo}
            style={{
              backgroundColor: canUndo ? '#1E293B' : '#1E293B50',
              borderColor: canUndo ? '#F59E0B' : '#334155',
            }}
            className={`flex-row items-center px-2.5 py-1.5 rounded-xl border mr-1.5 ${
              !canUndo ? 'opacity-40' : ''
            }`}
            activeOpacity={0.7}
          >
            <Ionicons
              name="arrow-undo"
              size={14}
              color={canUndo ? '#F59E0B' : '#94A3B8'}
              style={{ marginRight: 3 }}
            />
            <Text className={`text-xs font-bold ${canUndo ? 'text-amber-400' : 'text-slate-400'}`}>
              Undo
            </Text>
          </TouchableOpacity>
        )}

        {/* New Match Button */}
        {activeTab === 'scorer' && (
          <TouchableOpacity
            onPress={onOpenNewMatch}
            className="bg-emerald-600 active:bg-emerald-500 px-2.5 py-1.5 rounded-xl flex-row items-center border border-emerald-400/50 shadow-sm"
            activeOpacity={0.8}
          >
            <Ionicons name="add" size={16} color="#FFFFFF" style={{ marginRight: 2 }} />
            <Text className="text-white text-xs font-bold">New</Text>
          </TouchableOpacity>
        )}

        {/* Server Config Button (when on matches or ipl tab) */}
        {activeTab !== 'scorer' && (
          <TouchableOpacity
            onPress={onOpenServerConfig}
            style={{ backgroundColor: isDarkMode ? '#1E293B' : '#007A5E' }}
            className="w-8 h-8 rounded-xl items-center justify-center border border-white/20"
            activeOpacity={0.7}
          >
            <Ionicons name="server-outline" size={15} color="#FFFFFF" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
