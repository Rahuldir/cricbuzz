import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  RefreshControl,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import VideoPlayerModal from '../components/VideoPlayerModal';

const { width } = Dimensions.get('window');

const SAMPLE_BASE = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/';

const CRICKET_VIDEOS = [
  {
    id: 'vid-1',
    title: 'No debate around Rohit & Kohli; selection is a must: Mohit',
    category: 'Match Analysis',
    duration: '7:06',
    views: '245K views',
    timeAgo: '2 hours ago',
    imageUrl: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=800&q=80',
    tag: 'RO-KO STILL TOO GOOD?',
    videoUrl: `${SAMPLE_BASE}ForBiggerJoyrides.mp4`,
  },
  {
    id: 'vid-2',
    title: 'How Dhoni finished it in style: The iconic 2011 World Cup retrospective',
    category: 'Classics',
    duration: '11:42',
    views: '1.2M views',
    timeAgo: '5 hours ago',
    imageUrl: 'https://images.unsplash.com/photo-1531415074868-036b107e775a?w=800&q=80',
    tag: 'ICONIC FINISH',
    videoUrl: `${SAMPLE_BASE}ForBiggerFun.mp4`,
  },
  {
    id: 'vid-3',
    title: 'IPL 2024 Playoffs Scenario: Can RCB still make the top 4?',
    category: 'IPL 2024',
    duration: '5:18',
    views: '412K views',
    timeAgo: '1 day ago',
    imageUrl: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800&q=80',
    tag: 'PLAYOFF MATHS',
    videoUrl: `${SAMPLE_BASE}ForBiggerBlazes.mp4`,
  },
  {
    id: 'vid-4',
    title: 'Jasprit Bumrah\'s lethal yorkers: Masterclass bowling analysis',
    category: 'Masterclass',
    duration: '8:35',
    views: '580K views',
    timeAgo: '2 days ago',
    imageUrl: 'https://images.unsplash.com/photo-1587280501635-68a0e82cd5ff?w=800&q=80',
    tag: 'BOWLING GENIUS',
    videoUrl: `${SAMPLE_BASE}ForBiggerEscapes.mp4`,
  },
  {
    id: 'vid-5',
    title: 'Hardik Pandya press conference: "We take full accountability for today"',
    category: 'Press Conference',
    duration: '4:15',
    views: '180K views',
    timeAgo: '2 days ago',
    imageUrl: 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?w=800&q=80',
    tag: 'RAW EMOTION',
    videoUrl: `${SAMPLE_BASE}ForBiggerMeltdowns.mp4`,
  },
];

export default function VideosScreen() {
  const { theme } = useTheme();
  const [refreshing, setRefreshing] = useState(false);
  const [activeCategory, setActiveCategory] = useState('All');
  const [playingVideo, setPlayingVideo] = useState(null);
  const [playerVisible, setPlayerVisible] = useState(false);

  const categories = ['All', 'Match Analysis', 'IPL 2024', 'Interviews', 'Classics'];

  const filteredVideos = activeCategory === 'All'
    ? CRICKET_VIDEOS
    : CRICKET_VIDEOS.filter((v) => v.category === activeCategory);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 800);
  };

  const openVideo = (video) => {
    setPlayingVideo(video);
    setPlayerVisible(true);
  };

  const closeVideo = () => {
    setPlayerVisible(false);
  };

  return (
    <View style={{ backgroundColor: theme.bg }} className="flex-1">
      {/* Category Pills */}
      <View className="py-2.5 px-4 bg-slate-100 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="space-x-2">
          {categories.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <TouchableOpacity
                key={cat}
                onPress={() => setActiveCategory(cat)}
                style={{
                  backgroundColor: isActive ? theme.accent : theme.card,
                  borderColor: isActive ? theme.accent : theme.cardBorder,
                }}
                className="px-3.5 py-1.5 rounded-full border mr-2"
                activeOpacity={0.7}
              >
                <Text
                  style={{
                    color: isActive ? '#FFFFFF' : theme.text,
                    fontWeight: isActive ? '800' : '600',
                  }}
                  className="text-xs"
                >
                  {cat}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      <ScrollView
        className="flex-1 px-4 pt-3"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.accent}
          />
        }
      >
        {filteredVideos.map((video) => (
          <TouchableOpacity
            key={video.id}
            onPress={() => openVideo(video)}
            style={{
              backgroundColor: theme.card,
              borderColor: theme.cardBorder,
            }}
            className="rounded-2xl border shadow-sm mb-4 overflow-hidden"
            activeOpacity={0.88}
          >
            {/* Video Thumbnail */}
            <View className="relative w-full h-48 bg-slate-800 justify-center items-center">
              <Image
                source={{ uri: video.imageUrl }}
                className="w-full h-full"
                resizeMode="cover"
              />
              {/* Dark gradient overlay */}
              <View className="absolute inset-0 bg-black/35" />

              {/* Tag in top left */}
              <View className="absolute top-3 left-3 bg-red-600 px-2.5 py-0.5 rounded">
                <Text className="text-white font-black text-[10px] tracking-wider uppercase">
                  {video.tag}
                </Text>
              </View>

              {/* Play Button Overlay */}
              <View className="w-14 h-14 rounded-full bg-black/60 border-2 border-white/80 items-center justify-center shadow-lg">
                <Ionicons name="play" size={26} color="#FFFFFF" style={{ marginLeft: 3 }} />
              </View>

              {/* Duration Badge bottom right */}
              <View className="absolute bottom-2.5 right-2.5 bg-black/80 px-2 py-0.5 rounded">
                <Text className="text-white font-black text-xs">
                  {video.duration}
                </Text>
              </View>
            </View>

            {/* Video Info */}
            <View className="p-3.5">
              <Text
                style={{ color: theme.text }}
                className="font-extrabold text-sm leading-snug mb-1.5"
                numberOfLines={2}
              >
                {video.title}
              </Text>
              <View className="flex-row items-center justify-between">
                <Text style={{ color: theme.textMuted }} className="text-xs">
                  {video.views} • {video.timeAgo}
                </Text>
                <View className="flex-row items-center">
                  <Ionicons name="share-social-outline" size={16} color={theme.textMuted} />
                </View>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <VideoPlayerModal
        visible={playerVisible}
        video={playingVideo}
        onClose={closeVideo}
      />
    </View>
  );
}
