import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  Image,
  Animated,
  StyleSheet,
  Dimensions,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

export default function SplashScreen({ onFinish, isPreview = false, onClose }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.85)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const [progressText, setProgressText] = useState('0%');

  useEffect(() => {
    // Entrance animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 700,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 6,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.timing(progressAnim, {
        toValue: 1,
        duration: 2400,
        useNativeDriver: false,
      }),
    ]).start();

    // Listener for progress percentage display
    const listenerId = progressAnim.addListener(({ value }) => {
      const percentage = Math.min(Math.round(value * 100), 100);
      setProgressText(`${percentage}%`);
    });

    // Auto finish after timer (unless in preview close mode)
    let timer;
    if (!isPreview && onFinish) {
      timer = setTimeout(() => {
        // Exit animation
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }).start(() => {
          onFinish();
        });
      }, 2700);
    }

    return () => {
      progressAnim.removeListener(listenerId);
      if (timer) clearTimeout(timer);
    };
  }, []);

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right', 'bottom']}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Close button for preview mode */}
      {isPreview && (
        <TouchableOpacity style={styles.closeButton} onPress={onClose} activeOpacity={0.7}>
          <Ionicons name="close" size={24} color="#1E293B" />
        </TouchableOpacity>
      )}

      {/* Center Main Content Container */}
      <Animated.View
        style={[
          styles.centerContainer,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        {/* App Logo Icon with Shadow */}
        <View style={styles.logoShadowBox}>
          <Image
            source={require('../../assets/splash_logo.jpg')}
            style={styles.logoImage}
            resizeMode="cover"
          />
        </View>

        {/* Title: Live Cricket TV HD */}
        <View style={styles.titleRow}>
          <Text style={styles.titleLiveCricket}>Live Cricket </Text>
          <View style={styles.tvHdContainer}>
            <Text style={styles.titleTvHd}>TV HD</Text>
            {/* Green Underline Bar matching image reference */}
            <View style={styles.greenUnderline} />
          </View>
        </View>

        {/* Subtitle */}
        <Text style={styles.subtitle}>Get live Cricket score updates in mobile</Text>

        {/* Sleek Progress Loader */}
        <View style={styles.progressContainer}>
          <View style={styles.trackBar}>
            <Animated.View style={[styles.fillBar, { width: progressWidth }]} />
          </View>
          <View style={styles.statusRow}>
            <Text style={styles.statusText}>Connecting live servers...</Text>
            <Text style={styles.percentageText}>{progressText}</Text>
          </View>
        </View>
      </Animated.View>

      {/* Bottom Cricket Players Illustration */}
      <View style={styles.bottomArtContainer}>
        <Image
          source={require('../../assets/splash_cricket_players.jpg')}
          style={styles.bottomArtImage}
          resizeMode="cover"
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 10,
    backgroundColor: '#F1F5F9',
    padding: 8,
    borderRadius: 20,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginTop: 40,
  },
  logoShadowBox: {
    width: 140,
    height: 140,
    borderRadius: 32,
    backgroundColor: '#FFFFFF',
    marginBottom: 26,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
    elevation: 10,
  },
  logoImage: {
    width: '100%',
    height: '100%',
    borderRadius: 32,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  titleLiveCricket: {
    fontSize: 26,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: -0.5,
  },
  tvHdContainer: {
    alignItems: 'center',
  },
  titleTvHd: {
    fontSize: 26,
    fontWeight: '900',
    color: '#15803D', // Match vivid green from screenshot
    letterSpacing: -0.5,
  },
  greenUnderline: {
    width: '100%',
    height: 3.5,
    backgroundColor: '#15803D',
    borderRadius: 2,
    marginTop: 2,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 32,
  },
  progressContainer: {
    width: width * 0.75,
    alignItems: 'center',
  },
  trackBar: {
    width: '100%',
    height: 6,
    backgroundColor: '#E2E8F0',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 8,
  },
  fillBar: {
    height: '100%',
    backgroundColor: '#15803D',
    borderRadius: 3,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  statusText: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '600',
  },
  percentageText: {
    fontSize: 11,
    color: '#15803D',
    fontWeight: '800',
  },
  bottomArtContainer: {
    width: width,
    height: 190,
    overflow: 'hidden',
    justifyContent: 'flex-end',
    backgroundColor: '#FFFFFF',
  },
  bottomArtImage: {
    width: '100%',
    height: '100%',
  },
});
