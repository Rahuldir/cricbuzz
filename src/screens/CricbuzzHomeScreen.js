import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  Dimensions,
  Image,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import {
  getInProgressFixtures,
  getUpcomingFixtures,
  getCompletedFixtures,
  getCricketNews,
  getCricketVideos,
} from '../services/cricketApi';
import MatchCenterModal from '../components/MatchCenterModal';
import VideoPlayerModal from '../components/VideoPlayerModal';
import ArticleWebViewModal from '../components/ArticleWebViewModal';
import { TeamFlag } from '../utils/flagHelper';

const { width } = Dimensions.get('window');

export default function CricbuzzHomeScreen({ onNavigateToTab }) {
  const { theme } = useTheme();

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [matches, setMatches] = useState([]);
  const [activeChip, setActiveChip] = useState('All');
  const [selectedFixture, setSelectedFixture] = useState(null);
  const [matchCenterVisible, setMatchCenterVisible] = useState(false);
  const [playingVideo, setPlayingVideo] = useState(null);
  const [playerVisible, setPlayerVisible] = useState(false);
  const [featuredVideos, setFeaturedVideos] = useState([]);
  const [topStories, setTopStories] = useState([]);
  const [selectedStory, setSelectedStory] = useState(null);
  const [storyModalVisible, setStoryModalVisible] = useState(false);

  const fetchMatches = useCallback(async (isSilent = false) => {
    if (!isSilent) setLoading(true);
    try {
      const [liveRes, upRes, compRes, newsRes, vidRes] = await Promise.all([
        getInProgressFixtures(10),
        getUpcomingFixtures(15),
        getCompletedFixtures(10),
        getCricketNews(),
        getCricketVideos(),
      ]);

      const liveFixtures = liveRes.fixtures || [];
      const upcomingFixtures = (upRes.fixtures || []).sort((a, b) => {
        const timeA = a.kickoffTimestamp || (a.kickoff_utc ? new Date(a.kickoff_utc).getTime() : 0);
        const timeB = b.kickoffTimestamp || (b.kickoff_utc ? new Date(b.kickoff_utc).getTime() : 0);
        return timeA - timeB; // Earliest upcoming match first
      });
      const completedFixtures = compRes.fixtures || [];

      // Priority Order: LIVE matches first, UPCOMING matches by time, then COMPLETED matches
      const combinedMatches = [
        ...liveFixtures,
        ...upcomingFixtures,
        ...completedFixtures,
      ];

      setMatches(combinedMatches);
      setTopStories(newsRes.news || []);
      setFeaturedVideos(vidRes.videos || []);
    } catch (err) {
      console.warn('Matches fetch error:', err);
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

  const openVideo = (video) => {
    setPlayingVideo(video);
    setPlayerVisible(true);
  };

  const chips = [
    { id: 'India - Men', label: 'India - Men', icon: 'people' },
    { id: 'India - Women', label: 'India - Women', icon: 'people' },
    { id: 'IPL 2026', label: 'IPL 2026', icon: 'trophy' },
    { id: 'World Cup', label: 'World Cup', icon: 'globe' },
  ];

  return (
    <View style={{ backgroundColor: theme.bg }} className="flex-1">
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.accent}
            colors={[theme.accent, '#009270']}
          />
        }
      >
        {/* 1. TOP MATCH CARDS HORIZONTAL CAROUSEL (EXACT CRICBUZZ LAYOUT) */}
        <View className="pt-3 pb-2">
          {loading ? (
            <View className="py-8 items-center justify-center">
              <ActivityIndicator size="small" color={theme.accent} />
              <Text style={{ color: theme.accent }} className="text-xs font-bold mt-2">
                LOADING LIVE SCORES...
              </Text>
            </View>
          ) : (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              className="px-4"
              contentContainerStyle={{ paddingRight: 16 }}
            >
              {matches.map((item) => (
                <View
                  key={item.fixtureId || item.id}
                  style={{
                    width: width * 0.86,
                    backgroundColor: theme.card,
                    borderColor: theme.cardBorder,
                    marginRight: 14,
                  }}
                  className="rounded-2xl border shadow-sm overflow-hidden"
                >
                  <TouchableOpacity
                    onPress={() => openFixtureDetail(item)}
                    activeOpacity={0.88}
                    className="p-4"
                  >
                    {/* Top Row: Series Title & Format Badge */}
                    <View className="flex-row justify-between items-center mb-3">
                      <Text
                        style={{ color: theme.textSecondary }}
                        className="text-xs font-semibold flex-1 mr-2"
                        numberOfLines={1}
                      >
                        {item.title || item.series || 'Match'}
                      </Text>
                      <View className="bg-slate-800 dark:bg-slate-700 px-2 py-0.5 rounded flex-row items-center">
                        {item.status === 'Live' && (
                          <View className="w-1.5 h-1.5 rounded-full bg-red-500 mr-1 animate-pulse" />
                        )}
                        <Text className="text-white text-[10px] font-black uppercase">
                          {item.status === 'Live' ? 'LIVE' : (item.format || 'T20I')}
                        </Text>
                      </View>
                    </View>

                    {/* Team 1 Row */}
                    <View className="flex-row justify-between items-center mb-2">
                      <View className="flex-row items-center flex-1 mr-2">
                        <TeamFlag
                          logo={item.team1?.logo}
                          teamName={item.team1?.name}
                          countryCode={item.team1?.shortName}
                          size={24}
                          style={{ marginRight: 8 }}
                        />
                        <Text
                          style={{ color: theme.text }}
                          className="font-black text-sm tracking-tight flex-1"
                          numberOfLines={1}
                        >
                          {item.team1?.shortName || item.team1?.name}
                        </Text>
                      </View>
                      <Text style={{ color: theme.text }} className="font-bold text-sm">
                        {item.team1?.score || '0'} {item.team1?.overs && item.team1.overs !== '-' ? `(${item.team1.overs})` : ''}
                      </Text>
                    </View>

                    {/* Team 2 Row */}
                    <View className="flex-row justify-between items-center mb-3">
                      <View className="flex-row items-center flex-1 mr-2">
                        <TeamFlag
                          logo={item.team2?.logo}
                          teamName={item.team2?.name}
                          countryCode={item.team2?.shortName}
                          size={24}
                          style={{ marginRight: 8 }}
                        />
                        <Text
                          style={{ color: theme.text }}
                          className="font-black text-sm tracking-tight flex-1"
                          numberOfLines={1}
                        >
                          {item.team2?.shortName || item.team2?.name}
                        </Text>
                      </View>
                      <Text style={{ color: theme.text }} className="font-bold text-sm">
                        {item.team2?.score || '0'} {item.team2?.overs && item.team2.overs !== '-' ? `(${item.team2.overs})` : ''}
                      </Text>
                    </View>

                    {/* Result / Equation in Cricbuzz Blue */}
                    <Text
                      style={{ color: item.status === 'Live' ? '#EF4444' : '#2563EB' }}
                      className="text-xs font-bold leading-tight"
                      numberOfLines={1}
                    >
                      {item.statusNote || `${item.team1?.name} vs ${item.team2?.name}`}
                    </Text>
                  </TouchableOpacity>

                  {/* Card Bottom Strip with POINTS TABLE & SCHEDULE */}
                  <View
                    style={{
                      backgroundColor: theme.cardSecondary,
                      borderTopColor: theme.cardBorderSubtle,
                    }}
                    className="border-t px-4 py-2 flex-row justify-end items-center space-x-4"
                  >
                    <TouchableOpacity
                      onPress={() => onNavigateToTab && onNavigateToTab('series', 'table')}
                      className="px-2 py-0.5"
                    >
                      <Text className="text-slate-600 dark:text-slate-300 font-extrabold text-[10px] tracking-wider uppercase">
                        POINTS TABLE
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => onNavigateToTab && onNavigateToTab('series', 'schedule')}
                      className="px-2 py-0.5"
                    >
                      <Text className="text-slate-600 dark:text-slate-300 font-extrabold text-[10px] tracking-wider uppercase">
                        SCHEDULE
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </ScrollView>
          )}
        </View>

        {/* 2. CATEGORY PILL CHIPS */}
        <View className="px-4 py-2">
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="space-x-2.5"
          >
            {chips.map((chip) => {
              const isSelected = activeChip === chip.id;
              return (
                <TouchableOpacity
                  key={chip.id}
                  onPress={() => setActiveChip(chip.id)}
                  style={{
                    backgroundColor: isSelected ? theme.accent : theme.card,
                    borderColor: isSelected ? theme.accent : theme.cardBorder,
                  }}
                  className="flex-row items-center px-4 py-2 rounded-2xl border shadow-2xs mr-2"
                  activeOpacity={0.75}
                >
                  <Ionicons
                    name={chip.icon}
                    size={14}
                    color={isSelected ? '#FFFFFF' : theme.textSecondary}
                    style={{ marginRight: 6 }}
                  />
                  <Text
                    style={{
                      color: isSelected ? '#FFFFFF' : theme.text,
                      fontWeight: isSelected ? '800' : '600',
                    }}
                    className="text-xs"
                  >
                    {chip.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* 3. FEATURED VIDEOS SECTION */}
        {featuredVideos.length > 0 && (
          <View className="px-4 mt-4">
            <View className="flex-row justify-between items-center mb-3">
              <Text style={{ color: theme.text }} className="font-extrabold text-base tracking-tight">
                Featured Videos
              </Text>
              <TouchableOpacity
                onPress={() => onNavigateToTab && onNavigateToTab('videos')}
                className="py-1"
              >
                <Text style={{ color: '#2563EB' }} className="font-bold text-xs">
                  View All
                </Text>
              </TouchableOpacity>
            </View>

            {/* Large Video Card */}
            <TouchableOpacity
              onPress={() => openVideo(featuredVideos[0])}
              style={{
                backgroundColor: theme.card,
                borderColor: theme.cardBorder,
              }}
              className="rounded-2xl border shadow-sm overflow-hidden mb-4"
              activeOpacity={0.88}
            >
              <View style={{ width: '100%', height: 192, backgroundColor: '#0F172A', position: 'relative', overflow: 'hidden' }}>
                <Image
                  source={{ uri: featuredVideos[0].imageUrl }}
                  style={StyleSheet.absoluteFillObject}
                  resizeMode="cover"
                />
                <View style={[StyleSheet.absoluteFillObject, { backgroundColor: 'rgba(0,0,0,0.4)' }]} />

                {/* Tag text inside thumbnail */}
                <View className="absolute top-3 left-3 bg-red-600 px-2.5 py-0.5 rounded z-10">
                  <Text className="text-white font-black text-[10px] uppercase">
                    {featuredVideos[0].tag}
                  </Text>
                </View>

                {/* Play Button Overlay centered */}
                <View
                  style={[StyleSheet.absoluteFillObject, { justifyContent: 'center', alignItems: 'center' }]}
                  pointerEvents="none"
                >
                  <View className="w-14 h-14 rounded-full bg-black/60 border-2 border-white items-center justify-center shadow-lg">
                    <Ionicons name="play" size={26} color="#FFFFFF" style={{ marginLeft: 3 }} />
                  </View>
                </View>

                {/* Duration Badge */}
                <View className="absolute bottom-2.5 right-2.5 bg-black/85 px-2 py-0.5 rounded z-10">
                  <Text className="text-white font-extrabold text-xs">
                    {featuredVideos[0].duration}
                  </Text>
                </View>
              </View>

              <View className="p-3.5">
                <Text
                  style={{ color: theme.text }}
                  className="font-extrabold text-sm leading-snug"
                  numberOfLines={2}
                >
                  {featuredVideos[0].title}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        )}

        {/* 4. TOP STORIES SECTION */}
        {topStories.length > 0 && (
          <View className="px-4 mt-1 mb-8">
            <View className="flex-row justify-between items-center mb-3">
              <Text style={{ color: theme.text }} className="font-extrabold text-base tracking-tight">
                Top Stories
              </Text>
              <TouchableOpacity
                onPress={() => onNavigateToTab && onNavigateToTab('news')}
                className="py-1"
              >
                <Text style={{ color: '#2563EB' }} className="font-bold text-xs">
                  More News
                </Text>
              </TouchableOpacity>
            </View>

            {topStories.map((story) => (
              <TouchableOpacity
                key={story.id}
                onPress={() => {
                  if (story.link) {
                    setSelectedStory(story);
                    setStoryModalVisible(true);
                  } else if (onNavigateToTab) {
                    onNavigateToTab('news');
                  }
                }}
                style={{
                  backgroundColor: theme.card,
                  borderColor: theme.cardBorder,
                }}
                className="p-3.5 rounded-2xl border shadow-2xs mb-3 flex-row items-center justify-between"
                activeOpacity={0.85}
              >
                <View className="flex-1 mr-3">
                  <Text
                    style={{ color: theme.text }}
                    className="font-bold text-xs leading-snug mb-1.5"
                    numberOfLines={2}
                  >
                    {story.headline || story.title}
                  </Text>
                  <Text style={{ color: theme.textMuted }} className="text-[10px]">
                    {story.timeAgo} • {story.category || 'Live API'}
                  </Text>
                </View>
                <Image
                  source={{ uri: story.imageUrl }}
                  className="w-16 h-16 rounded-xl bg-slate-700"
                  resizeMode="cover"
                />
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Match Center Modal */}
      <MatchCenterModal
        visible={matchCenterVisible}
        fixture={selectedFixture}
        onClose={() => setMatchCenterVisible(false)}
      />

      {/* Video Player Modal */}
      <VideoPlayerModal
        visible={playerVisible}
        video={playingVideo}
        onClose={() => setPlayerVisible(false)}
      />

      {/* Article In-App WebView Modal */}
      <ArticleWebViewModal
        visible={storyModalVisible}
        article={selectedStory}
        onClose={() => {
          setStoryModalVisible(false);
          setSelectedStory(null);
        }}
      />
    </View>
  );
}
