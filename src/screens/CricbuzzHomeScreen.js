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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import {
  getInProgressFixtures,
  getUpcomingFixtures,
  getCompletedFixtures,
} from '../services/cricketApi';
import MatchCenterModal from '../components/MatchCenterModal';
import VideoPlayerModal from '../components/VideoPlayerModal';
import { TeamFlag } from '../utils/flagHelper';

const { width } = Dimensions.get('window');

const SAMPLE_BASE = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/';

const FEATURED_VIDEOS_DATA = [
  {
    id: 'roko-1',
    title: 'No debate around Rohit & Kohli; selection is a must: Mohit',
    duration: '7:06',
    tag: 'RO-KO STILL TOO GOOD?',
    imageUrl: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=800&q=80',
    videoUrl: `${SAMPLE_BASE}ForBiggerJoyrides.mp4`,
  },
  {
    id: 'ipl-analysis-2',
    title: 'How KKR dismantled opponents with aggressive opening burst',
    duration: '5:48',
    tag: 'IPL MASTERCLASS',
    imageUrl: 'https://images.unsplash.com/photo-1531415074868-036b107e775a?w=800&q=80',
    videoUrl: `${SAMPLE_BASE}ForBiggerFun.mp4`,
  },
  {
    id: 'dhoni-classic-3',
    title: 'Behind the stumps: The tactical genius of MS Dhoni',
    duration: '10:14',
    tag: 'CRICBUZZ RETRO',
    imageUrl: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800&q=80',
    videoUrl: `${SAMPLE_BASE}ForBiggerBlazes.mp4`,
  },
];

const TOP_STORIES_DATA = [
  {
    id: 'story-1',
    title: 'Team India announces preliminary squad for ICC T20 World Cup',
    timeAgo: '1h ago',
    source: 'Cricbuzz Staff',
    imageUrl: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=800&q=80',
  },
  {
    id: 'story-2',
    title: 'Hardik on form: "Every setback teaches you how to rise again"',
    timeAgo: '3h ago',
    source: 'Interview',
    imageUrl: 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?w=800&q=80',
  },
  {
    id: 'story-3',
    title: 'Pitch report: Expect high-scoring thriller in Ahmedabad clash',
    timeAgo: '5h ago',
    source: 'Match Preview',
    imageUrl: 'https://images.unsplash.com/photo-1587280501635-68a0e82cd5ff?w=800&q=80',
  },
];

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

  const fetchMatches = useCallback(async (isSilent = false) => {
    if (!isSilent) setLoading(true);
    try {
      const [liveRes, compRes, upRes] = await Promise.all([
        getInProgressFixtures(5),
        getCompletedFixtures(10),
        getUpcomingFixtures(5),
      ]);

      const combined = [
        ...(compRes.fixtures || []),
        ...(liveRes.fixtures || []),
        ...(upRes.fixtures || []),
      ];

      // Ensure the Asian Games match from screenshot or live matches are shown
      setMatches(combined);
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
    { id: 'IPL 2024', label: 'IPL 2024', icon: 'trophy' },
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
                      <View className="bg-slate-800 dark:bg-slate-700 px-2 py-0.5 rounded">
                        <Text className="text-white text-[10px] font-black uppercase">
                          {item.format || 'T20I'}
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
                          className="font-black text-sm tracking-tight"
                        >
                          {item.team1?.shortName || item.team1?.name}
                        </Text>
                      </View>
                      <Text style={{ color: theme.text }} className="font-bold text-sm">
                        {item.team1?.score || '0'} {item.team1?.overs ? `(${item.team1.overs})` : ''}
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
                          className="font-black text-sm tracking-tight"
                        >
                          {item.team2?.shortName || item.team2?.name}
                        </Text>
                      </View>
                      <Text style={{ color: theme.text }} className="font-bold text-sm">
                        {item.team2?.score || '0'} {item.team2?.overs ? `(${item.team2.overs})` : ''}
                      </Text>
                    </View>

                    {/* Result / Equation in Cricbuzz Blue */}
                    <Text
                      style={{ color: '#2563EB' }}
                      className="text-xs font-bold leading-tight"
                      numberOfLines={1}
                    >
                      {item.statusNote || `${item.team1?.name} vs ${item.team2?.name}`}
                    </Text>
                  </TouchableOpacity>

                  {/* Card Bottom Grey Strip with POINTS TABLE & SCHEDULE */}
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

        {/* 2. CATEGORY PILL CHIPS (MATCHING SCREENSHOT) */}
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

        {/* 3. FEATURED VIDEOS SECTION (MATCHING SCREENSHOT) */}
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
            onPress={() => openVideo(FEATURED_VIDEOS_DATA[0])}
            style={{
              backgroundColor: theme.card,
              borderColor: theme.cardBorder,
            }}
            className="rounded-2xl border shadow-sm overflow-hidden mb-4"
            activeOpacity={0.88}
          >
            <View className="relative w-full h-48 bg-slate-900 justify-center items-center">
              <Image
                source={{ uri: FEATURED_VIDEOS_DATA[0].imageUrl }}
                className="w-full h-full"
                resizeMode="cover"
              />
              <View className="absolute inset-0 bg-black/40" />

              {/* Tag text inside thumbnail */}
              <View className="absolute top-3 left-3 bg-red-600 px-2.5 py-0.5 rounded">
                <Text className="text-white font-black text-[10px] uppercase">
                  {FEATURED_VIDEOS_DATA[0].tag}
                </Text>
              </View>

              {/* Play Button Overlay */}
              <View className="w-13 h-13 rounded-full bg-black/60 border-2 border-white items-center justify-center shadow-lg">
                <Ionicons name="play" size={24} color="#FFFFFF" style={{ marginLeft: 3 }} />
              </View>

              {/* Duration Badge */}
              <View className="absolute bottom-2.5 right-2.5 bg-black/85 px-2 py-0.5 rounded">
                <Text className="text-white font-extrabold text-xs">
                  {FEATURED_VIDEOS_DATA[0].duration}
                </Text>
              </View>
            </View>

            <View className="p-3.5">
              <Text
                style={{ color: theme.text }}
                className="font-extrabold text-sm leading-snug"
                numberOfLines={2}
              >
                {FEATURED_VIDEOS_DATA[0].title}
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* 4. TOP STORIES SECTION (MATCHING SCREENSHOT) */}
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

          {TOP_STORIES_DATA.map((story) => (
            <TouchableOpacity
              key={story.id}
              onPress={() => onNavigateToTab && onNavigateToTab('news')}
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
                  {story.title}
                </Text>
                <Text style={{ color: theme.textMuted }} className="text-[10px]">
                  {story.timeAgo} • {story.source}
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
    </View>
  );
}
