import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useCricket } from '../context/CricketContext';
import { useTheme } from '../context/ThemeContext';

export default function LivePitchView() {
  const { currentInnings, rotateStrike, selectBowler } = useCricket();
  const { theme, isDarkMode } = useTheme();
  const [bowlerPickerVisible, setBowlerPickerVisible] = useState(false);

  const striker = currentInnings.batsmen[currentInnings.strikerIndex];
  const nonStriker = currentInnings.batsmen[currentInnings.nonStrikerIndex];
  const activeBowler = currentInnings.bowlers[currentInnings.activeBowlerIndex];

  return (
    <View
      style={{
        backgroundColor: theme.card,
        borderColor: theme.cardBorder,
      }}
      className="mx-4 mt-3 rounded-2xl border p-3.5 shadow-sm"
    >
      {/* Header bar of pitch */}
      <View className="flex-row justify-between items-center pb-2 border-b" style={{ borderColor: theme.divider }}>
        <View className="flex-row items-center">
          <Ionicons name="shield-checkmark" size={14} color={theme.accent} style={{ marginRight: 4 }} />
          <Text style={{ color: theme.textSecondary }} className="text-xs font-bold uppercase tracking-wider">
            Live On Pitch
          </Text>
        </View>
        <TouchableOpacity
          onPress={rotateStrike}
          style={{ backgroundColor: theme.accentLight }}
          className="flex-row items-center px-2.5 py-1 rounded-full"
          activeOpacity={0.7}
        >
          <Ionicons name="swap-horizontal" size={13} color={theme.accent} style={{ marginRight: 4 }} />
          <Text style={{ color: theme.accent }} className="text-xs font-bold">Swap Strike</Text>
        </TouchableOpacity>
      </View>

      {/* Batsmen Section */}
      <View className="mt-2.5 space-y-2">
        {/* Striker */}
        <View
          style={{
            backgroundColor: theme.statCardBg,
            borderColor: theme.accent,
          }}
          className="flex-row justify-between items-center p-2.5 rounded-xl border"
        >
          <View className="flex-row items-center flex-1 mr-2">
            <View style={{ backgroundColor: theme.accent }} className="w-2.5 h-2.5 rounded-full mr-2 shadow-sm" />
            <View className="flex-1">
              <View className="flex-row items-center">
                <Text style={{ color: theme.text }} className="font-extrabold text-sm" numberOfLines={1}>
                  {striker?.name || 'Striker'}
                </Text>
                <Text style={{ color: theme.accent }} className="font-extrabold ml-1.5 text-xs">*</Text>
              </View>
              <Text style={{ color: theme.textMuted }} className="text-xs mt-0.5">
                4s: <Text style={{ color: theme.textSecondary }}>{striker?.fours || 0}</Text>  |  6s: <Text style={{ color: theme.textSecondary }}>{striker?.sixes || 0}</Text>
              </Text>
            </View>
          </View>
          <View className="items-end">
            <Text style={{ color: theme.text }} className="text-base font-black">
              {striker?.runs || 0}
              <Text style={{ color: theme.textMuted }} className="text-xs font-normal"> ({striker?.balls || 0})</Text>
            </Text>
            <Text style={{ color: theme.accent }} className="text-xs font-bold">
              SR {striker?.strikeRate || '0.0'}
            </Text>
          </View>
        </View>

        {/* Non-Striker */}
        <View
          style={{
            backgroundColor: theme.statCardBg,
            borderColor: theme.cardBorderSubtle,
          }}
          className="flex-row justify-between items-center p-2.5 rounded-xl border mt-1.5"
        >
          <View className="flex-1 mr-2">
            <Text style={{ color: theme.textSecondary }} className="font-semibold text-sm" numberOfLines={1}>
              {nonStriker?.name || 'Non-Striker'}
            </Text>
            <Text style={{ color: theme.textMuted }} className="text-xs mt-0.5">
              4s: <Text style={{ color: theme.textSecondary }}>{nonStriker?.fours || 0}</Text>  |  6s: <Text style={{ color: theme.textSecondary }}>{nonStriker?.sixes || 0}</Text>
            </Text>
          </View>
          <View className="items-end">
            <Text style={{ color: theme.textSecondary }} className="text-base font-bold">
              {nonStriker?.runs || 0}
              <Text style={{ color: theme.textMuted }} className="text-xs font-normal"> ({nonStriker?.balls || 0})</Text>
            </Text>
            <Text style={{ color: theme.textMuted }} className="text-xs font-medium">
              SR {nonStriker?.strikeRate || '0.0'}
            </Text>
          </View>
        </View>
      </View>

      {/* Bowler Section */}
      <View className="mt-3 pt-2.5 border-t flex-row justify-between items-center" style={{ borderColor: theme.divider }}>
        <View className="flex-1 mr-2">
          <View className="flex-row items-center">
            <Text style={{ color: theme.textMuted }} className="text-xs font-medium mr-1.5">Bowler:</Text>
            <Text style={{ color: theme.text }} className="font-extrabold text-sm" numberOfLines={1}>
              {activeBowler?.name || 'Bowler'}
            </Text>
          </View>
          <Text style={{ color: theme.textMuted }} className="text-xs mt-0.5">
            Overs: <Text style={{ color: theme.textSecondary }}>{activeBowler?.overs || '0.0'}</Text>  |  Econ: <Text style={{ color: theme.textSecondary }}>{activeBowler?.economy || '0.00'}</Text>
          </Text>
        </View>

        <View className="flex-row items-center space-x-2">
          <View className="items-end mr-2">
            <Text style={{ color: theme.text }} className="font-black text-sm">
              {activeBowler?.wickets || 0} - {activeBowler?.runs || 0}
            </Text>
            <Text style={{ color: theme.textMuted }} className="text-xs">M: {activeBowler?.maidens || 0}</Text>
          </View>

          <TouchableOpacity
            onPress={() => setBowlerPickerVisible(true)}
            style={{ backgroundColor: theme.accentLight }}
            className="p-1.5 rounded-lg"
          >
            <Ionicons name="person-outline" size={16} color={theme.accent} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Bowler Selection Modal */}
      <Modal
        visible={bowlerPickerVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setBowlerPickerVisible(false)}
      >
        <View className="flex-1 bg-black/70 justify-center p-4">
          <View
            style={{ backgroundColor: theme.card, borderColor: theme.cardBorder }}
            className="border rounded-2xl p-4 max-h-96 shadow-2xl"
          >
            <View className="flex-row justify-between items-center mb-3 pb-2 border-b" style={{ borderColor: theme.divider }}>
              <Text style={{ color: theme.text }} className="font-black text-base">
                Select Active Bowler
              </Text>
              <TouchableOpacity onPress={() => setBowlerPickerVisible(false)}>
                <Ionicons name="close-circle" size={24} color={theme.textMuted} />
              </TouchableOpacity>
            </View>

            <ScrollView className="space-y-2">
              {currentInnings.bowlers.map((b, idx) => (
                <TouchableOpacity
                  key={b.id}
                  onPress={() => {
                    selectBowler(idx);
                    setBowlerPickerVisible(false);
                  }}
                  style={{
                    backgroundColor: idx === currentInnings.activeBowlerIndex ? theme.accent + '20' : theme.inputBg,
                    borderColor: idx === currentInnings.activeBowlerIndex ? theme.accent : theme.cardBorder,
                  }}
                  className="flex-row justify-between items-center p-3 rounded-xl mb-1.5 border"
                >
                  <View>
                    <Text style={{ color: theme.text }} className="font-bold text-sm">{b.name}</Text>
                    <Text style={{ color: theme.textMuted }} className="text-xs">
                      {b.overs} ov • {b.runs} runs • {b.wickets} wkt
                    </Text>
                  </View>
                  {idx === currentInnings.activeBowlerIndex && (
                    <Ionicons name="checkmark-circle" size={20} color={theme.accent} />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}
