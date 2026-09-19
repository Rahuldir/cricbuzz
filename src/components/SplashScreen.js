import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  Image,
  Animated,
  StyleSheet,
  Dimensions,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

export default function SplashScreen({ onFinish, isPreview = false, onClose }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    // Entrance animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 7,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();

    // Auto transition directly to next screen after splash display
    let timer;
    if (onFinish) {
      timer = setTimeout(() => {
        if (onClose) onClose();
        if (onFinish) onFinish();
      }, 2500);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, []);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right', 'bottom']}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Center Main Content Container (Image 3 exact match) */}
      <Animated.View
        style={[
          styles.centerContainer,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        {/* App Logo Icon */}
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
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginTop: 20,
  },
  logoShadowBox: {
    width: 160,
    height: 160,
    borderRadius: 36,
    overflow: 'hidden',
    marginBottom: 24,
  },
  logoImage: {
    width: '100%',
    height: '100%',
    borderRadius: 36,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  titleLiveCricket: {
    fontSize: 27,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: -0.5,
  },
  tvHdContainer: {
    alignItems: 'center',
  },
  titleTvHd: {
    fontSize: 27,
    fontWeight: '900',
    color: '#15803D',
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
  },
  bottomArtContainer: {
    width: width,
    height: 200,
    overflow: 'hidden',
    justifyContent: 'flex-end',
    backgroundColor: '#FFFFFF',
  },
  bottomArtImage: {
    width: '100%',
    height: '100%',
  },
});
