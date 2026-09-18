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
import { getIplSchedule } from '../services/cricketApi';
import { TeamFlag } from '../utils/flagHelper';
import { MatchCardSkeleton } from '../components/ShimmerSkeleton';
import EmptyStateView from '../components/EmptyStateView';

export default function ScheduleScreen() {
  const { theme } = useTheme();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [schedule, setSchedule] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  const loadSchedule = useCallback(async (isSilent = false) => {
    if (!isSilent) setLoading(true);
    try {
      const res = await getIplSchedule();
      setSchedule(res.schedule || []);
    } catch (err) {
      console.warn('Schedule fetch err:', err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadSchedule();
    const timer = setInterval(() => loadSchedule(true), 45000);
    return () => clearInterval(timer);
  }, [loadSchedule]);

  const onRefresh = () => {
    setRefreshing(true);
    loadSchedule();
  };

  const filteredSchedule = schedule.filter((m) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      m.team1?.toLowerCase().includes(q) ||
      m.team2?.toLowerCase().includes(q) ||
      m.venue?.toLowerCase().includes(q) ||
      `match ${m.matchNo}`.includes(q)
    );
  });

  return (
    <View style={{ backgroundColor: theme.bg }} className="flex-1">
      {/* Top Header Banner */}
      <View
        style={{ backgroundColor: theme.card, borderColor: theme.cardBorder }}
        className="px-4 pt-3 pb-3 border-b shadow-xs"
      >
        <View className="flex-row justify-between items-center">
          <View className="flex-row items-center space-x-2">
            <View className="w-8 h-8 rounded-lg bg-emerald-500/20 items-center justify-center mr-2">
              <Ionicons name="calendar" size={18} color={theme.accent} />
            </View>
            <View>
              <Text style={{ color: theme.text }} className="font-black text-base tracking-wide">
                IPL MATCH SCHEDULE
              </Text>
              <Text style={{ color: theme.textMuted }} className="text-[11px]">
                {schedule.length} Official Fixtures • Live API
              </Text>
            </View>
          </View>

          <View className="flex-row items-center px-2.5 py-1 rounded-full" style={{ backgroundColor: theme.accentLight }}>
            <View className="w-1.5 h-1.5 rounded-full mr-1.5" style={{ backgroundColor: theme.accent }} />
            <Text style={{ color: theme.accent }} className="text-[10px] font-black uppercase tracking-wider">
              Season 2026
            </Text>
          </View>
        </View>
      </View>

      {/* Main Schedule Content */}
      {loading ? (
        <ScrollView className="flex-1 px-4 mt-3" showsVerticalScrollIndicator={false}>
          <View className="flex-row justify-center items-center py-3">
            <ActivityIndicator size="small" color={theme.accent} style={{ marginRight: 8 }} />
            <Text style={{ color: theme.accent }} className="text-xs font-bold tracking-wide">
              LOADING MATCH SCHEDULE...
            </Text>
          </View>
          <MatchCardSkeleton />
          <MatchCardSkeleton />
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
          {filteredSchedule.length === 0 ? (
            <EmptyStateView
              type="upcoming"
              onRefresh={onRefresh}
              actionLabel="Reload Schedule"
            />
          ) : (
            <View className="space-y-4 pb-8">
              {filteredSchedule.map((item, idx) => (
                <View
                  key={idx}
                  style={{
                    backgroundColor: theme.card,
                    borderColor: theme.cardBorder,
                  }}
                  className="p-4 rounded-3xl border shadow-sm mb-3.5"
                >
                  {/* Top Match Bar with Match No and Date/Time */}
                  <View
                    className="flex-row justify-between items-center pb-3 border-b"
                    style={{ borderColor: theme.divider }}
                  >
                    <View
                      style={{ backgroundColor: theme.accentLight }}
                      className="px-2.5 py-1 rounded-md"
                    >
                      <Text style={{ color: theme.accent }} className="text-xs font-black">
                        Match {item.matchNo}
                      </Text>
                    </View>

                    <View className="flex-row items-center">
                      <Ionicons name="time-outline" size={13} color={theme.textMuted} style={{ marginRight: 4 }} />
                      <Text style={{ color: theme.textSecondary }} className="text-xs font-bold">
                        {item.date} • {item.time}
                      </Text>
                    </View>
                  </View>

                  {/* Spacious Team Matchup Row */}
                  <View className="py-4 flex-row justify-between items-center">
                    {/* Team 1 */}
                    <View className="items-center flex-1 pr-2">
                      <TeamFlag
                        logo={item.team1Logo}
                        teamName={item.team1}
                        countryCode={item.team1}
                        size={40}
                        style={{ marginBottom: 6 }}
                      />
                      <Text
                        style={{ color: theme.text }}
                        className="text-sm font-black text-center"
                        numberOfLines={1}
                      >
                        {item.team1}
                      </Text>
                    </View>

                    {/* VS Badge */}
                    <View
                      style={{
                        backgroundColor: theme.inputBg,
                        borderColor: theme.cardBorder,
                      }}
                      className="w-9 h-9 rounded-full border items-center justify-center shadow-xs mx-1"
                    >
                      <Text style={{ color: theme.textMuted }} className="text-xs font-black">
                        VS
                      </Text>
                    </View>

                    {/* Team 2 */}
                    <View className="items-center flex-1 pl-2">
                      <TeamFlag
                        logo={item.team2Logo}
                        teamName={item.team2}
                        countryCode={item.team2}
                        size={40}
                        style={{ marginBottom: 6 }}
                      />
                      <Text
                        style={{ color: theme.text }}
                        className="text-sm font-black text-center"
                        numberOfLines={1}
                      >
                        {item.team2}
                      </Text>
                    </View>
                  </View>

                  {/* Stadium / Venue Footer */}
                  <View
                    className="pt-2.5 border-t flex-row justify-between items-center"
                    style={{ borderColor: theme.divider }}
                  >
                    <View className="flex-row items-center flex-1 mr-2">
                      <Ionicons name="location-outline" size={14} color={theme.accent} style={{ marginRight: 4 }} />
                      <Text style={{ color: theme.textMuted }} className="text-xs font-medium flex-1" numberOfLines={1}>
                        {item.venue}
                      </Text>
                    </View>

                    {item.matchWinner && item.matchWinner !== 'Pending' ? (
                      <View className="px-2 py-0.5 rounded bg-emerald-500/20">
                        <Text className="text-emerald-400 text-[10px] font-bold">
                          Won: {item.matchWinner}
                        </Text>
                      </View>
                    ) : (
                      <View className="px-2 py-0.5 rounded bg-amber-500/15">
                        <Text className="text-amber-500 text-[10px] font-bold">
                          Upcoming
                        </Text>
                      </View>
                    )}
                  </View>
                </View>
              ))}
            </View>
          )}
        </ScrollView>
      )}
    </View>
  );
}
