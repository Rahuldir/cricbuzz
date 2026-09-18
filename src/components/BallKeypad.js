import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useCricket } from '../context/CricketContext';
import { useTheme } from '../context/ThemeContext';
import { DISMISSAL_TYPES } from '../utils/cricketConstants';

export default function BallKeypad() {
  const { currentInnings, recordBall, matchStatus } = useCricket();
  const { theme, isDarkMode } = useTheme();

  const [wicketModalVisible, setWicketModalVisible] = useState(false);
  const [extraModalVisible, setExtraModalVisible] = useState(false);
  const [selectedExtraType, setSelectedExtraType] = useState('WD'); // 'WD', 'NB', 'B', 'LB'
  const [selectedDismissal, setSelectedDismissal] = useState(DISMISSAL_TYPES.CAUGHT);
  const [selectedNextBatsmanIndex, setSelectedNextBatsmanIndex] = useState(null);

  // Filter available batsmen who are 'yet_to_bat'
  const availableNextBatsmen = currentInnings.batsmen
    .map((b, idx) => ({ ...b, originalIndex: idx }))
    .filter((b) => b.status === 'yet_to_bat');

  const handleScoreRuns = (runs) => {
    recordBall({ runs, isExtra: false });
  };

  const openWicketDialog = () => {
    if (availableNextBatsmen.length > 0) {
      setSelectedNextBatsmanIndex(availableNextBatsmen[0].originalIndex);
    } else {
      setSelectedNextBatsmanIndex(null);
    }
    setWicketModalVisible(true);
  };

  const confirmWicket = () => {
    recordBall({
      runs: 0,
      isWicket: true,
      dismissalType: selectedDismissal,
      nextBatsmanIndex: selectedNextBatsmanIndex,
    });
    setWicketModalVisible(false);
  };

  const openExtraDialog = (type) => {
    setSelectedExtraType(type);
    setExtraModalVisible(true);
  };

  const confirmExtra = (runs) => {
    recordBall({
      runs,
      isExtra: true,
      extraType: selectedExtraType,
    });
    setExtraModalVisible(false);
  };

  const isControlsDisabled = matchStatus !== 'live';

  return (
    <View
      style={{
        backgroundColor: theme.card,
        borderColor: theme.cardBorder,
      }}
      className="mx-4 mt-3 mb-6 rounded-2xl border p-3.5 shadow-sm"
    >
      <View className="flex-row items-center justify-between mb-3">
        <Text style={{ color: theme.textSecondary }} className="font-bold text-xs uppercase tracking-wider">
          Scoring Keypad
        </Text>
        {isControlsDisabled && (
          <Text className="text-amber-500 font-bold text-xs">
            {matchStatus === 'innings_break' ? 'Innings Break' : 'Match Ended'}
          </Text>
        )}
      </View>

      {/* Main Runs Row: 0, 1, 2, 3 */}
      <View className="flex-row justify-between mb-2.5">
        {[0, 1, 2, 3].map((runs) => (
          <TouchableOpacity
            key={`run_${runs}`}
            disabled={isControlsDisabled}
            onPress={() => handleScoreRuns(runs)}
            style={{
              backgroundColor: isControlsDisabled
                ? theme.inputBg
                : runs === 0
                ? theme.statCardBg
                : theme.accentLight,
              borderColor: isControlsDisabled
                ? theme.cardBorder
                : runs === 0
                ? theme.cardBorder
                : theme.accent,
            }}
            className={`flex-1 mx-1 py-3 rounded-xl items-center justify-center border ${
              isControlsDisabled ? 'opacity-40' : ''
            }`}
            activeOpacity={0.7}
          >
            <Text
              style={{
                color: runs === 0 ? theme.textMuted : theme.accent,
              }}
              className="text-lg font-black"
            >
              {runs === 0 ? '• 0' : runs}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Boundaries & Wicket Row: 4, 6, WICKET */}
      <View className="flex-row justify-between mb-2.5">
        {/* 4 Runs */}
        <TouchableOpacity
          disabled={isControlsDisabled}
          onPress={() => handleScoreRuns(4)}
          style={{
            backgroundColor: isControlsDisabled ? theme.inputBg : theme.fourBadge,
            borderColor: isControlsDisabled ? theme.cardBorder : theme.fourBadge,
          }}
          className={`flex-1 mx-1 py-3.5 rounded-xl items-center justify-center border shadow-sm ${
            isControlsDisabled ? 'opacity-40' : ''
          }`}
          activeOpacity={0.7}
        >
          <Text className="text-white text-xl font-black">4 FOUR</Text>
        </TouchableOpacity>

        {/* 6 Runs */}
        <TouchableOpacity
          disabled={isControlsDisabled}
          onPress={() => handleScoreRuns(6)}
          style={{
            backgroundColor: isControlsDisabled ? theme.inputBg : theme.sixBadge,
            borderColor: isControlsDisabled ? theme.cardBorder : theme.sixBadge,
          }}
          className={`flex-1 mx-1 py-3.5 rounded-xl items-center justify-center border shadow-sm ${
            isControlsDisabled ? 'opacity-40' : ''
          }`}
          activeOpacity={0.7}
        >
          <Text className="text-white text-xl font-black">6 SIX</Text>
        </TouchableOpacity>

        {/* WICKET */}
        <TouchableOpacity
          disabled={isControlsDisabled}
          onPress={openWicketDialog}
          style={{
            backgroundColor: isControlsDisabled ? theme.inputBg : theme.wicketBadge,
            borderColor: isControlsDisabled ? theme.cardBorder : theme.wicketBadge,
          }}
          className={`flex-1 mx-1 py-3.5 rounded-xl items-center justify-center border shadow-sm ${
            isControlsDisabled ? 'opacity-40' : ''
          }`}
          activeOpacity={0.7}
        >
          <Text className="text-white text-base font-black">OUT !</Text>
        </TouchableOpacity>
      </View>

      {/* Extras Row: Wide, No Ball, Bye, Leg Bye */}
      <View className="flex-row justify-between pt-1">
        {[
          { label: 'WD', desc: 'Wide', type: 'WD' },
          { label: 'NB', desc: 'No Ball', type: 'NB' },
          { label: 'B', desc: 'Bye', type: 'B' },
          { label: 'LB', desc: 'Leg Bye', type: 'LB' },
        ].map((item) => (
          <TouchableOpacity
            key={item.type}
            disabled={isControlsDisabled}
            onPress={() => openExtraDialog(item.type)}
            style={{
              backgroundColor: isControlsDisabled ? theme.inputBg : theme.extraBadge + '20',
              borderColor: isControlsDisabled ? theme.cardBorder : theme.extraBadge + '60',
            }}
            className={`flex-1 mx-1 py-2 rounded-lg items-center justify-center border ${
              isControlsDisabled ? 'opacity-40' : ''
            }`}
            activeOpacity={0.7}
          >
            <Text style={{ color: theme.extraBadge }} className="font-black text-xs">{item.label}</Text>
            <Text style={{ color: theme.extraBadge }} className="text-[10px] font-medium">{item.desc}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Wicket Dismissal Modal */}
      <Modal
        visible={wicketModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setWicketModalVisible(false)}
      >
        <View className="flex-1 bg-black/80 justify-end">
          <View
            style={{ backgroundColor: theme.card, borderColor: theme.cardBorder }}
            className="border-t rounded-t-3xl p-5 max-h-[85%]"
          >
            <View className="flex-row justify-between items-center pb-3 border-b" style={{ borderColor: theme.divider }}>
              <View className="flex-row items-center">
                <Ionicons name="alert-circle" size={22} color={theme.wicketBadge} style={{ marginRight: 6 }} />
                <Text style={{ color: theme.text }} className="font-extrabold text-lg">
                  Record Wicket Dismissal
                </Text>
              </View>
              <TouchableOpacity onPress={() => setWicketModalVisible(false)}>
                <Ionicons name="close-circle" size={24} color={theme.textMuted} />
              </TouchableOpacity>
            </View>

            <ScrollView className="mt-3">
              {/* Dismissal Method Picker */}
              <Text style={{ color: theme.textMuted }} className="text-xs font-bold uppercase mb-2">
                Dismissal Type
              </Text>
              <View className="flex-row flex-wrap mb-4">
                {Object.values(DISMISSAL_TYPES).map((type) => (
                  <TouchableOpacity
                    key={type}
                    onPress={() => setSelectedDismissal(type)}
                    style={{
                      backgroundColor: selectedDismissal === type ? theme.wicketBadge : theme.inputBg,
                      borderColor: selectedDismissal === type ? theme.wicketBadge : theme.cardBorder,
                    }}
                    className="px-3.5 py-2 rounded-xl mr-2 mb-2 border"
                  >
                    <Text
                      style={{
                        color: selectedDismissal === type ? '#FFFFFF' : theme.textSecondary,
                      }}
                      className="text-xs font-bold"
                    >
                      {type}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Next Batsman Selection */}
              {availableNextBatsmen.length > 0 ? (
                <>
                  <Text style={{ color: theme.textMuted }} className="text-xs font-bold uppercase mb-2">
                    Next Batsman to Bat
                  </Text>
                  <View className="space-y-1.5 mb-4">
                    {availableNextBatsmen.map((b) => (
                      <TouchableOpacity
                        key={b.id}
                        onPress={() => setSelectedNextBatsmanIndex(b.originalIndex)}
                        style={{
                          backgroundColor: selectedNextBatsmanIndex === b.originalIndex ? theme.accent + '20' : theme.inputBg,
                          borderColor: selectedNextBatsmanIndex === b.originalIndex ? theme.accent : theme.cardBorder,
                        }}
                        className="p-2.5 rounded-xl border flex-row justify-between items-center mb-1.5"
                      >
                        <Text style={{ color: theme.text }} className="font-semibold text-sm">{b.name}</Text>
                        {selectedNextBatsmanIndex === b.originalIndex && (
                          <Ionicons name="checkmark-circle" size={18} color={theme.accent} />
                        )}
                      </TouchableOpacity>
                    ))}
                  </View>
                </>
              ) : (
                <View
                  style={{ backgroundColor: theme.extraBadge + '20', borderColor: theme.extraBadge + '50' }}
                  className="p-3 border rounded-xl mb-4"
                >
                  <Text style={{ color: theme.extraBadge }} className="text-xs font-semibold">
                    No more batsmen remaining. Innings will conclude (All Out).
                  </Text>
                </View>
              )}

              {/* Confirm Button */}
              <TouchableOpacity
                onPress={confirmWicket}
                style={{ backgroundColor: theme.wicketBadge }}
                className="py-3.5 rounded-xl items-center mb-4 shadow-lg"
              >
                <Text className="text-white font-black text-base uppercase tracking-wider">
                  Confirm Wicket
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Extra Runs Modal */}
      <Modal
        visible={extraModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setExtraModalVisible(false)}
      >
        <View className="flex-1 bg-black/75 justify-center p-4">
          <View
            style={{ backgroundColor: theme.card, borderColor: theme.cardBorder }}
            className="border rounded-2xl p-5 shadow-2xl"
          >
            <View className="flex-row justify-between items-center mb-3 pb-2 border-b" style={{ borderColor: theme.divider }}>
              <Text style={{ color: theme.text }} className="font-extrabold text-base">
                Record {selectedExtraType === 'WD' ? 'Wide' : selectedExtraType === 'NB' ? 'No Ball' : selectedExtraType === 'B' ? 'Bye' : 'Leg Bye'}
              </Text>
              <TouchableOpacity onPress={() => setExtraModalVisible(false)}>
                <Ionicons name="close-circle" size={24} color={theme.textMuted} />
              </TouchableOpacity>
            </View>

            <Text style={{ color: theme.textSecondary }} className="text-xs mb-3">
              Additional bat/overthrow runs scored on this delivery:
            </Text>

            <View className="flex-row justify-between mb-4">
              {[0, 1, 2, 3, 4, 6].map((extraRuns) => (
                <TouchableOpacity
                  key={`extra_${extraRuns}`}
                  onPress={() => confirmExtra(extraRuns)}
                  style={{
                    backgroundColor: theme.extraBadge + '25',
                    borderColor: theme.extraBadge,
                  }}
                  className="flex-1 mx-1 py-3 rounded-xl items-center justify-center border"
                >
                  <Text style={{ color: theme.extraBadge }} className="text-base font-black">
                    +{extraRuns}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              onPress={() => setExtraModalVisible(false)}
              style={{ backgroundColor: theme.inputBg, borderColor: theme.cardBorder }}
              className="py-2.5 rounded-xl items-center border"
            >
              <Text style={{ color: theme.textSecondary }} className="text-xs font-bold">
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}
