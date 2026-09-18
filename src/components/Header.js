import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

export default function Header({
  onOpenMenu,
  onOpenLogin,
}) {
  const { theme } = useTheme();

  return (
    <View
      style={{ backgroundColor: theme.headerBg }}
      className="px-4 pt-3 pb-3 flex-row items-center justify-between shadow-md"
    >
      {/* Left: Hamburger Menu Icon */}
      <TouchableOpacity
        onPress={onOpenMenu}
        className="p-1 -ml-1 items-center justify-center"
        activeOpacity={0.7}
      >
        <Ionicons name="menu" size={26} color="#FFFFFF" />
      </TouchableOpacity>

      {/* Center: Official Cricbuzz Logo */}
      <View className="flex-row items-center">
        <Text className="text-white font-black text-2xl tracking-tighter lowercase">
          cric<Text className="text-emerald-300 font-black">buzz</Text>
        </Text>
      </View>

      {/* Right: Log In Link Button */}
      <TouchableOpacity
        onPress={onOpenLogin}
        className="py-1 px-2.5 rounded-lg active:bg-white/10"
        activeOpacity={0.7}
      >
        <Text className="text-white font-bold text-sm">
          Log In
        </Text>
      </TouchableOpacity>
    </View>
  );
}
