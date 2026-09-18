import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useCricket } from '../context/CricketContext';
import { useTheme } from '../context/ThemeContext';
import EmptyStateView from '../components/EmptyStateView';

export default function MatchesHistoryScreen({ onOpenNewMatch }) {
  const { matchHistoryList } = useCricket();
  const { theme } = useTheme();

  return (
    <ScrollView
      style={{ backgroundColor: theme.bg }}
      className="flex-1 p-4"
      showsVerticalScrollIndicator={false}
    >
      <View className="flex-row justify-between items-center mb-4">
        <Text style={{ color: theme.text }} className="font-black text-base tracking-wider">
          MATCH HISTORY
        </Text>
        <TouchableOpacity
          onPress={onOpenNewMatch}
          style={{ backgroundColor: theme.accent }}
          className="px-3 py-1.5 rounded-lg flex-row items-center shadow-sm"
        >
          <Ionicons name="add" size={16} color="#FFFFFF" style={{ marginRight: 2 }} />
          <Text className="text-white text-xs font-bold">New Match</Text>
        </TouchableOpacity>
      </View>

      {matchHistoryList.length === 0 ? (
        <EmptyStateView
          type="history"
          onAction={onOpenNewMatch}
          actionLabel="Start New Match"
        />
      ) : (
        <View className="space-y-3 pb-8">
          {matchHistoryList.map((match) => (
            <View
              key={match.id}
              style={{ backgroundColor: theme.card, borderColor: theme.cardBorder }}
              className="border rounded-2xl p-4 mb-3 shadow-sm"
            >
              <View className="flex-row justify-between items-center pb-2 border-b" style={{ borderColor: theme.divider }}>
                <Text style={{ color: theme.accent }} className="font-bold text-xs uppercase">
                  {match.overs} Overs Match
                </Text>
                <Text style={{ color: theme.textMuted }} className="text-xs">{match.date}</Text>
              </View>

              <View className="py-2.5 space-y-1.5">
                <View className="flex-row justify-between items-center">
                  <Text style={{ color: theme.text }} className="font-bold text-sm">{match.team1}</Text>
                  <Text style={{ color: theme.textSecondary }} className="font-mono font-bold text-sm">{match.team1Score}</Text>
                </View>

                <View className="flex-row justify-between items-center">
                  <Text style={{ color: theme.text }} className="font-bold text-sm">{match.team2}</Text>
                  <Text style={{ color: theme.textSecondary }} className="font-mono font-bold text-sm">{match.team2Score}</Text>
                </View>
              </View>

              <View className="pt-2 border-t flex-row items-center" style={{ borderColor: theme.divider }}>
                <Ionicons name="ribbon" size={14} color="#F59E0B" style={{ marginRight: 6 }} />
                <Text className="text-amber-500 text-xs font-bold flex-1" numberOfLines={1}>
                  {match.result}
                </Text>
              </View>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}
