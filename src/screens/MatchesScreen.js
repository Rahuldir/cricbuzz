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
  getInProgressFixtures,
  getUpcomingFixtures,
  getCompletedFixtures,
} from '../services/cricketApi';
import MatchCenterModal from '../components/MatchCenterModal';
import { TeamFlag } from '../utils/flagHelper';
import EmptyStateView from '../components/EmptyStateView';
import { MatchCardSkeleton } from '../components/ShimmerSkeleton';

export default function MatchesScreen() {
  const { theme } = useTheme();

  const [activeSubTab, setActiveSubTab] = useState('live'); // 'live' | 'upcoming' | 'completed' | 'all'
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [liveFixtures, setLiveFixtures] = useState([]);
  const [upcomingFixtures, setUpcomingFixtures] = useState([]);
  const [completedFixtures, setCompletedFixtures] = useState([]);

  const [selectedFixture, setSelectedFixture] = useState(null);
  const [matchCenterVisible, setMatchCenterVisible] = useState(false);

  const fetchMatches = useCallback(async (isSilent = false) => {
    if (!isSilent) setLoading(true);
    try {
      const [liveRes, upRes, compRes] = await Promise.all([
        getInProgressFixtures(10),
        getUpcomingFixtures(10),
        getCompletedFixtures(10),
      ]);

      setLiveFixtures(liveRes.fixtures || []);
      setUpcomingFixtures(upRes.fixtures || []);
      setCompletedFixtures(compRes.fixtures || []);
    } catch (err) {
      console.warn('Fetch error:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchMatches();
    const interval = setInterval(() => fetchMatches(true), 30000);
    return () => clearInterval(interval);
  }, [fetchMatches]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchMatches();
  };

  const openFixtureDetail = (fixture) => {
    setSelectedFixture(fixture);
    setMatchCenterVisible(true);
  };

  let displayedFixtures = [];
  if (activeSubTab === 'live') displayedFixtures = liveFixtures;
  else if (activeSubTab === 'upcoming') displayedFixtures = upcomingFixtures;
  else if (activeSubTab === 'completed') displayedFixtures = completedFixtures;
  else displayedFixtures = [...liveFixtures, ...upcomingFixtures, ...completedFixtures];

  return (
    <View style={{ backgroundColor: theme.bg }} className="flex-1">
      {/* Top Header Bar (Matching Image 2 & 3) */}
      <View className="bg-emerald-700 dark:bg-emerald-900 px-4 pt-3 pb-3 flex-row items-center justify-between shadow-md">
        <TouchableOpacity className="p-1">
          <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>

        <Text className="text-white font-extrabold text-lg text-center tracking-tight">
          Live Score
        </Text>

        <View className="w-7 h-7 rounded-full bg-emerald-600 items-center justify-center">
          <Ionicons name="location" size={15} color="#FFFFFF" />
        </View>
      </View>

      {/* Top 3-Pill Segmented Navigation Bar (Exact Match for Image 2 & 3) */}
      <View className="px-4 pt-3 pb-2">
        <View className="flex-row bg-slate-200/80 dark:bg-slate-800/80 p-1.5 rounded-2xl items-center shadow-2xs">
          {[
            { id: 'live', label: 'Live', hasDot: false },
            { id: 'completed', label: 'Recent', hasDot: false },
            { id: 'upcoming', label: 'Upcoming', hasDot: true },
          ].map((tab) => {
            const isActive = activeSubTab === tab.id;
            return (
              <TouchableOpacity
                key={tab.id}
                onPress={() => setActiveSubTab(tab.id)}
                style={{
                  backgroundColor: isActive ? '#007A3B' : 'transparent',
                }}
                className="flex-1 py-2.5 rounded-xl items-center justify-center flex-row shadow-xs"
                activeOpacity={0.8}
              >
                <Text
                  style={{
                    color: isActive ? '#FFFFFF' : theme.textSecondary,
                    fontWeight: isActive ? '800' : '600',
                  }}
                  className="text-xs tracking-tight"
                >
                  {tab.label}
                </Text>
                {tab.hasDot && (
                  <View className="w-1.5 h-1.5 rounded-full bg-red-500 ml-1 mb-2" />
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Content Area */}
      {loading ? (
        <ScrollView className="flex-1 px-4 pt-4">
          <View className="flex-row justify-center items-center py-2 mb-2">
            <ActivityIndicator size="small" color={theme.accent} style={{ marginRight: 8 }} />
            <Text style={{ color: theme.accent }} className="text-xs font-bold">
              FETCHING LIVE MATCHES...
            </Text>
          </View>
          <MatchCardSkeleton />
          <MatchCardSkeleton />
          <MatchCardSkeleton />
        </ScrollView>
      ) : (
        <ScrollView
          className="flex-1 px-4 pt-3.5"
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={theme.accent}
            />
          }
        >
          {displayedFixtures.length === 0 ? (
            <EmptyStateView
              type={activeSubTab}
              onRefresh={onRefresh}
              onAction={() => setActiveSubTab(activeSubTab === 'live' ? 'upcoming' : 'live')}
              actionLabel={activeSubTab === 'live' ? 'Check Upcoming' : 'Check Live'}
            />
          ) : (
            <View className="space-y-3 pb-8">
              {displayedFixtures.map((match) => (
                <TouchableOpacity
                  key={match.fixtureId}
                  onPress={() => openFixtureDetail(match)}
                  activeOpacity={0.85}
                  style={{
                    backgroundColor: theme.card,
                    borderColor: theme.cardBorder,
                  }}
                  className="p-4 rounded-2xl border shadow-sm mb-3.5"
                >
                  {/* Card top banner */}
                  <View className="flex-row justify-between items-center pb-2.5 border-b" style={{ borderColor: theme.divider }}>
                    <Text style={{ color: theme.textSecondary }} className="text-xs font-semibold flex-1 mr-2" numberOfLines={1}>
                      {match.title || match.series}
                    </Text>
                    <View
                      style={{
                        backgroundColor:
                          match.status === 'Live'
                            ? theme.liveBadgeBg
                            : match.status === 'Completed'
                            ? theme.accentLight
                            : theme.inputBg,
                      }}
                      className="px-2.5 py-0.5 rounded-full flex-row items-center"
                    >
                      {match.status === 'Live' && (
                        <View style={{ backgroundColor: theme.liveBadge }} className="w-1.5 h-1.5 rounded-full mr-1 animate-pulse" />
                      )}
                      <Text
                        style={{
                          color:
                            match.status === 'Live'
                              ? theme.liveBadge
                              : match.status === 'Completed'
                              ? theme.accent
                              : theme.textMuted,
                        }}
                        className="text-[10px] font-black uppercase tracking-wider"
                      >
                        {match.status}
                      </Text>
                    </View>
                  </View>

                  {/* Teams & Scores */}
                  <View className="py-3 space-y-2.5">
                    <View className="flex-row justify-between items-center">
                      <View className="flex-row items-center space-x-2 flex-1 mr-2">
                        <TeamFlag
                          logo={match.team1?.logo}
                          teamName={match.team1?.name}
                          countryCode={match.team1?.shortName}
                          size={26}
                          style={{ marginRight: 8 }}
                        />
                        <Text style={{ color: theme.text }} className="font-extrabold text-sm flex-1" numberOfLines={1}>
                          {match.team1?.name}
                        </Text>
                      </View>
                      <Text style={{ color: theme.text }} className="font-black text-sm">
                        {match.team1?.score}{' '}
                        {match.team1?.overs && match.team1.overs !== '-' && (
                          <Text style={{ color: theme.textMuted }} className="text-xs font-normal">
                            ({match.team1?.overs} ov)
                          </Text>
                        )}
                      </Text>
                    </View>

                    <View className="flex-row justify-between items-center">
                      <View className="flex-row items-center space-x-2 flex-1 mr-2">
                        <TeamFlag
                          logo={match.team2?.logo}
                          teamName={match.team2?.name}
                          countryCode={match.team2?.shortName}
                          size={26}
                          style={{ marginRight: 8 }}
                        />
                        <Text style={{ color: theme.text }} className="font-extrabold text-sm flex-1" numberOfLines={1}>
                          {match.team2?.name}
                        </Text>
                      </View>
                      <Text style={{ color: theme.text }} className="font-black text-sm">
                        {match.team2?.score}{' '}
                        {match.team2?.overs && match.team2.overs !== '-' && (
                          <Text style={{ color: theme.textMuted }} className="text-xs font-normal">
                            ({match.team2?.overs} ov)
                          </Text>
                        )}
                      </Text>
                    </View>
                  </View>

                  {/* Status Note or Player of match */}
                  <View className="pt-2.5 border-t flex-row justify-between items-center" style={{ borderColor: theme.divider }}>
                    <Text
                      style={{
                        color:
                          match.status === 'Live'
                            ? theme.liveBadge
                            : match.status === 'Completed'
                            ? '#2563EB'
                            : theme.textSecondary,
                      }}
                      className="text-xs font-bold flex-1 mr-2"
                      numberOfLines={1}
                    >
                      {match.statusNote || match.playerOfTheMatch || match.matchDate || match.venue}
                    </Text>

                    <Ionicons name="chevron-forward" size={16} color={theme.textMuted} />
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </ScrollView>
      )}

      {/* Match Center Modal */}
      <MatchCenterModal
        visible={matchCenterVisible}
        fixture={selectedFixture}
        onClose={() => setMatchCenterVisible(false)}
      />
    </View>
  );
}
