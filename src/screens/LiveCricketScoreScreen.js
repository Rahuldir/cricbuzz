import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  StatusBar,
  Share,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import MatchesHistoryScreen from './MatchesHistoryScreen';
import PlayoffsScreen from './PlayoffsScreen';

export default function LiveCricketScoreScreen({ onBack, onNavigateToSchedule }) {
  const [currentSubScreen, setCurrentSubScreen] = useState(null); // 'records' | 'playoffs'

  const handleShareApp = async () => {
    try {
      await Share.share({
        message:
          'Download the Live Cricket Score app for fastest live scores, IPL schedule, ball-by-ball updates, and playoffs history!',
      });
    } catch (e) {
      console.log(e);
    }
  };

  const handlePrivacyPolicy = () => {
    Alert.alert(
      'Privacy Policy',
      'Live Cricket Score respects user privacy. No personal data is stored or shared with third parties.'
    );
  };

  const handlePlayGame = () => {
    Alert.alert(
      'Cricket Trivia Game',
      'Welcome to Live Cricket Trivia Game! Test your knowledge on IPL and International cricket.'
    );
  };

  if (currentSubScreen === 'records') {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'left', 'right', 'bottom']}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
        <View style={styles.topHeaderBar}>
          <TouchableOpacity onPress={() => setCurrentSubScreen(null)} style={styles.backButton}>
            <Ionicons name="chevron-back" size={28} color="#000000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>All Records</Text>
          <View style={{ width: 36 }} />
        </View>
        <MatchesHistoryScreen onOpenNewMatch={() => {}} />
      </SafeAreaView>
    );
  }

  if (currentSubScreen === 'playoffs') {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'left', 'right', 'bottom']}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
        <View style={styles.topHeaderBar}>
          <TouchableOpacity onPress={() => setCurrentSubScreen(null)} style={styles.backButton}>
            <Ionicons name="chevron-back" size={28} color="#000000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Playoff History</Text>
          <View style={{ width: 36 }} />
        </View>
        <PlayoffsScreen />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right', 'bottom']}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* 1. Header Matching Screenshots 1, 3, 4 */}
      <View style={styles.topHeaderBar}>
        <TouchableOpacity onPress={onBack} style={styles.backButton} activeOpacity={0.7}>
          <Ionicons name="chevron-back" size={28} color="#000000" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Live Cricket Score</Text>

        {/* Top Right Circular AD Badge */}
        <View style={styles.topRightAdBadge}>
          <View style={styles.adBadgeBlueCircle}>
            <View style={styles.adRedBall} />
            <View style={styles.adSmallPill}>
              <Text style={styles.adSmallPillText}>AD</Text>
            </View>
          </View>
        </View>
      </View>

      {/* 2. Top Sub-Header AD Card */}
      <View style={styles.adBannerCard}>
        <View style={styles.adIconBox}>
          <View style={styles.adPinCircle}>
            <Ionicons name="location" size={18} color="#0284C7" />
            <View style={styles.adTagPill}>
              <Text style={styles.adTagText}>AD</Text>
            </View>
          </View>
        </View>

        <View style={styles.adTextBox}>
          <Text style={styles.adTitle} numberOfLines={1}>IPL News</Text>
          <Text style={styles.adSubtitle} numberOfLines={1}>
            Stay updated with the latest IPL news and
          </Text>
        </View>

        <TouchableOpacity style={styles.installButton} activeOpacity={0.85}>
          <Text style={styles.installButtonText}>Install</Text>
        </TouchableOpacity>
      </View>

      {/* 3. Main Scrollable Content */}
      <ScrollView
        style={styles.scrollContent}
        contentContainerStyle={styles.scrollInner}
        showsVerticalScrollIndicator={false}
      >
        {/* Card 1: All Records Button */}
        <TouchableOpacity
          onPress={() => setCurrentSubScreen('records')}
          style={styles.menuCard}
          activeOpacity={0.85}
        >
          <View style={styles.menuCardLeft}>
            <View style={styles.iconBoxYellow}>
              <Ionicons name="folder-open" size={24} color="#D97706" />
            </View>
            <Text style={styles.menuCardTitle}>All Records</Text>
          </View>

          <View style={styles.greenChevronCircle}>
            <Ionicons name="chevron-forward-sharp" size={15} color="#FFFFFF" style={{ marginLeft: -1 }} />
            <Ionicons name="chevron-forward-sharp" size={15} color="#FFFFFF" style={{ marginLeft: -8 }} />
          </View>
        </TouchableOpacity>

        {/* Card 2: Feature AD Container ("IPL News" with image & "Read More") */}
        <View style={styles.featureAdContainer}>
          {/* AD Top Info */}
          <View style={styles.adHeaderRow}>
            <View style={styles.adRedBallCircle}>
              <Ionicons name="baseball" size={20} color="#DC2626" />
              <View style={styles.adBadgePillGreen}>
                <Text style={styles.adBadgeText}>AD</Text>
              </View>
            </View>
            <View style={styles.adHeaderTexts}>
              <Text style={styles.featureAdTitle}>IPL News</Text>
              <Text style={styles.featureAdSubtitle} numberOfLines={1}>
                Stay updated with the latest IPL news and
              </Text>
            </View>
          </View>

          {/* Banner Image */}
          <View style={styles.featureImageWrapper}>
            <Image
              source={require('../../assets/welcome_ad_banner.jpg')}
              style={styles.featureImage}
              resizeMode="cover"
            />
          </View>

          {/* Read More Button */}
          <TouchableOpacity
            onPress={onNavigateToSchedule}
            style={styles.readMoreButton}
            activeOpacity={0.85}
          >
            <Text style={styles.readMoreText}>Read More</Text>
          </TouchableOpacity>
        </View>

        {/* Card 3: Play Game Button */}
        <TouchableOpacity
          onPress={handlePlayGame}
          style={styles.menuCard}
          activeOpacity={0.85}
        >
          <View style={styles.menuCardLeft}>
            <View style={styles.iconBoxPink}>
              <Ionicons name="baseball" size={24} color="#D97706" />
            </View>
            <Text style={styles.menuCardTitle}>Play Game</Text>
          </View>

          {/* Green AD Tag inside card */}
          <View style={styles.cardAdPill}>
            <Text style={styles.cardAdPillText}>AD</Text>
          </View>
        </TouchableOpacity>

        {/* Card 4: Playoff History Button */}
        <TouchableOpacity
          onPress={() => setCurrentSubScreen('playoffs')}
          style={styles.menuCard}
          activeOpacity={0.85}
        >
          <View style={styles.menuCardLeft}>
            <View style={styles.iconBoxBlue}>
              <Ionicons name="ribbon" size={24} color="#0284C7" />
            </View>
            <Text style={styles.menuCardTitle}>Playoff History</Text>
          </View>

          <View style={styles.greenChevronCircle}>
            <Ionicons name="chevron-forward-sharp" size={15} color="#FFFFFF" style={{ marginLeft: -1 }} />
            <Ionicons name="chevron-forward-sharp" size={15} color="#FFFFFF" style={{ marginLeft: -8 }} />
          </View>
        </TouchableOpacity>

        {/* Card 5: Bottom Action Buttons (Share App & Privacy Policy) */}
        <View style={styles.bottomButtonsRow}>
          <TouchableOpacity
            onPress={handleShareApp}
            style={styles.actionPillButton}
            activeOpacity={0.85}
          >
            <Text style={styles.actionPillText}>Share App</Text>
            <View style={styles.actionIconCircle}>
              <Ionicons name="share-social" size={16} color="#007A3B" />
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handlePrivacyPolicy}
            style={styles.actionPillButton}
            activeOpacity={0.85}
          >
            <View style={styles.actionIconCircleLeft}>
              <Ionicons name="checkmark-circle" size={18} color="#007A3B" />
            </View>
            <Text style={styles.actionPillText}>Privacy Policy</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* 4. Fixed Bottom Sticky AD Banner */}
      <View style={styles.bottomAdBanner}>
        <View style={styles.adIconBox}>
          <View style={styles.adBallBlueCircle}>
            <Ionicons name="baseball" size={20} color="#0284C7" />
            <View style={styles.adTagPillCyan}>
              <Text style={styles.adTagText}>AD</Text>
            </View>
          </View>
        </View>

        <View style={styles.adTextBox}>
          <Text style={styles.adTitle} numberOfLines={1}>Live Match Stats</Text>
          <Text style={styles.adSubtitle} numberOfLines={1}>
            Get real-time stats and updates for every Cricket
          </Text>
        </View>

        <TouchableOpacity style={styles.installButton} activeOpacity={0.85}>
          <Text style={styles.installButtonText}>Install</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  topHeaderBar: {
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#000000',
    textAlign: 'center',
  },
  topRightAdBadge: {
    padding: 4,
  },
  adBadgeBlueCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#0284C7',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  adRedBall: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#EF4444',
  },
  adSmallPill: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: '#38BDF8',
    paddingHorizontal: 3,
    paddingVertical: 1,
    borderRadius: 6,
  },
  adSmallPillText: {
    fontSize: 7,
    fontWeight: '900',
    color: '#FFFFFF',
  },

  /* Top Sub Header Banner */
  adBannerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginHorizontal: 16,
    marginTop: 4,
    marginBottom: 12,
    borderWidth: 1.5,
    borderColor: '#008000',
  },
  adIconBox: {
    marginRight: 10,
  },
  adPinCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E0F2FE',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  adTagPill: {
    position: 'absolute',
    top: -2,
    left: -2,
    backgroundColor: '#16A34A',
    paddingHorizontal: 3,
    paddingVertical: 1,
    borderRadius: 5,
  },
  adTagText: {
    fontSize: 7,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  adTextBox: {
    flex: 1,
    marginRight: 8,
  },
  adTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#000000',
    marginBottom: 1,
  },
  adSubtitle: {
    fontSize: 11,
    color: '#4B5563',
    fontWeight: '500',
  },
  installButton: {
    backgroundColor: '#008000',
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 8,
  },
  installButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },

  /* Scroll Content */
  scrollContent: {
    flex: 1,
    paddingHorizontal: 16,
  },
  scrollInner: {
    paddingTop: 4,
    paddingBottom: 24,
  },

  /* Menu Cards */
  menuCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#008000',
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  menuCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBoxYellow: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#FEF3C7',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  iconBoxPink: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#FCE7F3',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  iconBoxBlue: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#E0F2FE',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  menuCardTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#000000',
  },
  greenChevronCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#007A3B',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardAdPill: {
    backgroundColor: '#16A34A',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 5,
  },
  cardAdPillText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '900',
  },

  /* Feature AD Container (IPL News with Image & Read More) */
  featureAdContainer: {
    backgroundColor: '#EFEFEF',
    borderRadius: 18,
    padding: 12,
    marginBottom: 12,
  },
  adHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  adRedBallCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FEF2F2',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginRight: 10,
  },
  adBadgePillGreen: {
    position: 'absolute',
    top: -2,
    left: -2,
    backgroundColor: '#16A34A',
    paddingHorizontal: 3,
    paddingVertical: 1,
    borderRadius: 5,
  },
  adBadgeText: {
    color: '#FFFFFF',
    fontSize: 7,
    fontWeight: '900',
  },
  adHeaderTexts: {
    flex: 1,
  },
  featureAdTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#000000',
  },
  featureAdSubtitle: {
    fontSize: 11,
    color: '#4B5563',
    fontWeight: '500',
  },
  featureImageWrapper: {
    width: '100%',
    height: 145,
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 10,
  },
  featureImage: {
    width: '100%',
    height: '100%',
  },
  readMoreButton: {
    width: '100%',
    backgroundColor: '#007A3B',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  readMoreText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '800',
  },

  /* Bottom Row Buttons */
  bottomButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
    marginBottom: 16,
  },
  actionPillButton: {
    width: '48%',
    height: 44,
    backgroundColor: '#007A3B',
    borderRadius: 22,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  actionPillText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
    marginHorizontal: 6,
  },
  actionIconCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionIconCircleLeft: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },

  /* Bottom Sticky AD Banner */
  bottomAdBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  adBallBlueCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#E0F2FE',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  adTagPillCyan: {
    position: 'absolute',
    top: -2,
    left: -2,
    backgroundColor: '#0284C7',
    paddingHorizontal: 3,
    paddingVertical: 1,
    borderRadius: 5,
  },
});
