import React from 'react';
import { Modal, View, Text, TouchableOpacity, ActivityIndicator, Dimensions, StyleSheet } from 'react-native';
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
            <View
              style={[StyleSheet.absoluteFillObject, { justifyContent: 'center', alignItems: 'center' }]}
              pointerEvents="none"
            >
              <ActivityIndicator size="large" color="#FFFFFF" />
            </View>
          )}

          {/* Tap area with custom Play/Pause button centered */}
          <TouchableOpacity
            onPress={togglePlayPause}
            activeOpacity={0.85}
            style={[
              StyleSheet.absoluteFillObject,
              { justifyContent: 'center', alignItems: 'center' },
            ]}
          >
            {status !== 'loading' && (
              <View
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: 32,
                  backgroundColor: 'rgba(0,0,0,0.65)',
                  borderWidth: 2,
                  borderColor: 'rgba(255,255,255,0.9)',
                  alignItems: 'center',
                  justifyContent: 'center',
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.5,
                  shadowRadius: 4,
                  elevation: 5,
                }}
              >
                <Ionicons
                  name={isPlaying ? 'pause' : 'play'}
                  size={32}
                  color="#FFFFFF"
                  style={{ marginLeft: isPlaying ? 0 : 3 }}
                />
              </View>
            )}
          </TouchableOpacity>

          {/* Close Button */}
          <TouchableOpacity
            onPress={handleClose}
            style={{
              position: 'absolute',
              top: 16,
              right: 16,
              width: 36,
              height: 36,
              borderRadius: 18,
              backgroundColor: 'rgba(0,0,0,0.65)',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 30,
            }}
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
