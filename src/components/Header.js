import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

export default function Header({ onOpenQuiz }) {
  const { theme, isDarkMode, toggleTheme } = useTheme();

  return (
    <View
      style={{
        backgroundColor: theme.headerBg,
        borderBottomColor: 'rgba(0,0,0,0.08)',
      }}
      className="px-4 py-2.5 flex-row items-center justify-between border-b shadow-sm"
    >
      {/* Left: App Logo & Cricket Live Line Branding */}
      <View className="flex-row items-center">
        <View
          style={{
            width: 34,
            height: 34,
            borderRadius: 10,
            backgroundColor: 'rgba(255, 255, 255, 0.18)',
            borderWidth: 1,
            borderColor: 'rgba(255, 255, 255, 0.28)',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: 9,
          }}
        >
          <Ionicons name="flash" size={19} color="#6EE7B7" />
        </View>

        <View>
          <View className="flex-row items-center">
            <Text
              style={{
                color: '#FFFFFF',
                fontWeight: '900',
                fontSize: 18,
                letterSpacing: -0.5,
              }}
            >
              CRICKET <Text style={{ color: '#6EE7B7', fontWeight: '900' }}>LIVE LINE</Text>
            </Text>
            <View className="w-2 h-2 rounded-full bg-emerald-400 ml-1.5 animate-pulse" />
          </View>
          <Text className="text-[9px] text-emerald-200 font-bold uppercase tracking-widest">
            REAL FAST SCORE & SQUAD LINE
          </Text>
        </View>
      </View>

      {/* Right: Quiz & Theme Switch */}
      <View className="flex-row items-center space-x-2">
        {onOpenQuiz && (
          <TouchableOpacity
            onPress={onOpenQuiz}
            activeOpacity={0.75}
            style={{
              height: 32,
              paddingHorizontal: 10,
              borderRadius: 16,
              backgroundColor: '#007A3B',
              borderWidth: 1,
              borderColor: '#6EE7B7',
              alignItems: 'center',
              justifyContent: 'center',
              flexRow: 'row',
              marginRight: 6,
            }}
            className="flex-row items-center"
          >
            <Ionicons name="help-circle-outline" size={16} color="#FFFFFF" style={{ marginRight: 4 }} />
            <Text className="text-white text-[10px] font-black uppercase tracking-wider">
              FAN QUIZ
            </Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          onPress={toggleTheme}
          activeOpacity={0.75}
          style={{
            width: 34,
            height: 34,
            borderRadius: 17,
            backgroundColor: 'rgba(255, 255, 255, 0.16)',
            borderWidth: 0.8,
            borderColor: 'rgba(255, 255, 255, 0.25)',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons
            name={isDarkMode ? 'sunny' : 'moon'}
            size={17}
            color="#FFFFFF"
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}
