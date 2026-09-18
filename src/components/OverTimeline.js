import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useCricket } from '../context/CricketContext';
import { useTheme } from '../context/ThemeContext';

export default function OverTimeline() {
  const { currentInnings } = useCricket();
  const { theme, isDarkMode } = useTheme();

  const getBallStyles = (color) => {
    switch (color) {
      case 'wicket':
        return { bg: theme.wicketBadge, text: '#FFFFFF', border: theme.wicketBadge };
      case 'six':
        return { bg: theme.sixBadge, text: '#FFFFFF', border: theme.sixBadge };
      case 'four':
        return { bg: theme.fourBadge, text: '#FFFFFF', border: theme.fourBadge };
      case 'extra':
        return { bg: theme.extraBadge, text: '#FFFFFF', border: theme.extraBadge };
      case 'run':
        return { bg: theme.inputBg, text: theme.accent, border: theme.cardBorder };
      case 'dot':
      default:
        return { bg: theme.inputBg, text: theme.textMuted, border: theme.cardBorder };
    }
  };

  return (
    <View
      style={{
        backgroundColor: theme.card,
        borderColor: theme.cardBorder,
      }}
      className="mx-4 mt-3 rounded-2xl border p-3.5 shadow-sm"
    >
      <View className="flex-row items-center justify-between mb-2">
        <Text style={{ color: theme.textSecondary }} className="text-xs font-bold uppercase tracking-wider">
          This Over ({currentInnings.overs}.{currentInnings.balls})
        </Text>
        <Text style={{ color: theme.accent }} className="text-xs font-extrabold">
          Runs: {currentInnings.currentOverBalls.reduce((sum, b) => sum + (b.runs || 0), 0)}
        </Text>
      </View>

      {/* Ball bubbles for active over */}
      <View className="flex-row items-center space-x-2">
        {currentInnings.currentOverBalls.length === 0 ? (
          <Text style={{ color: theme.textMuted }} className="text-xs italic py-1">
            New over ready to start...
          </Text>
        ) : (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row py-1">
            {currentInnings.currentOverBalls.map((ball) => {
              const st = getBallStyles(ball.color);
              return (
                <View
                  key={ball.id}
                  style={{
                    backgroundColor: st.bg,
                    borderColor: st.border,
                  }}
                  className="w-8 h-8 rounded-full items-center justify-center border mr-2 shadow-xs"
                >
                  <Text style={{ color: st.text }} className="font-black text-xs">
                    {ball.label}
                  </Text>
                </View>
              );
            })}
          </ScrollView>
        )}
      </View>

      {/* Previous overs summary if any */}
      {currentInnings.allOvers.length > 0 && (
        <View className="mt-2 pt-2 border-t" style={{ borderColor: theme.divider }}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
            {currentInnings.allOvers.slice(-3).reverse().map((ov) => (
              <View
                key={`ov_${ov.overNumber}`}
                style={{
                  backgroundColor: theme.statCardBg,
                  borderColor: theme.cardBorder,
                }}
                className="border rounded-lg px-2 py-1 mr-2 flex-row items-center"
              >
                <Text style={{ color: theme.textMuted }} className="text-xs font-bold mr-1.5">
                  Ov {ov.overNumber}:
                </Text>
                <View className="flex-row items-center mr-1.5">
                  {ov.balls.map((b) => (
                    <Text
                      key={b.id}
                      style={{
                        color:
                          b.color === 'wicket'
                            ? theme.wicketBadge
                            : b.color === 'six'
                            ? theme.sixBadge
                            : b.color === 'four'
                            ? theme.fourBadge
                            : b.color === 'extra'
                            ? theme.extraBadge
                            : theme.text,
                      }}
                      className="text-xs font-bold mx-0.5"
                    >
                      {b.label}
                    </Text>
                  ))}
                </View>
                <Text style={{ color: theme.accent }} className="text-xs font-extrabold">({ov.runs}r)</Text>
              </View>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
}
