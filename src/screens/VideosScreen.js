import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  RefreshControl,
  ActivityIndicator,
  Dimensions,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { getCricketVideos } from '../services/cricketApi';
import VideoPlayerModal from '../components/VideoPlayerModal';
import EmptyStateView from '../components/EmptyStateView';

export default function VideosScreen() {
  const { theme } = useTheme();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [videosList, setVideosList] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [playingVideo, setPlayingVideo] = useState(null);
  const [playerVisible, setPlayerVisible] = useState(false);

  const loadVideos = useCallback(async (isSilent = false) => {
    if (!isSilent) setLoading(true);
    try {
      const res = await getCricketVideos();
      setVideosList(res.videos || []);
    } catch (err) {
      console.warn('Videos fetch err:', err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadVideos();
  }, [loadVideos]);

  const onRefresh = () => {
    setRefreshing(true);
    loadVideos();
  };

  const categories = ['All', ...new Set(videosList.map((v) => v.category).filter(Boolean))];

  const filteredVideos = activeCategory === 'All'
    ? videosList
    : videosList.filter((v) => v.category === activeCategory);

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
      {categories.length > 1 && (
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
      )}

      {loading ? (
        <View className="flex-1 items-center justify-center py-16">
          <ActivityIndicator size="large" color={theme.accent} />
          <Text style={{ color: theme.textMuted }} className="text-xs font-semibold mt-3">
            Loading Cricket Videos...
          </Text>
        </View>
      ) : (
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
          {filteredVideos.length === 0 ? (
            <EmptyStateView
              type="general"
              onRefresh={onRefresh}
              actionLabel="Reload Videos"
            />
          ) : (
            filteredVideos.map((video) => (
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
                <View style={{ width: '100%', height: 192, backgroundColor: '#1E293B', position: 'relative', overflow: 'hidden' }}>
                  <Image
                    source={{ uri: video.imageUrl }}
                    style={StyleSheet.absoluteFillObject}
                    resizeMode="cover"
                  />
                  {/* Dark gradient overlay */}
                  <View style={[StyleSheet.absoluteFillObject, { backgroundColor: 'rgba(0,0,0,0.35)' }]} />

                  {/* Tag in top left */}
                  <View className="absolute top-3 left-3 bg-red-600 px-2.5 py-0.5 rounded z-10">
                    <Text className="text-white font-black text-[10px] tracking-wider uppercase">
                      {video.tag}
                    </Text>
                  </View>

                  {/* Play Button Overlay centered */}
                  <View
                    style={[StyleSheet.absoluteFillObject, { justifyContent: 'center', alignItems: 'center' }]}
                    pointerEvents="none"
                  >
                    <View className="w-14 h-14 rounded-full bg-black/60 border-2 border-white/80 items-center justify-center shadow-lg">
                      <Ionicons name="play" size={26} color="#FFFFFF" style={{ marginLeft: 3 }} />
                    </View>
                  </View>

                  {/* Duration Badge bottom right */}
                  <View className="absolute bottom-2.5 right-2.5 bg-black/80 px-2 py-0.5 rounded z-10">
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
            ))
          )}
        </ScrollView>
      )}

      <VideoPlayerModal
        visible={playerVisible}
        video={playingVideo}
        onClose={closeVideo}
      />
    </View>
  );
}
