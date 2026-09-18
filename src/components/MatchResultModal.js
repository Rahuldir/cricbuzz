import React from 'react';
import { View, Text, Modal, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useCricket } from '../context/CricketContext';
import { useTheme } from '../context/ThemeContext';

export default function MatchResultModal({ onOpenScorecard, onOpenNewMatch }) {
  const {
    matchStatus,
    matchResult,
    firstInnings,
    secondInnings,
    targetRuns,
    matchConfig,
    startSecondInnings,
  } = useCricket();
  const { theme } = useTheme();

  if (matchStatus === 'live') return null;

  const isInningsBreak = matchStatus === 'innings_break';

  return (
    <Modal visible={matchStatus !== 'live'} transparent animationType="fade">
      <View className="flex-1 bg-black/80 justify-center items-center p-5">
        <View
          style={{ backgroundColor: theme.card, borderColor: theme.cardBorder }}
          className="border rounded-3xl p-6 w-full max-w-sm items-center shadow-2xl"
        >
          {/* Top Trophy / Celebration Badge */}
          <View
            style={{
              backgroundColor: isInningsBreak ? theme.extraBadge + '20' : theme.accentLight,
              borderColor: isInningsBreak ? theme.extraBadge : theme.accent,
            }}
            className="w-16 h-16 rounded-full items-center justify-center mb-3 border"
          >
            <Ionicons
              name={isInningsBreak ? 'pause-circle' : 'trophy'}
              size={34}
              color={isInningsBreak ? theme.extraBadge : theme.accent}
            />
          </View>

          {/* Title */}
          <Text style={{ color: theme.text }} className="font-black text-xl text-center mb-1">
            {isInningsBreak ? 'INNINGS BREAK' : 'MATCH COMPLETED'}
          </Text>

          {/* Description */}
          {isInningsBreak ? (
            <View className="items-center my-3 w-full">
              <Text style={{ color: theme.textSecondary }} className="text-sm text-center mb-2">
                {firstInnings.teamName} completed their 1st innings
              </Text>
              <View
                style={{ backgroundColor: theme.statCardBg, borderColor: theme.cardBorder }}
                className="border px-4 py-3 rounded-2xl w-full items-center"
              >
                <Text style={{ color: theme.text }} className="font-black text-2xl">
                  {firstInnings.runs}/{firstInnings.wickets}
                </Text>
                <Text style={{ color: theme.textMuted }} className="text-xs mt-0.5">
                  in {firstInnings.overs}.{firstInnings.balls} / {matchConfig.totalOvers} Overs
                </Text>
              </View>

              <View
                style={{ backgroundColor: theme.accentLight }}
                className="mt-3 px-4 py-2 rounded-xl w-full items-center"
              >
                <Text style={{ color: theme.accent }} className="text-xs font-semibold">
                  Target for {secondInnings.teamName}:
                </Text>
                <Text style={{ color: theme.accent }} className="font-black text-lg">
                  {targetRuns} Runs in {matchConfig.totalOvers * 6} Balls
                </Text>
              </View>

              {/* Start 2nd Innings Button */}
              <TouchableOpacity
                onPress={startSecondInnings}
                style={{ backgroundColor: theme.accent }}
                className="w-full py-3.5 rounded-xl items-center mt-5 shadow-lg"
              >
                <Text className="text-white font-black text-sm uppercase tracking-wider">
                  Start 2nd Innings
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View className="items-center my-3 w-full">
              <Text style={{ color: theme.accent }} className="font-extrabold text-base text-center mb-4">
                {matchResult}
              </Text>

              {/* Scores summary */}
              <View
                style={{ backgroundColor: theme.statCardBg, borderColor: theme.cardBorder }}
                className="border p-3 rounded-2xl w-full space-y-2 mb-4"
              >
                <View className="flex-row justify-between items-center py-1">
                  <Text style={{ color: theme.textSecondary }} className="font-bold text-sm">{firstInnings.teamName}</Text>
                  <Text style={{ color: theme.text }} className="font-mono font-black text-sm">
                    {firstInnings.runs}/{firstInnings.wickets}{' '}
                    <Text style={{ color: theme.textMuted }} className="text-xs font-normal">
                      ({firstInnings.overs}.{firstInnings.balls} ov)
                    </Text>
                  </Text>
                </View>

                <View className="flex-row justify-between items-center py-1 border-t" style={{ borderColor: theme.divider }}>
                  <Text style={{ color: theme.textSecondary }} className="font-bold text-sm">{secondInnings.teamName}</Text>
                  <Text style={{ color: theme.text }} className="font-mono font-black text-sm">
                    {secondInnings.runs}/{secondInnings.wickets}{' '}
                    <Text style={{ color: theme.textMuted }} className="text-xs font-normal">
                      ({secondInnings.overs}.{secondInnings.balls} ov)
                    </Text>
                  </Text>
                </View>
              </View>

              {/* View Scorecard Button */}
              <TouchableOpacity
                onPress={onOpenScorecard}
                style={{ backgroundColor: theme.accent }}
                className="w-full py-3 rounded-xl items-center mb-2.5"
              >
                <Text className="text-white font-bold text-sm">View Full Scorecard</Text>
              </TouchableOpacity>

              {/* New Match Button */}
              <TouchableOpacity
                onPress={onOpenNewMatch}
                style={{ backgroundColor: theme.inputBg, borderColor: theme.cardBorder }}
                className="border w-full py-3 rounded-xl items-center"
              >
                <Text style={{ color: theme.text }} className="font-bold text-sm">Start Next Match</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
}
