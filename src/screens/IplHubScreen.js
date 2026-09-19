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
import {
  getIplPointTable,
  getIplSchedule,
  getIplPlayoff,
} from '../services/cricketApi';
import { MatchCardSkeleton, SkeletonBox } from '../components/ShimmerSkeleton';
import EmptyStateView from '../components/EmptyStateView';
import { TeamFlag } from '../utils/flagHelper';

export default function IplHubScreen() {
  const { theme } = useTheme();

  const [activeTab, setActiveTab] = useState('table'); // 'table' | 'schedule' | 'playoffs'
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [pointsTable, setPointsTable] = useState([]);
  const [schedule, setSchedule] = useState([]);
  const [playoffs, setPlayoffs] = useState([]);
  const [selectedYear, setSelectedYear] = useState('2024');
  const [allYears, setAllYears] = useState(['2024', '2023', '2022', '2021', '2020']);

  const loadIplData = useCallback(async (yearToFetch, isSilent = false) => {
    const yr = yearToFetch || '2024';
    if (!isSilent) setLoading(true);
    try {
      const [tableRes, schedRes, playRes] = await Promise.all([
        getIplPointTable(yr),
        getIplSchedule(),
        getIplPlayoff(),
      ]);

      setPointsTable(tableRes.pointsTable || []);
      if (tableRes.allYears && tableRes.allYears.length > 0) {
        setAllYears(tableRes.allYears);
      }
      if (tableRes.year) {
        setSelectedYear((prev) => (prev !== tableRes.year ? tableRes.year : prev));
      }
      setSchedule(schedRes.schedule || []);
      setPlayoffs(playRes.playoffs || []);
    } catch (err) {
      console.warn('IPL data fetch error:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadIplData(selectedYear);

    // Auto-polling interval: re-calls every 45s
    const pollInterval = setInterval(() => {
      loadIplData(selectedYear, true);
    }, 45000);

    return () => clearInterval(pollInterval);
  }, [loadIplData, selectedYear]);

  const onRefresh = () => {
    setRefreshing(true);
    loadIplData(selectedYear);
  };

  const onSelectYear = (yr) => {
    setSelectedYear(yr);
  };

  return (
    <View style={{ backgroundColor: theme.bg }} className="flex-1">
      {/* Sub Tabs */}
      <View className="flex-row mx-4 mt-3 bg-slate-200/70 dark:bg-slate-800/80 p-1 rounded-xl">
        {[
          { id: 'table', label: 'Points Table', icon: 'podium' },
          { id: 'schedule', label: 'Schedule', icon: 'calendar' },
          { id: 'playoffs', label: 'Playoffs', icon: 'trophy' },
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <TouchableOpacity
              key={tab.id}
              onPress={() => setActiveTab(tab.id)}
              style={{
                backgroundColor: isActive ? theme.card : 'transparent',
              }}
              className="flex-1 py-2 rounded-lg items-center flex-row justify-center"
            >
              <Ionicons
                name={tab.icon}
                size={14}
                color={isActive ? theme.accent : theme.textMuted}
                style={{ marginRight: 4 }}
              />
              <Text
                style={{
                  color: isActive ? theme.text : theme.textMuted,
                  fontWeight: isActive ? 'bold' : 'normal',
                }}
                className="text-xs"
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {loading ? (
        <ScrollView className="flex-1 px-4 mt-3" showsVerticalScrollIndicator={false}>
          {/* Green Spinner Header */}
          <View className="flex-row justify-center items-center py-3">
            <ActivityIndicator size="small" color={theme.accent} style={{ marginRight: 8 }} />
            <Text style={{ color: theme.accent }} className="text-xs font-bold tracking-wide">
              LOADING IPL 2025 DATA...
            </Text>
          </View>
          <View style={{ backgroundColor: theme.card, borderColor: theme.cardBorder }} className="p-4 rounded-2xl border mb-3">
            <SkeletonBox width={160} height={16} style={{ marginBottom: 16 }} />
            <SkeletonBox width={'100%'} height={32} style={{ marginBottom: 8 }} />
            <SkeletonBox width={'100%'} height={32} style={{ marginBottom: 8 }} />
            <SkeletonBox width={'100%'} height={32} style={{ marginBottom: 8 }} />
            <SkeletonBox width={'100%'} height={32} style={{ marginBottom: 8 }} />
            <SkeletonBox width={'100%'} height={32} />
          </View>
          <MatchCardSkeleton />
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
          {/* 1. POINTS TABLE TAB */}
          {activeTab === 'table' && (
            <View className="pb-8">
              {/* Season Year Selector Pills */}
              {allYears && allYears.length > 0 && (
                <View className="mb-3">
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row py-1">
                    {allYears.slice(0, 8).map((yr) => (
                      <TouchableOpacity
                        key={yr}
                        onPress={() => onSelectYear(yr)}
                        style={{
                          backgroundColor: selectedYear === yr ? theme.accent : theme.card,
                          borderColor: selectedYear === yr ? theme.accent : theme.cardBorder,
                        }}
                        className="px-3 py-1.5 rounded-full border mr-2 shadow-xs"
                      >
                        <Text
                          style={{
                            color: selectedYear === yr ? '#FFFFFF' : theme.textSecondary,
                            fontWeight: selectedYear === yr ? '900' : 'bold',
                          }}
                          className="text-xs"
                        >
                          Season {yr}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}

              {pointsTable.length === 0 ? (
                <EmptyStateView
                  type="general"
                  onRefresh={onRefresh}
                  actionLabel="Retry Points Table"
                />
              ) : (
                <View
                  style={{ backgroundColor: theme.card, borderColor: theme.cardBorder }}
                  className="p-3.5 rounded-2xl border shadow-sm"
                >
                  <View className="flex-row justify-between items-center pb-2.5 border-b" style={{ borderColor: theme.divider }}>
                    <Text style={{ color: theme.text }} className="font-black text-sm">
                      TATA IPL {selectedYear} STANDINGS
                    </Text>
                    <View className="flex-row items-center space-x-2">
                      <View className="w-2 h-2 rounded-full bg-emerald-500 mr-1" />
                      <Text style={{ color: theme.accent }} className="text-[10px] font-bold">
                        Top 4 Qualify
                      </Text>
                    </View>
                  </View>

                  {/* Table Header */}
                  <View className="flex-row items-center py-2 border-b" style={{ borderColor: theme.divider }}>
                    <Text style={{ color: theme.textMuted }} className="text-[11px] font-bold w-6 text-center">#</Text>
                    <Text style={{ color: theme.textMuted }} className="text-[11px] font-bold flex-1 ml-1">Team</Text>
                    <Text style={{ color: theme.textMuted }} className="text-[11px] font-bold w-7 text-center">P</Text>
                    <Text style={{ color: theme.textMuted }} className="text-[11px] font-bold w-7 text-center">W</Text>
                    <Text style={{ color: theme.textMuted }} className="text-[11px] font-bold w-7 text-center">L</Text>
                    <Text style={{ color: theme.textMuted }} className="text-[11px] font-bold w-12 text-center">NRR</Text>
                    <Text style={{ color: theme.text }} className="text-[11px] font-black w-8 text-right">PTS</Text>
                  </View>

                  {/* Table Rows */}
                  {pointsTable.map((item, idx) => {
                    const isTopFour = idx < 4;
                    return (
                      <View key={item.rank || idx}>
                        <View
                          className="flex-row items-center py-2.5 border-b"
                          style={{
                            borderColor: theme.cardBorderSubtle,
                            backgroundColor: isTopFour ? theme.accent + '08' : 'transparent',
                          }}
                        >
                          <View className="w-6 items-center">
                            <View
                              style={{
                                backgroundColor: isTopFour ? theme.accent : theme.inputBg,
                              }}
                              className="w-4 h-4 rounded-full items-center justify-center"
                            >
                              <Text
                                style={{ color: isTopFour ? '#FFFFFF' : theme.textMuted }}
                                className="text-[9px] font-black"
                              >
                                {item.rank}
                              </Text>
                            </View>
                          </View>

                          <View className="flex-1 flex-row items-center ml-1">
                            <TeamFlag
                              logo={item.logo}
                              teamName={item.team}
                              countryCode={item.shortName}
                              size={22}
                              style={{ marginRight: 6 }}
                            />
                            <View className="flex-1">
                              <Text style={{ color: theme.text }} className="text-xs font-extrabold" numberOfLines={1}>
                                {item.shortName || item.team}
                              </Text>
                              <Text style={{ color: theme.textMuted }} className="text-[9px]" numberOfLines={1}>
                                {item.team}
                              </Text>
                            </View>
                          </View>

                          <Text style={{ color: theme.textSecondary }} className="text-xs w-7 text-center">{item.played}</Text>
                          <Text style={{ color: theme.textSecondary }} className="text-xs w-7 text-center">{item.won}</Text>
                          <Text style={{ color: theme.textSecondary }} className="text-xs w-7 text-center">{item.lost}</Text>
                          <Text
                            style={{
                              color: item.nrr?.startsWith('+') ? theme.accent : theme.textMuted,
                            }}
                            className="text-[11px] font-mono w-12 text-center"
                          >
                            {item.nrr}
                          </Text>
                          <Text style={{ color: theme.accent }} className="text-xs font-black w-8 text-right">
                            {item.points}
                          </Text>
                        </View>

                        {/* Qualification Cutoff Divider after rank 4 */}
                        {idx === 3 && (
                          <View className="py-1 bg-emerald-500/10 border-y border-emerald-500/30 flex-row justify-center items-center my-0.5">
                            <Ionicons name="shield-checkmark" size={12} color={theme.accent} style={{ marginRight: 4 }} />
                            <Text style={{ color: theme.accent }} className="text-[10px] font-extrabold uppercase tracking-wide">
                              Playoffs Qualification Line
                            </Text>
                          </View>
                        )}
                      </View>
                    );
                  })}
                </View>
              )}
            </View>
          )}

          {/* 2. SCHEDULE TAB */}
          {activeTab === 'schedule' && (
            <View className="space-y-3 pb-8">
              <Text style={{ color: theme.text }} className="font-extrabold text-sm mb-1 tracking-wide">
                UPCOMING IPL MATCHES
              </Text>

              {schedule.length === 0 ? (
                <EmptyStateView
                  type="upcoming"
                  onRefresh={onRefresh}
                  actionLabel="Reload Schedule"
                />
              ) : (
                schedule.map((item, idx) => (
                  <View
                    key={idx}
                    style={{ backgroundColor: theme.card, borderColor: theme.cardBorder }}
                    className="p-4 rounded-2xl border shadow-sm mb-3"
                  >
                    <View className="flex-row justify-between items-center pb-2 border-b" style={{ borderColor: theme.divider }}>
                      <View
                        style={{ backgroundColor: theme.accentLight }}
                        className="px-2 py-0.5 rounded-full"
                      >
                        <Text style={{ color: theme.accent }} className="text-[10px] font-black">
                          Match {item.matchNo}
                        </Text>
                      </View>
                      <Text style={{ color: theme.textSecondary }} className="text-xs font-semibold">
                        {item.date} • {item.time}
                      </Text>
                    </View>

                    <View className="py-3 flex-row justify-between items-center">
                      <View className="flex-row items-center justify-center flex-1 space-x-1.5 mr-1">
                        <TeamFlag
                          logo={item.team1Logo}
                          teamName={item.team1}
                          countryCode={item.team1}
                          size={24}
                          style={{ marginRight: 6 }}
                        />
                        <Text style={{ color: theme.text }} className="text-sm font-extrabold text-center" numberOfLines={1}>
                          {item.team1}
                        </Text>
                      </View>
                      <View
                        style={{ backgroundColor: theme.inputBg }}
                        className="px-2.5 py-1 rounded-full mx-1"
                      >
                        <Text style={{ color: theme.textMuted }} className="text-[10px] font-black">
                          VS
                        </Text>
                      </View>
                      <View className="flex-row items-center justify-center flex-1 space-x-1.5 ml-1">
                        <Text style={{ color: theme.text }} className="text-sm font-extrabold text-center" numberOfLines={1}>
                          {item.team2}
                        </Text>
                        <TeamFlag
                          logo={item.team2Logo}
                          teamName={item.team2}
                          countryCode={item.team2}
                          size={24}
                          style={{ marginLeft: 6 }}
                        />
                      </View>
                    </View>

                    <View className="pt-2 border-t flex-row items-center" style={{ borderColor: theme.divider }}>
                      <Ionicons name="location-outline" size={14} color={theme.textMuted} style={{ marginRight: 4 }} />
                      <Text style={{ color: theme.textMuted }} className="text-xs flex-1" numberOfLines={1}>
                        {item.venue}
                      </Text>
                    </View>
                  </View>
                ))
              )}
            </View>
          )}

          {/* 3. PLAYOFFS TAB */}
          {activeTab === 'playoffs' && (
            <View className="space-y-3 pb-8">
              <Text style={{ color: theme.text }} className="font-extrabold text-sm mb-1 tracking-wide">
                TATA IPL 2025 PLAYOFFS BRACKET
              </Text>

              {playoffs.length === 0 ? (
                <EmptyStateView
                  type="general"
                  onRefresh={onRefresh}
                  actionLabel="Reload Playoffs"
                />
              ) : (
                playoffs.map((item, idx) => {
                  const isFinal = item.stage === 'Grand Final';
                  return (
                    <View
                      key={idx}
                      style={{
                        backgroundColor: theme.card,
                        borderColor: isFinal ? theme.accent : theme.cardBorder,
                        borderWidth: isFinal ? 2 : 1,
                      }}
                      className="p-4 rounded-2xl shadow-md mb-3"
                    >
                      <View className="flex-row justify-between items-center pb-2 border-b" style={{ borderColor: theme.divider }}>
                        <View className="flex-row items-center space-x-1">
                          {isFinal && (
                            <Ionicons name="trophy" size={16} color="#F59E0B" style={{ marginRight: 4 }} />
                          )}
                          <Text
                            style={{ color: isFinal ? theme.accent : theme.text }}
                            className="font-black text-sm"
                          >
                            {item.stage}
                          </Text>
                        </View>
                        <View
                          style={{ backgroundColor: theme.accentLight }}
                          className="px-2 py-0.5 rounded-full"
                        >
                          <Text style={{ color: theme.accent }} className="text-[10px] font-bold">
                            {item.status}
                          </Text>
                        </View>
                      </View>

                      <View className="py-3 flex-row justify-around items-center">
                        <View className="items-center flex-1">
                          <Text style={{ color: theme.text }} className="font-extrabold text-sm text-center">
                            {item.team1}
                          </Text>
                        </View>
                        <View
                          style={{ backgroundColor: theme.inputBg }}
                          className="w-7 h-7 rounded-full items-center justify-center mx-2"
                        >
                          <Text style={{ color: theme.textMuted }} className="text-[10px] font-black">
                            VS
                          </Text>
                        </View>
                        <View className="items-center flex-1">
                          <Text style={{ color: theme.text }} className="font-extrabold text-sm text-center">
                            {item.team2}
                          </Text>
                        </View>
                      </View>

                      <View className="pt-2 border-t space-y-1" style={{ borderColor: theme.divider }}>
                        <View className="flex-row items-center">
                          <Ionicons name="time-outline" size={12} color={theme.textMuted} style={{ marginRight: 4 }} />
                          <Text style={{ color: theme.textSecondary }} className="text-xs">
                            {item.date}
                          </Text>
                        </View>
                        <View className="flex-row items-center">
                          <Ionicons name="location-outline" size={12} color={theme.textMuted} style={{ marginRight: 4 }} />
                          <Text style={{ color: theme.textMuted }} className="text-xs">
                            {item.venue}
                          </Text>
                        </View>
                        <View className="mt-1 pt-1 border-t flex-row items-center" style={{ borderColor: theme.cardBorderSubtle }}>
                          <Ionicons name="information-circle-outline" size={12} color={theme.accent} style={{ marginRight: 4 }} />
                          <Text style={{ color: theme.accent }} className="text-[11px] font-medium">
                            {item.note}
                          </Text>
                        </View>
                      </View>
                    </View>
                  );
                })
              )}
            </View>
          )}
        </ScrollView>
      )}
    </View>
  );
}
