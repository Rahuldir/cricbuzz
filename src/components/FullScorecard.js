import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useCricket } from '../context/CricketContext';
import { useTheme } from '../context/ThemeContext';

export default function FullScorecard() {
  const { firstInnings, secondInnings, currentInningsIndex } = useCricket();
  const { theme } = useTheme();
  const [selectedInningTab, setSelectedInningTab] = useState(currentInningsIndex);

  const activeData = selectedInningTab === 1 ? firstInnings : secondInnings;

  return (
    <View style={{ backgroundColor: theme.bg }} className="flex-1 px-4 py-3">
      {/* Inning Selector Tabs */}
      <View
        style={{ backgroundColor: theme.statCardBg, borderColor: theme.cardBorder }}
        className="flex-row p-1 rounded-xl border mb-3"
      >
        <TouchableOpacity
          onPress={() => setSelectedInningTab(1)}
          style={{
            backgroundColor: selectedInningTab === 1 ? theme.accent : 'transparent',
          }}
          className="flex-1 py-2 rounded-lg items-center"
        >
          <Text
            style={{
              color: selectedInningTab === 1 ? '#FFFFFF' : theme.textSecondary,
              fontWeight: selectedInningTab === 1 ? 'bold' : 'normal',
            }}
            className="text-xs"
          >
            1st Inn: {firstInnings.teamShort} ({firstInnings.runs}/{firstInnings.wickets})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setSelectedInningTab(2)}
          style={{
            backgroundColor: selectedInningTab === 2 ? theme.accent : 'transparent',
          }}
          className="flex-1 py-2 rounded-lg items-center"
        >
          <Text
            style={{
              color: selectedInningTab === 2 ? '#FFFFFF' : theme.textSecondary,
              fontWeight: selectedInningTab === 2 ? 'bold' : 'normal',
            }}
            className="text-xs"
          >
            2nd Inn: {secondInnings.teamShort} ({secondInnings.runs}/{secondInnings.wickets})
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} className="space-y-4">
        {/* Batting Card */}
        <View
          style={{ backgroundColor: theme.card, borderColor: theme.cardBorder }}
          className="border rounded-2xl p-3.5 shadow-sm mb-3"
        >
          <View className="flex-row justify-between items-center pb-2 border-b" style={{ borderColor: theme.divider }}>
            <Text style={{ color: theme.accent }} className="font-extrabold text-xs uppercase tracking-wider">
              Batting - {activeData.teamName}
            </Text>
            <Text style={{ color: theme.textMuted }} className="text-xs font-semibold">
              R (B) • 4s • 6s • SR
            </Text>
          </View>

          {/* Batting Rows */}
          {activeData.batsmen
            .filter((b) => b.status !== 'yet_to_bat' || b.runs > 0 || b.balls > 0)
            .map((b) => (
              <View
                key={b.id}
                className="py-2.5 border-b flex-row justify-between items-center"
                style={{ borderColor: theme.cardBorderSubtle }}
              >
                <View className="flex-1 mr-2">
                  <Text style={{ color: theme.text }} className="font-bold text-sm">
                    {b.name}
                    {b.status === 'batting' ? (
                      <Text style={{ color: theme.accent }} className="font-black"> *</Text>
                    ) : null}
                  </Text>
                  <Text style={{ color: theme.textMuted }} className="text-[11px] mt-0.5">
                    {b.isOut ? b.dismissalText || 'Out' : 'Not Out'}
                  </Text>
                </View>

                <View className="flex-row items-center space-x-3">
                  <Text style={{ color: theme.text }} className="font-black text-sm w-12 text-right">
                    {b.runs}{' '}
                    <Text style={{ color: theme.textMuted }} className="font-normal text-xs">({b.balls})</Text>
                  </Text>
                  <Text style={{ color: theme.textSecondary }} className="text-xs w-6 text-center">{b.fours}</Text>
                  <Text style={{ color: theme.textSecondary }} className="text-xs w-6 text-center">{b.sixes}</Text>
                  <Text style={{ color: theme.accent }} className="font-bold text-xs w-10 text-right">
                    {b.strikeRate}
                  </Text>
                </View>
              </View>
            ))}

          {/* Extras summary */}
          <View className="pt-3 pb-1 flex-row justify-between items-center border-t" style={{ borderColor: theme.divider }}>
            <Text style={{ color: theme.textSecondary }} className="text-xs font-medium">Extras</Text>
            <Text style={{ color: theme.text }} className="text-xs font-bold">
              {activeData.extras.total} (b {activeData.extras.byes}, lb {activeData.extras.legByes}, wd{' '}
              {activeData.extras.wides}, nb {activeData.extras.noBalls})
            </Text>
          </View>

          {/* Total score row */}
          <View className="pt-2 flex-row justify-between items-center border-t" style={{ borderColor: theme.divider }}>
            <Text style={{ color: theme.accent }} className="font-black text-sm uppercase">Total Score</Text>
            <Text style={{ color: theme.text }} className="font-black text-base">
              {activeData.runs}/{activeData.wickets}{' '}
              <Text style={{ color: theme.textMuted }} className="text-xs font-normal">
                ({activeData.overs}.{activeData.balls} Ov)
              </Text>
            </Text>
          </View>
        </View>

        {/* Bowling Card */}
        <View
          style={{ backgroundColor: theme.card, borderColor: theme.cardBorder }}
          className="border rounded-2xl p-3.5 shadow-sm mb-3"
        >
          <View className="flex-row justify-between items-center pb-2 border-b" style={{ borderColor: theme.divider }}>
            <Text style={{ color: theme.accent }} className="font-bold text-xs uppercase tracking-wider">
              Bowling - {activeData.bowlingTeamName}
            </Text>
            <Text style={{ color: theme.textMuted }} className="text-xs font-semibold">O • M • R • W • Econ</Text>
          </View>

          {activeData.bowlers
            .filter((bw) => bw.balls > 0 || bw.runs > 0 || bw.wickets > 0)
            .map((bw) => (
              <View
                key={bw.id}
                className="py-2.5 border-b flex-row justify-between items-center"
                style={{ borderColor: theme.cardBorderSubtle }}
              >
                <Text style={{ color: theme.text }} className="font-bold text-sm flex-1 mr-2" numberOfLines={1}>
                  {bw.name}
                </Text>
                <View className="flex-row items-center space-x-2">
                  <Text style={{ color: theme.textSecondary }} className="text-xs w-8 text-center">{bw.overs}</Text>
                  <Text style={{ color: theme.textMuted }} className="text-xs w-6 text-center">{bw.maidens}</Text>
                  <Text style={{ color: theme.textSecondary }} className="text-xs w-8 text-center">{bw.runs}</Text>
                  <Text style={{ color: theme.wicketBadge }} className="font-bold text-xs w-6 text-center">{bw.wickets}</Text>
                  <Text style={{ color: theme.accent }} className="font-bold text-xs w-11 text-right">
                    {bw.economy}
                  </Text>
                </View>
              </View>
            ))}

          {activeData.bowlers.filter((bw) => bw.balls > 0).length === 0 && (
            <Text style={{ color: theme.textMuted }} className="text-xs italic py-2">No bowling figures yet</Text>
          )}
        </View>

        {/* Fall of Wickets */}
        {activeData.fallOfWickets.length > 0 && (
          <View
            style={{ backgroundColor: theme.card, borderColor: theme.cardBorder }}
            className="border rounded-2xl p-3.5 shadow-sm mb-6"
          >
            <Text style={{ color: theme.wicketBadge }} className="font-bold text-xs uppercase tracking-wider mb-2">
              Fall of Wickets
            </Text>
            <View className="flex-row flex-wrap">
              {activeData.fallOfWickets.map((fow) => (
                <View
                  key={`fow_${fow.wicketNumber}`}
                  style={{ backgroundColor: theme.inputBg, borderColor: theme.cardBorder }}
                  className="border px-2.5 py-1 rounded-lg mr-2 mb-2"
                >
                  <Text style={{ color: theme.text }} className="text-xs font-bold">
                    {fow.score}/{fow.wicketNumber}{' '}
                    <Text style={{ color: theme.textMuted }} className="font-normal">({fow.batsmanName}, {fow.over} ov)</Text>
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
