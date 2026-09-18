import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

export default function Header() {
  const { theme, isDarkMode, toggleTheme } = useTheme();

  return (
    <View
      style={{
        backgroundColor: theme.headerBg,
        borderBottomColor: 'rgba(0,0,0,0.08)',
      }}
      className="px-4 py-2.5 flex-row items-center justify-between border-b shadow-sm"
    >
      {/* Left: App Logo & Cricbuzz Branding */}
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
          <Ionicons name="baseball" size={19} color="#FFFFFF" />
        </View>

        <Text
          style={{
            color: '#FFFFFF',
            fontWeight: '900',
            fontSize: 22,
            letterSpacing: -0.8,
          }}
        >
          cric<Text style={{ color: '#6EE7B7', fontWeight: '900' }}>buzz</Text>
        </Text>
      </View>

      {/* Right: Theme Mode Switch */}
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
  );
}
