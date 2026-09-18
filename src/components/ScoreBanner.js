import React from 'react';
import { View, Text } from 'react-native';
import { useCricket } from '../context/CricketContext';
import { useTheme } from '../context/ThemeContext';

export default function ScoreBanner() {
  const { currentInnings, currentInningsIndex, matchConfig, targetRuns, freeHit } = useCricket();
  const { theme, isDarkMode } = useTheme();

  // Current Run Rate calculation
  const totalBalls = currentInnings.overs * 6 + currentInnings.balls;
  const crr = totalBalls > 0 ? ((currentInnings.runs / totalBalls) * 6).toFixed(2) : '0.00';

  // Required Run Rate for 2nd innings
  const remainingRuns = targetRuns ? Math.max(0, targetRuns - currentInnings.runs) : 0;
  const remainingBalls = Math.max(0, matchConfig.totalOvers * 6 - totalBalls);
  const rrr =
    targetRuns && remainingBalls > 0
      ? ((remainingRuns / remainingBalls) * 6).toFixed(2)
      : '0.00';

  return (
    <View
      style={{
        backgroundColor: theme.card,
        borderColor: theme.accent + '40',
      }}
      className="mx-4 mt-3 rounded-2xl p-4 border shadow-xl"
    >
      {/* Top row: Matchup & Innings Indicator */}
      <View className="flex-row justify-between items-center mb-2">
        <View className="flex-row items-center space-x-2">
          <View
            style={{ backgroundColor: theme.accentLight }}
            className="px-2.5 py-0.5 rounded-full mr-2"
          >
            <Text
              style={{ color: theme.accent }}
              className="text-xs font-extrabold uppercase tracking-wide"
            >
              {currentInningsIndex === 1 ? '1st Innings' : '2nd Innings'}
            </Text>
          </View>
          {freeHit && (
            <View className="bg-amber-500/20 px-2 py-0.5 rounded-full border border-amber-500">
              <Text className="text-amber-500 text-xs font-black">⚡ FREE HIT</Text>
            </View>
          )}
        </View>

        {currentInningsIndex === 2 && (
          <View className="bg-amber-500/20 px-2.5 py-0.5 rounded-full border border-amber-500/40">
            <Text className="text-amber-600 dark:text-amber-300 text-xs font-semibold">
              Target: <Text className="font-black">{targetRuns}</Text>
            </Text>
          </View>
        )}
      </View>

      {/* Main Score Display */}
      <View className="flex-row justify-between items-end my-1">
        <View>
          <Text
            style={{ color: theme.accent }}
            className="text-xs font-extrabold uppercase tracking-wider mb-1"
          >
            {currentInnings.teamName} Batting
          </Text>
          <View className="flex-row items-baseline">
            <Text
              style={{ color: theme.text }}
              className="text-4xl font-black tracking-tight"
            >
              {currentInnings.runs}
            </Text>
            <Text
              style={{ color: theme.accent }}
              className="text-2xl font-bold ml-1"
            >
              /{currentInnings.wickets}
            </Text>
          </View>
        </View>

        <View className="items-end">
          <Text style={{ color: theme.textMuted }} className="text-xs font-medium mb-1">
            Overs
          </Text>
          <Text style={{ color: theme.text }} className="text-2xl font-black">
            {currentInnings.overs}.{currentInnings.balls}
            <Text style={{ color: theme.textMuted }} className="text-sm font-semibold">
              {' '}/ {matchConfig.totalOvers}
            </Text>
          </Text>
        </View>
      </View>

      {/* Run Rate & Match Equation Bar */}
      <View
        className="mt-3 pt-2.5 border-t flex-row justify-between items-center"
        style={{ borderColor: theme.divider }}
      >
        <View className="flex-row items-center space-x-3">
          <Text style={{ color: theme.textSecondary }} className="text-xs mr-3">
            CRR: <Text style={{ color: theme.accent }} className="font-bold">{crr}</Text>
          </Text>
          {currentInningsIndex === 2 && (
            <Text style={{ color: theme.textSecondary }} className="text-xs">
              RRR: <Text className="text-amber-500 font-bold">{rrr}</Text>
            </Text>
          )}
        </View>

        {currentInningsIndex === 2 ? (
          <Text className="text-amber-600 dark:text-amber-400 text-xs font-bold">
            Need {remainingRuns} off {remainingBalls} balls
          </Text>
        ) : (
          <Text style={{ color: theme.textMuted }} className="text-xs">
            Extras: <Text style={{ color: theme.text }} className="font-medium">{currentInnings.extras.total}</Text> (wd {currentInnings.extras.wides}, nb {currentInnings.extras.noBalls})
          </Text>
        )}
      </View>
    </View>
  );
}
