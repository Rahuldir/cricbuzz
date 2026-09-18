import React, { useState } from 'react';
import { View, Text, Modal, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useCricket } from '../context/CricketContext';
import { useTheme } from '../context/ThemeContext';

export default function NewMatchModal({ visible, onClose }) {
  const { startNewMatch } = useCricket();
  const { theme } = useTheme();

  const [team1Name, setTeam1Name] = useState('India');
  const [team1Short, setTeam1Short] = useState('IND');
  const [team2Name, setTeam2Name] = useState('Australia');
  const [team2Short, setTeam2Short] = useState('AUS');
  const [overs, setOvers] = useState('10');
  const [tossWinner, setTossWinner] = useState('Team 1');
  const [tossDecision, setTossDecision] = useState('Bat');

  const handleStart = () => {
    const finalTeam1 = {
      name: team1Name.trim() || 'Team A',
      shortName: team1Short.trim().toUpperCase() || 'TMA',
      color: '#0284C7',
      players: [
        `${team1Name} Player 1 (C)`,
        `${team1Name} Player 2`,
        `${team1Name} Player 3`,
        `${team1Name} Player 4`,
        `${team1Name} Player 5 (WK)`,
        `${team1Name} Player 6`,
        `${team1Name} Player 7`,
        `${team1Name} Player 8`,
        `${team1Name} Player 9`,
        `${team1Name} Player 10`,
        `${team1Name} Player 11`,
      ],
    };

    const finalTeam2 = {
      name: team2Name.trim() || 'Team B',
      shortName: team2Short.trim().toUpperCase() || 'TMB',
      color: '#EAB308',
      players: [
        `${team2Name} Player 1 (C)`,
        `${team2Name} Player 2`,
        `${team2Name} Player 3`,
        `${team2Name} Player 4`,
        `${team2Name} Player 5 (WK)`,
        `${team2Name} Player 6`,
        `${team2Name} Player 7`,
        `${team2Name} Player 8`,
        `${team2Name} Player 9`,
        `${team2Name} Player 10`,
        `${team2Name} Player 11`,
      ],
    };

    startNewMatch({
      team1: finalTeam1,
      team2: finalTeam2,
      totalOvers: parseInt(overs, 10) || 10,
      tossWinner: tossWinner === 'Team 1' ? finalTeam1.name : finalTeam2.name,
      tossDecision,
    });

    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View className="flex-1 bg-black/75 justify-end">
        <View
          style={{ backgroundColor: theme.card, borderColor: theme.cardBorder }}
          className="border-t rounded-t-3xl p-5 max-h-[90%] shadow-2xl"
        >
          {/* Header */}
          <View className="flex-row justify-between items-center pb-3 border-b" style={{ borderColor: theme.divider }}>
            <View className="flex-row items-center">
              <Ionicons name="trophy" size={20} color={theme.accent} style={{ marginRight: 6 }} />
              <Text style={{ color: theme.text }} className="font-black text-lg">
                Create New Match
              </Text>
            </View>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close-circle" size={24} color={theme.textMuted} />
            </TouchableOpacity>
          </View>

          <ScrollView className="mt-3" showsVerticalScrollIndicator={false}>
            {/* Team 1 Details */}
            <Text style={{ color: theme.accent }} className="text-xs font-bold uppercase mb-1">
              Team 1 (Host / Batting)
            </Text>
            <View className="flex-row space-x-2 mb-3">
              <TextInput
                value={team1Name}
                onChangeText={setTeam1Name}
                placeholder="Team Name (e.g. India)"
                placeholderTextColor={theme.textMuted}
                style={{
                  backgroundColor: theme.inputBg,
                  borderColor: theme.inputBorder,
                  color: theme.text,
                }}
                className="flex-1 border rounded-xl px-3 py-2 text-sm mr-2"
              />
              <TextInput
                value={team1Short}
                onChangeText={setTeam1Short}
                placeholder="IND"
                placeholderTextColor={theme.textMuted}
                style={{
                  backgroundColor: theme.inputBg,
                  borderColor: theme.inputBorder,
                  color: theme.text,
                }}
                className="w-20 border rounded-xl px-3 py-2 text-sm text-center font-bold"
                maxLength={4}
                autoCapitalize="characters"
              />
            </View>

            {/* Team 2 Details */}
            <Text style={{ color: theme.accent }} className="text-xs font-bold uppercase mb-1">
              Team 2 (Opponent / Bowling)
            </Text>
            <View className="flex-row space-x-2 mb-3">
              <TextInput
                value={team2Name}
                onChangeText={setTeam2Name}
                placeholder="Team Name (e.g. Australia)"
                placeholderTextColor={theme.textMuted}
                style={{
                  backgroundColor: theme.inputBg,
                  borderColor: theme.inputBorder,
                  color: theme.text,
                }}
                className="flex-1 border rounded-xl px-3 py-2 text-sm mr-2"
              />
              <TextInput
                value={team2Short}
                onChangeText={setTeam2Short}
                placeholder="AUS"
                placeholderTextColor={theme.textMuted}
                style={{
                  backgroundColor: theme.inputBg,
                  borderColor: theme.inputBorder,
                  color: theme.text,
                }}
                className="w-20 border rounded-xl px-3 py-2 text-sm text-center font-bold"
                maxLength={4}
                autoCapitalize="characters"
              />
            </View>

            {/* Overs Selector */}
            <Text style={{ color: theme.textMuted }} className="text-xs font-bold uppercase mb-1.5">
              Match Overs
            </Text>
            <View className="flex-row justify-between mb-4">
              {['5', '10', '20', '50'].map((ov) => (
                <TouchableOpacity
                  key={ov}
                  onPress={() => setOvers(ov)}
                  style={{
                    backgroundColor: overs === ov ? theme.accent : theme.inputBg,
                    borderColor: overs === ov ? theme.accent : theme.cardBorder,
                  }}
                  className="flex-1 mx-1 py-2.5 rounded-xl items-center border"
                >
                  <Text
                    style={{
                      color: overs === ov ? '#FFFFFF' : theme.textSecondary,
                      fontWeight: overs === ov ? '900' : 'bold',
                    }}
                    className="text-xs"
                  >
                    {ov} Ov
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Toss Selection */}
            <Text style={{ color: theme.textMuted }} className="text-xs font-bold uppercase mb-1.5">
              Toss Won By
            </Text>
            <View className="flex-row justify-between mb-3">
              {['Team 1', 'Team 2'].map((t) => (
                <TouchableOpacity
                  key={t}
                  onPress={() => setTossWinner(t)}
                  style={{
                    backgroundColor: tossWinner === t ? theme.accent + '20' : theme.inputBg,
                    borderColor: tossWinner === t ? theme.accent : theme.cardBorder,
                  }}
                  className="flex-1 mx-1 py-2.5 rounded-xl items-center border"
                >
                  <Text
                    style={{
                      color: tossWinner === t ? theme.accent : theme.textSecondary,
                      fontWeight: 'bold',
                    }}
                    className="text-xs"
                  >
                    {t === 'Team 1' ? team1Name || 'Team 1' : team2Name || 'Team 2'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Toss Decision */}
            <Text style={{ color: theme.textMuted }} className="text-xs font-bold uppercase mb-1.5">
              Elected To
            </Text>
            <View className="flex-row justify-between mb-5">
              {['Bat', 'Bowl'].map((dec) => (
                <TouchableOpacity
                  key={dec}
                  onPress={() => setTossDecision(dec)}
                  style={{
                    backgroundColor: tossDecision === dec ? theme.accent : theme.inputBg,
                    borderColor: tossDecision === dec ? theme.accent : theme.cardBorder,
                  }}
                  className="flex-1 mx-1 py-2.5 rounded-xl items-center border"
                >
                  <Text
                    style={{
                      color: tossDecision === dec ? '#FFFFFF' : theme.textSecondary,
                      fontWeight: '900',
                    }}
                    className="text-xs tracking-wider"
                  >
                    {dec.toUpperCase()} FIRST
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Submit Button */}
            <TouchableOpacity
              onPress={handleStart}
              style={{ backgroundColor: theme.accent }}
              className="p-4 rounded-xl items-center shadow-xl mb-4"
            >
              <Text className="text-white font-black text-sm tracking-wider">
                START MATCH NOW
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
