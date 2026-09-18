import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

export default function EmptyStateView({
  type = 'live', // 'live' | 'upcoming' | 'completed' | 'history' | 'general'
  onRefresh,
  onAction,
  actionLabel,
}) {
  const { theme } = useTheme();

  const getEmptyDetails = () => {
    switch (type) {
      case 'live':
        return {
          icon: 'radio-outline',
          title: 'No Live Matches Right Now',
          description: 'There are currently no international or league matches in progress. Check upcoming matches or start your own match score!',
          secondaryAction: 'View Upcoming',
        };
      case 'upcoming':
        return {
          icon: 'calendar-outline',
          title: 'No Upcoming Fixtures Scheduled',
          description: 'No fixtures found in the immediate schedule. Check recent results or pull down to refresh.',
          secondaryAction: 'View Live Matches',
        };
      case 'completed':
        return {
          icon: 'trophy-outline',
          title: 'No Recent Match Results',
          description: 'Completed matches and final scorecards will appear here as tournaments progress.',
          secondaryAction: 'Check Live Scores',
        };
      case 'history':
        return {
          icon: 'time-outline',
          title: 'No Local Match History Yet',
          description: 'When you score and complete custom local matches, their full results and scorecards will be saved here.',
          secondaryAction: 'Start Local Match',
        };
      default:
        return {
          icon: 'baseball-outline',
          title: 'No Matches Available',
          description: 'We could not find any matches in this category. Pull down to refresh or check your API server connection.',
          secondaryAction: 'Refresh List',
        };
    }
  };

  const details = getEmptyDetails();

  return (
    <View
      style={{
        backgroundColor: theme.card,
        borderColor: theme.cardBorder,
      }}
      className="p-6 rounded-3xl border items-center my-4 mx-1 shadow-sm"
    >
      {/* Icon with circular Cricbuzz green glow */}
      <View
        style={{ backgroundColor: theme.accentLight }}
        className="w-16 h-16 rounded-full items-center justify-center mb-3.5"
      >
        <Ionicons name={details.icon} size={32} color={theme.accent} />
      </View>

      {/* Title */}
      <Text
        style={{ color: theme.text }}
        className="font-black text-base text-center mb-1.5"
      >
        {details.title}
      </Text>

      {/* Description */}
      <Text
        style={{ color: theme.textSecondary }}
        className="text-xs text-center leading-5 px-3 mb-5"
      >
        {details.description}
      </Text>

      {/* Action Buttons */}
      <View className="flex-row items-center space-x-3 w-full justify-center">
        {onRefresh && (
          <TouchableOpacity
            onPress={onRefresh}
            style={{ backgroundColor: theme.accent }}
            className="flex-row items-center px-4 py-2.5 rounded-xl shadow-sm mr-2"
            activeOpacity={0.8}
          >
            <Ionicons name="refresh" size={15} color="#FFFFFF" style={{ marginRight: 5 }} />
            <Text className="text-white text-xs font-black tracking-wide">
              Refresh
            </Text>
          </TouchableOpacity>
        )}

        {onAction && (
          <TouchableOpacity
            onPress={onAction}
            style={{
              backgroundColor: theme.inputBg,
              borderColor: theme.cardBorder,
            }}
            className="flex-row items-center px-3.5 py-2.5 rounded-xl border ml-2"
            activeOpacity={0.8}
          >
            <Ionicons name="arrow-forward" size={14} color={theme.accent} style={{ marginRight: 4 }} />
            <Text style={{ color: theme.text }} className="text-xs font-bold">
              {actionLabel || details.secondaryAction}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
