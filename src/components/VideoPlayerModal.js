import React from 'react';
import { Modal, View, Text, TouchableOpacity, ActivityIndicator, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useVideoPlayer, VideoView } from 'expo-video';
import { useEvent } from 'expo';
import { useTheme } from '../context/ThemeContext';

const { width } = Dimensions.get('window');
const videoHeight = (width * 9) / 16;

export default function VideoPlayerModal({ visible, video, onClose }) {
  const { theme } = useTheme();

  const player = useVideoPlayer(video?.videoUrl || null, (p) => {
    p.loop = false;
  });

  const { isPlaying } = useEvent(player, 'playingChange', { isPlaying: player?.playing ?? false });
  const { status } = useEvent(player, 'statusChange', { status: player?.status ?? 'idle' });

  React.useEffect(() => {
    if (visible && player) {
      player.play();
    }
    if (!visible && player) {
      player.pause();
    }
  }, [visible, player]);

  const togglePlayPause = () => {
    if (!player) return;
    if (isPlaying) {
      player.pause();
    } else {
      player.play();
    }
  };

  const handleClose = () => {
    if (player) player.pause();
    onClose && onClose();
  };

  if (!video) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={handleClose}
    >
      <View style={{ flex: 1, backgroundColor: '#000000' }}>
        {/* Video Surface */}
        <View style={{ width: '100%', height: videoHeight, backgroundColor: '#000' }}>
          <VideoView
            player={player}
            style={{ width: '100%', height: '100%' }}
            nativeControls={false}
            contentFit="contain"
          />

          {/* Loading spinner while buffering */}
          {status === 'loading' && (
            <View className="absolute inset-0 items-center justify-center">
              <ActivityIndicator size="large" color="#FFFFFF" />
            </View>
          )}

          {/* Tap area with custom Play/Pause button */}
          <TouchableOpacity
            onPress={togglePlayPause}
            activeOpacity={0.8}
            className="absolute inset-0 items-center justify-center"
          >
            {status !== 'loading' && (
              <View className="w-16 h-16 rounded-full bg-black/55 border-2 border-white/85 items-center justify-center">
                <Ionicons
                  name={isPlaying ? 'pause' : 'play'}
                  size={30}
                  color="#FFFFFF"
                  style={{ marginLeft: isPlaying ? 0 : 3 }}
                />
              </View>
            )}
          </TouchableOpacity>

          {/* Close Button */}
          <TouchableOpacity
            onPress={handleClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/60 items-center justify-center"
            activeOpacity={0.8}
          >
            <Ionicons name="close" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Video Info */}
        <View style={{ backgroundColor: theme.card }} className="flex-1 px-4 pt-4">
          <Text style={{ color: theme.text }} className="font-extrabold text-base leading-snug mb-2">
            {video.title}
          </Text>
          <View className="flex-row items-center">
            {video.views && (
              <Text style={{ color: theme.textMuted }} className="text-xs mr-2">
                {video.views}
              </Text>
            )}
            {video.timeAgo && (
              <Text style={{ color: theme.textMuted }} className="text-xs">
                • {video.timeAgo}
              </Text>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
}
