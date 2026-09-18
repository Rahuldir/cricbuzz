import React from 'react';
import { ScrollView } from 'react-native';
import ScoreBanner from '../components/ScoreBanner';
import LivePitchView from '../components/LivePitchView';
import OverTimeline from '../components/OverTimeline';
import BallKeypad from '../components/BallKeypad';
import { useTheme } from '../context/ThemeContext';

export default function LiveMatchScreen() {
  const { theme } = useTheme();

  return (
    <ScrollView
      style={{ backgroundColor: theme.bg }}
      className="flex-1"
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      <ScoreBanner />
      <LivePitchView />
      <OverTimeline />
      <BallKeypad />
    </ScrollView>
  );
}
