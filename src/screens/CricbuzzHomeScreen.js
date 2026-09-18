import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import {
  getInProgressFixtures,
  getUpcomingFixtures,
  getCompletedFixtures,
} from '../services/cricketApi';
import MatchCenterModal from '../components/MatchCenterModal';
import ServerConfigModal from '../components/ServerConfigModal';
import { MatchCardSkeleton, FeaturedCarouselSkeleton } from '../components/ShimmerSkeleton';
import EmptyStateView from '../components/EmptyStateView';

const { width } = Dimensions.get('window');

export default function CricbuzzHomeScreen({ onNavigateToScorer }) {
  const { theme } = useTheme();

  const [activeSubTab, setActiveSubTab] = useState('live'); // 'live' | 'upcoming' | 'completed' | 'all'
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [liveFixtures, setLiveFixtures] = useState([]);
  const [upcomingFixtures, setUpcomingFixtures] = useState([]);
  const [completedFixtures, setCompletedFixtures] = useState([]);
  const [isLiveApiActive, setIsLiveApiActive] = useState(false);

  const [selectedFixture, setSelectedFixture] = useState(null);
  const [matchCenterVisible, setMatchCenterVisible] = useState(false);
  const [serverModalVisible, setServerModalVisible] = useState(false);

  const fetchAllData = useCallback(async () => {
    try {
      const [liveRes, upRes, compRes] = await Promise.all([
        getInProgressFixtures(10),
        getUpcomingFixtures(10),
        getCompletedFixtures(10),
      ]);

      setLiveFixtures(liveRes.fixtures || []);
      setUpcomingFixtures(upRes.fixtures || []);
      setCompletedFixtures(compRes.fixtures || []);

      const anyLiveApi = liveRes.isLiveApi || upRes.isLiveApi || compRes.isLiveApi;
      setIsLiveApiActive(anyLiveApi);
    } catch (err) {
      console.warn('Fetch error:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchAllData();
  };

  const openFixtureDetail = (fixture) => {
    setSelectedFixture(fixture);
    setMatchCenterVisible(true);
  };

  // Filtered fixtures based on tab
  let displayedFixtures = [];
  if (activeSubTab === 'live') displayedFixtures = liveFixtures;
  else if (activeSubTab === 'upcoming') displayedFixtures = upcomingFixtures;
  else if (activeSubTab === 'completed') displayedFixtures = completedFixtures;
  else displayedFixtures = [...liveFixtures, ...upcomingFixtures, ...completedFixtures];

  return (
    <View style={{ backgroundColor: theme.bg }} className="flex-1">
      {/* Top API status bar */}
      <View
        style={{
          backgroundColor: isLiveApiActive ? '#065F4620' : theme.statCardBg,
          borderColor: isLiveApiActive ? '#10B98150' : theme.cardBorder,
        }}
        className="mx-4 mt-2 px-3 py-1.5 rounded-xl border flex-row justify-between items-center"
      >
        <View className="flex-row items-center space-x-1.5">
          <View
            style={{ backgroundColor: isLiveApiActive ? '#10B981' : '#F59E0B' }}
            className="w-2 h-2 rounded-full mr-1.5"
          />
          <Text style={{ color: theme.textSecondary }} className="text-[11px] font-semibold">
            {isLiveApiActive ? 'Connected to API Server' : 'Cricbuzz Live Data (Ready)'}
          </Text>
        </View>

        <TouchableOpacity
          onPress={() => setServerModalVisible(true)}
          className="flex-row items-center py-0.5 px-2 rounded-md"
          style={{ backgroundColor: theme.accent + '20' }}
        >
          <Ionicons name="settings-outline" size={12} color={theme.accent} style={{ marginRight: 3 }} />
          <Text style={{ color: theme.accent }} className="text-[11px] font-bold">
            API Config
          </Text>
        </TouchableOpacity>
      </View>

      {/* Segment Tabs (Live, Upcoming, Recent, All) */}
      <View className="flex-row mx-4 mt-2.5 bg-slate-200/70 dark:bg-slate-800/80 p-1 rounded-xl">
        {[
          { id: 'live', label: 'Live', count: liveFixtures.length, badgeColor: theme.liveBadge },
          { id: 'upcoming', label: 'Upcoming', count: upcomingFixtures.length },
          { id: 'completed', label: 'Recent', count: completedFixtures.length },
          { id: 'all', label: 'All Matches' },
        ].map((tab) => {
          const isActive = activeSubTab === tab.id;
          return (
            <TouchableOpacity
              key={tab.id}
              onPress={() => setActiveSubTab(tab.id)}
              style={{
                backgroundColor: isActive ? theme.card : 'transparent',
              }}
              className="flex-1 py-1.5 rounded-lg items-center flex-row justify-center"
            >
              <Text
                style={{
                  color: isActive ? theme.text : theme.textMuted,
                  fontWeight: isActive ? 'bold' : 'normal',
                }}
                className="text-xs"
              >
                {tab.label}
              </Text>
              {tab.count !== undefined && tab.count > 0 && (
                <View
                  style={{
                    backgroundColor: tab.badgeColor || theme.inputBg,
                  }}
                  className="ml-1 px-1.5 py-0.2 rounded-full"
                >
                  <Text
                    style={{ color: tab.badgeColor ? '#FFFFFF' : theme.textMuted }}
                    className="text-[9px] font-black"
                  >
                    {tab.count}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Main Content Area */}
      {loading ? (
        <ScrollView className="flex-1 px-4 mt-3" showsVerticalScrollIndicator={false}>
          {/* Cricbuzz Green Spinner with Status */}
          <View className="flex-row justify-center items-center py-3">
            <ActivityIndicator size="small" color={theme.accent} style={{ marginRight: 8 }} />
            <Text style={{ color: theme.accent }} className="text-xs font-bold tracking-wide">
              FETCHING CRICBUZZ MATCHES...
            </Text>
          </View>

          {/* Shimmer Skeleton Cards */}
          <FeaturedCarouselSkeleton />
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
          {/* Featured Live Match Carousel when on Live or All tab */}
          {(activeSubTab === 'live' || activeSubTab === 'all') && liveFixtures.length > 0 && (
            <View className="mb-4">
              <View className="flex-row justify-between items-center mb-2">
                <Text style={{ color: theme.text }} className="font-extrabold text-sm tracking-wide">
                  FEATURED MATCHES
                </Text>
                <View className="flex-row items-center">
                  <View
                    style={{ backgroundColor: theme.liveBadge }}
                    className="w-2 h-2 rounded-full mr-1 animate-pulse"
                  />
                  <Text style={{ color: theme.liveBadge }} className="text-xs font-bold uppercase">
                    Live Now
                  </Text>
                </View>
              </View>

              <ScrollView horizontal showsHorizontalScrollIndicator={false} className="space-x-3 -mx-1 px-1">
                {liveFixtures.map((item) => (
                  <TouchableOpacity
                    key={item.fixtureId}
                    onPress={() => openFixtureDetail(item)}
                    activeOpacity={0.88}
                    style={{
                      width: width * 0.82,
                      backgroundColor: theme.card,
                      borderColor: theme.accent,
                    }}
                    className="p-4 rounded-2xl border mr-3 shadow-md"
                  >
                    <View className="flex-row justify-between items-center pb-2 border-b" style={{ borderColor: theme.divider }}>
                      <Text style={{ color: theme.textSecondary }} className="text-[11px] font-semibold flex-1 mr-2" numberOfLines={1}>
                        {item.title}
                      </Text>
                      <View
                        style={{ backgroundColor: theme.liveBadgeBg }}
                        className="px-2 py-0.5 rounded-full flex-row items-center"
                      >
                        <View style={{ backgroundColor: theme.liveBadge }} className="w-1.5 h-1.5 rounded-full mr-1" />
                        <Text style={{ color: theme.liveBadge }} className="text-[10px] font-black uppercase">
                          Live
                        </Text>
                      </View>
                    </View>

                    {/* Scores */}
                    <View className="py-2.5 space-y-2">
                      <View className="flex-row justify-between items-center">
                        <View className="flex-row items-center space-x-1.5">
                          <Text className="text-base mr-1">{item.team1?.flag}</Text>
                          <Text style={{ color: theme.text }} className="font-bold text-sm">
                            {item.team1?.name}
                          </Text>
                        </View>
                        <Text style={{ color: theme.text }} className="font-black text-sm">
                          {item.team1?.score}{' '}
                          <Text style={{ color: theme.textMuted }} className="text-xs font-normal">
                            ({item.team1?.overs} ov)
                          </Text>
                        </Text>
                      </View>

                      <View className="flex-row justify-between items-center">
                        <View className="flex-row items-center space-x-1.5">
                          <Text className="text-base mr-1">{item.team2?.flag}</Text>
                          <Text style={{ color: theme.text }} className="font-bold text-sm">
                            {item.team2?.name}
                          </Text>
                        </View>
                        <Text style={{ color: theme.text }} className="font-black text-sm">
                          {item.team2?.score}{' '}
                          <Text style={{ color: theme.textMuted }} className="text-xs font-normal">
                            ({item.team2?.overs} ov)
                          </Text>
                        </Text>
                      </View>
                    </View>

                    {/* Equation & CTA */}
                    <View className="pt-2 border-t flex-row justify-between items-center" style={{ borderColor: theme.divider }}>
                      <Text style={{ color: theme.accent }} className="text-xs font-bold flex-1 mr-2" numberOfLines={1}>
                        {item.statusNote}
                      </Text>
                      <View
                        style={{ backgroundColor: theme.accentLight }}
                        className="px-2 py-1 rounded-md flex-row items-center"
                      >
                        <Text style={{ color: theme.accent }} className="text-[11px] font-extrabold">
                          Scorecard
                        </Text>
                        <Ionicons name="chevron-forward" size={12} color={theme.accent} />
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}

          {/* Matches List Header */}
          <Text style={{ color: theme.text }} className="font-extrabold text-sm tracking-wide mb-2">
            {activeSubTab === 'live'
              ? 'ALL LIVE MATCHES'
              : activeSubTab === 'upcoming'
              ? 'UPCOMING FIXTURES'
              : activeSubTab === 'completed'
              ? 'RECENT RESULTS'
              : 'CRICKET FIXTURES'}
          </Text>

          {/* Empty State View if no matches */}
          {displayedFixtures.length === 0 ? (
            <EmptyStateView
              type={activeSubTab}
              onRefresh={onRefresh}
              onAction={() => {
                if (activeSubTab === 'live') setActiveSubTab('upcoming');
                else if (activeSubTab === 'upcoming') setActiveSubTab('completed');
                else setActiveSubTab('live');
              }}
              actionLabel={
                activeSubTab === 'live'
                  ? 'Check Upcoming'
                  : activeSubTab === 'upcoming'
                  ? 'Check Recent'
                  : 'Check Live Matches'
              }
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
                  className="p-4 rounded-2xl border shadow-sm mb-3"
                >
                  {/* Card top banner */}
                  <View className="flex-row justify-between items-center pb-2 border-b" style={{ borderColor: theme.divider }}>
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
                      className="px-2 py-0.5 rounded-full flex-row items-center"
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
                        className="text-[10px] font-black uppercase"
                      >
                        {match.status}
                      </Text>
                    </View>
                  </View>

                  {/* Teams & Scores */}
                  <View className="py-2.5 space-y-2">
                    <View className="flex-row justify-between items-center">
                      <View className="flex-row items-center space-x-2">
                        <Text className="text-base mr-1.5">{match.team1?.flag || '🏏'}</Text>
                        <Text style={{ color: theme.text }} className="font-extrabold text-sm">
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
                      <View className="flex-row items-center space-x-2">
                        <Text className="text-base mr-1.5">{match.team2?.flag || '🏏'}</Text>
                        <Text style={{ color: theme.text }} className="font-extrabold text-sm">
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
                  <View className="pt-2 border-t flex-row justify-between items-center" style={{ borderColor: theme.divider }}>
                    <Text
                      style={{
                        color:
                          match.status === 'Live'
                            ? theme.liveBadge
                            : match.status === 'Completed'
                            ? theme.accent
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

      {/* Server Config Modal */}
      <ServerConfigModal
        visible={serverModalVisible}
        onClose={() => setServerModalVisible(false)}
        onServerUpdated={fetchAllData}
      />
    </View>
  );
}
