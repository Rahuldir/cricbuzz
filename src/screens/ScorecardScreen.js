import React from 'react';
import { View } from 'react-native';
import FullScorecard from '../components/FullScorecard';

export default function ScorecardScreen() {
  return (
    <View className="flex-1 bg-slate-950">
      <FullScorecard />
    </View>
  );
}
