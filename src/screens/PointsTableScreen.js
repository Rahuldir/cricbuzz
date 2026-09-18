import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { getIplPointTable } from '../services/cricketApi';
import { TeamFlag } from '../utils/flagHelper';
import { SkeletonBox } from '../components/ShimmerSkeleton';
import EmptyStateView from '../components/EmptyStateView';

export default function PointsTableScreen() {
  const { theme } = useTheme();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [pointsTable, setPointsTable] = useState([]);
  const [selectedYear, setSelectedYear] = useState('2024');
  const [allYears, setAllYears] = useState(['2024', '2023', '2022', '2021', '2020']);

  const loadPointsTable = useCallback(async (yearToFetch = selectedYear, isSilent = false) => {
    if (!isSilent) setLoading(true);
    try {
      const res = await getIplPointTable(yearToFetch);
      setPointsTable(res.pointsTable || []);
      if (res.allYears && res.allYears.length > 0) {
        setAllYears(res.allYears);
      }
      if (res.year) {
        setSelectedYear(res.year);
      }
    } catch (err) {
      console.warn('Points Table fetch err:', err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [selectedYear]);

  useEffect(() => {
    loadPointsTable(selectedYear);

    // Auto-polling every 45s
    const timer = setInterval(() => {
      loadPointsTable(selectedYear, true);
    }, 45000);
    return () => clearInterval(timer);
  }, [loadPointsTable, selectedYear]);

  const onRefresh = () => {
    setRefreshing(true);
    loadPointsTable(selectedYear);
  };

  const onSelectYear = (yr) => {
    setSelectedYear(yr);
    loadPointsTable(yr);
  };

  return (
    <View style={{ backgroundColor: theme.bg }} className="flex-1">
      {/* Top Banner / Season Selector Header */}
      <View
        style={{ backgroundColor: theme.card, borderColor: theme.cardBorder }}
        className="px-4 pt-3 pb-2.5 border-b shadow-xs"
      >
        <View className="flex-row justify-between items-center mb-2">
          <View className="flex-row items-center space-x-2">
            <View className="w-7 h-7 rounded-lg bg-emerald-500/20 items-center justify-center mr-2">
              <Ionicons name="podium" size={16} color={theme.accent} />
            </View>
            <View>
              <Text style={{ color: theme.text }} className="font-black text-sm tracking-wide">
                IPL {selectedYear} STANDINGS
              </Text>
              <Text style={{ color: theme.textMuted }} className="text-[10px]">
                Real API • Top 4 Teams Qualify
              </Text>
            </View>
          </View>

          <View className="flex-row items-center px-2 py-0.5 rounded-full" style={{ backgroundColor: theme.accentLight }}>
            <View className="w-1.5 h-1.5 rounded-full mr-1" style={{ backgroundColor: theme.accent }} />
            <Text style={{ color: theme.accent }} className="text-[10px] font-extrabold uppercase">
              Season {selectedYear}
            </Text>
          </View>
        </View>

        {/* Season Selector Chips with generous touch padding */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row py-1 -mx-1 px-1">
          {allYears.slice(0, 10).map((yr) => {
            const isSelected = selectedYear === yr;
            return (
              <TouchableOpacity
                key={yr}
                onPress={() => onSelectYear(yr)}
                style={{
                  backgroundColor: isSelected ? theme.accent : theme.inputBg,
                  borderColor: isSelected ? theme.accent : theme.cardBorder,
                }}
                className="px-3.5 py-1.5 rounded-full border mr-2 shadow-xs"
                activeOpacity={0.7}
              >
                <Text
                  style={{
                    color: isSelected ? '#FFFFFF' : theme.textSecondary,
                    fontWeight: isSelected ? '900' : '600',
                  }}
                  className="text-xs"
                >
                  {yr}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Main Table Content */}
      {loading ? (
        <ScrollView className="flex-1 px-4 mt-3" showsVerticalScrollIndicator={false}>
          <View className="flex-row justify-center items-center py-3">
            <ActivityIndicator size="small" color={theme.accent} style={{ marginRight: 8 }} />
            <Text style={{ color: theme.accent }} className="text-xs font-bold tracking-wide">
              FETCHING IPL {selectedYear} STANDINGS...
            </Text>
          </View>
          <View style={{ backgroundColor: theme.card, borderColor: theme.cardBorder }} className="p-4 rounded-2xl border">
            <SkeletonBox width={'100%'} height={36} style={{ marginBottom: 12 }} />
            {[...Array(6)].map((_, i) => (
              <SkeletonBox key={i} width={'100%'} height={44} style={{ marginBottom: 8 }} />
            ))}
          </View>
        </ScrollView>
      ) : (
        <ScrollView
          className="flex-1 px-4 mt-3"
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={theme.accent}
              colors={[theme.accent, '#10B981', '#009270']}
            />
          }
        >
          {pointsTable.length === 0 ? (
            <EmptyStateView
              type="general"
              onRefresh={onRefresh}
              actionLabel="Reload Standings"
            />
          ) : (
            <View
              style={{ backgroundColor: theme.card, borderColor: theme.cardBorder }}
              className="p-4 rounded-2xl border shadow-sm mb-6"
            >
              {/* Clean spacious Table Header */}
              <View
                className="flex-row items-center py-2.5 border-b"
                style={{ borderColor: theme.divider }}
              >
                <Text style={{ color: theme.textMuted }} className="text-xs font-bold w-7 text-center">#</Text>
                <Text style={{ color: theme.textMuted }} className="text-xs font-bold flex-1 ml-2">Team</Text>
                <Text style={{ color: theme.textMuted }} className="text-xs font-bold w-8 text-center">P</Text>
                <Text style={{ color: theme.textMuted }} className="text-xs font-bold w-8 text-center">W</Text>
                <Text style={{ color: theme.textMuted }} className="text-xs font-bold w-8 text-center">L</Text>
                <Text style={{ color: theme.textMuted }} className="text-xs font-bold w-12 text-center">NRR</Text>
                <Text style={{ color: theme.text }} className="text-xs font-black w-10 text-right">PTS</Text>
              </View>

              {/* Table Rows with generous vertical padding */}
              {pointsTable.map((item, idx) => {
                const isTopFour = idx < 4;
                return (
                  <View key={item.rank || idx}>
                    <View
                      className="flex-row items-center py-3.5 border-b"
                      style={{
                        borderColor: theme.cardBorderSubtle,
                        backgroundColor: isTopFour ? theme.accent + '06' : 'transparent',
                      }}
                    >
                      {/* Rank badge */}
                      <View className="w-7 items-center">
                        <View
                          style={{
                            backgroundColor: isTopFour ? theme.accent : theme.inputBg,
                          }}
                          className="w-5 h-5 rounded-full items-center justify-center"
                        >
                          <Text
                            style={{ color: isTopFour ? '#FFFFFF' : theme.textMuted }}
                            className="text-[10px] font-black"
                          >
                            {item.rank}
                          </Text>
                        </View>
                      </View>

                      {/* Team Logo & Name with comfortable spacing */}
                      <View className="flex-1 flex-row items-center ml-2 mr-1">
                        <TeamFlag
                          logo={item.logo}
                          teamName={item.team}
                          countryCode={item.shortName}
                          size={26}
                          style={{ marginRight: 8 }}
                        />
                        <View className="flex-1">
                          <Text style={{ color: theme.text }} className="text-xs font-extrabold" numberOfLines={1}>
                            {item.team}
                          </Text>
                          <Text style={{ color: theme.textMuted }} className="text-[10px] font-medium" numberOfLines={1}>
                            {item.shortName}
                          </Text>
                        </View>
                      </View>

                      {/* Stats with comfortable columns */}
                      <Text style={{ color: theme.textSecondary }} className="text-xs w-8 text-center font-medium">{item.played}</Text>
                      <Text style={{ color: theme.textSecondary }} className="text-xs w-8 text-center font-semibold">{item.won}</Text>
                      <Text style={{ color: theme.textSecondary }} className="text-xs w-8 text-center font-medium">{item.lost}</Text>
                      <Text
                        style={{
                          color: item.nrr?.startsWith('+') ? theme.accent : theme.textMuted,
                        }}
                        className="text-[11px] font-mono w-12 text-center"
                      >
                        {item.nrr}
                      </Text>
                      <Text style={{ color: theme.accent }} className="text-sm font-black w-10 text-right">
                        {item.points}
                      </Text>
                    </View>

                    {/* Cutoff Qualifier Bar after Rank 4 */}
                    {idx === 3 && (
                      <View
                        className="py-1.5 px-3 flex-row justify-center items-center my-1 rounded-md border"
                        style={{
                          backgroundColor: theme.accentLight,
                          borderColor: theme.accent + '40',
                        }}
                      >
                        <Ionicons name="shield-checkmark" size={13} color={theme.accent} style={{ marginRight: 5 }} />
                        <Text style={{ color: theme.accent }} className="text-[10px] font-black uppercase tracking-wider">
                          Playoffs Qualification Cutoff Line
                        </Text>
                      </View>
                    )}
                  </View>
                );
              })}
            </View>
          )}
        </ScrollView>
      )}
    </View>
  );
}
