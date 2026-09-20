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
  Modal,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import MatchesHistoryScreen from './MatchesHistoryScreen';
import PlayoffsScreen from './PlayoffsScreen';

// --- Custom Artwork Graphic Components ---

// 1. Hero Green Banner Graphic (Bat, Trophy, Wickets, Ball)
const HeroCricketArt = () => (
  <View style={artStyles.heroContainer}>
    <View style={artStyles.trophyWrap}>
      <Ionicons name="trophy" size={42} color="#FFD700" />
    </View>
    <View style={artStyles.batWrap}>
      <MaterialCommunityIcons name="cricket" size={48} color="#F59E0B" />
    </View>
    <View style={artStyles.stumpsWrap}>
      <View style={artStyles.stumpBar} />
      <View style={artStyles.stumpBar} />
      <View style={artStyles.stumpBar} />
    </View>
    <View style={artStyles.ballRed} />
  </View>
);

// 2. Cricketer Batsman Graphic for IPL Schedule Card
const BatsmanArt = () => (
  <View style={artStyles.batsmanContainer}>
    <View style={artStyles.batsmanBody}>
      <MaterialCommunityIcons name="cricket" size={40} color="#0284C7" />
    </View>
    <View style={artStyles.ballRedSmall} />
  </View>
);

// 3. Wickets & Ball Graphic for Play Game Card
const WicketsGameArt = () => (
  <View style={artStyles.wicketsContainer}>
    <View style={artStyles.stumpsRow}>
      <View style={artStyles.stumpYellow} />
      <View style={artStyles.stumpYellow} />
      <View style={artStyles.stumpYellow} />
    </View>
    <View style={artStyles.pinkBallWrap}>
      <View style={artStyles.pinkBall} />
    </View>
    <View style={artStyles.grassBase} />
  </View>
);

// 4. Stadium Graphic for Venues Card
const StadiumArt = () => (
  <View style={artStyles.stadiumContainer}>
    <View style={artStyles.stadiumBowl}>
      <View style={artStyles.pitchField} />
      <View style={artStyles.flagRow}>
        <Ionicons name="flag" size={10} color="#EF4444" />
        <Ionicons name="flag" size={10} color="#3B82F6" />
        <Ionicons name="flag" size={10} color="#10B981" />
      </View>
    </View>
  </View>
);

// 5. Podium Graphic for Point Table Card
const PodiumArt = () => (
  <View style={artStyles.podiumContainer}>
    <View style={artStyles.medalWrap}>
      <Ionicons name="star" size={14} color="#FFD700" />
    </View>
    <View style={artStyles.podiumRow}>
      <View style={[artStyles.podiumBox, { height: 18, backgroundColor: '#3B82F6' }]}>
        <Text style={artStyles.podiumNum}>2</Text>
      </View>
      <View style={[artStyles.podiumBox, { height: 26, backgroundColor: '#EF4444' }]}>
        <Text style={artStyles.podiumNum}>1</Text>
      </View>
      <View style={[artStyles.podiumBox, { height: 14, backgroundColor: '#10B981' }]}>
        <Text style={artStyles.podiumNum}>3</Text>
      </View>
    </View>
  </View>
);

// 6. Yellow File Folder Graphic for All Records Card
const FolderArt = () => (
  <View style={artStyles.folderContainer}>
    <View style={artStyles.folderTab} />
    <View style={artStyles.folderBack}>
      <View style={artStyles.folderPaper} />
      <View style={artStyles.folderFront}>
        <View style={artStyles.folderFaceRow}>
          <View style={artStyles.folderEye} />
          <View style={artStyles.folderEye} />
        </View>
        <View style={artStyles.folderSmile} />
      </View>
    </View>
  </View>
);

// 7. Certificate Ribbon Graphic for Playoff History Card
const PlayoffCertificateArt = () => (
  <View style={artStyles.certContainer}>
    <View style={artStyles.certSheet}>
      <View style={artStyles.certLineLong} />
      <View style={artStyles.certLineShort} />
      <View style={artStyles.certLineShort} />
      <View style={artStyles.certRibbonBadge}>
        <Ionicons name="ribbon" size={14} color="#F59E0B" />
      </View>
    </View>
  </View>
);

export default function LiveCricketScoreScreen({ onBack, onNavigateToSchedule, onNavigateToTab }) {
  const [currentSubScreen, setCurrentSubScreen] = useState(null); // 'records' | 'playoffs'
  const [venuesModalVisible, setVenuesModalVisible] = useState(false);
  const [gameModalVisible, setGameModalVisible] = useState(false);

  const venuesList = [
    { id: '1', name: 'Narendra Modi Stadium', city: 'Ahmedabad', capacity: '132,000' },
    { id: '2', name: 'Wankhede Stadium', city: 'Mumbai', capacity: '33,108' },
    { id: '3', name: 'M. Chinnaswamy Stadium', city: 'Bengaluru', capacity: '40,000' },
    { id: '4', name: 'MA Chidambaram Stadium', city: 'Chennai', capacity: '38,000' },
    { id: '5', name: 'Eden Gardens', city: 'Kolkata', capacity: '68,000' },
    { id: '6', name: 'Arun Jaitley Stadium', city: 'Delhi', capacity: '55,000' },
    { id: '7', name: 'HPCA Stadium', city: 'Dharamshala', capacity: '23,000' },
    { id: '8', name: 'Rajiv Gandhi Intl Stadium', city: 'Hyderabad', capacity: '55,000' },
  ];

  const handleShareApp = async () => {
    try {
      await Share.share({
        message:
          'Download Live Cricket Score App for fastest live scores, IPL schedule, ball-by-ball updates, points table, and records!',
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
    setGameModalVisible(true);
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

      {/* 1. Header Matching Screenshots */}
      <View style={styles.topHeaderBar}>
        <TouchableOpacity onPress={onBack} style={styles.backButton} activeOpacity={0.7}>
          <Ionicons name="chevron-back" size={28} color="#000000" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Live Cricket Score</Text>

        {/* Top Right Circular AD Icon Badge */}
        <TouchableOpacity
          onPress={() => Alert.alert('Live Cricket', 'Welcome to Live Cricket Score!')}
          style={styles.topRightAdBadge}
          activeOpacity={0.8}
        >
          <View style={styles.adBadgeGreenCircle}>
            <View style={styles.adRedBallCircleHeader}>
              <View style={styles.redBallInner} />
            </View>
            <View style={styles.adSmallPillGreen}>
              <Text style={styles.adSmallPillText}>AD</Text>
            </View>
          </View>
        </TouchableOpacity>
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

        <TouchableOpacity
          style={styles.installButton}
          activeOpacity={0.85}
          onPress={() => onNavigateToTab && onNavigateToTab('news')}
        >
          <Text style={styles.installButtonText}>Install</Text>
        </TouchableOpacity>
      </View>

      {/* 3. Main Scrollable Content */}
      <ScrollView
        style={styles.scrollContent}
        contentContainerStyle={styles.scrollInner}
        showsVerticalScrollIndicator={false}
      >
        {/* Banner 1: Green Live Cricket Score Hero Banner */}
        <View style={styles.greenHeroCard}>
          <HeroCricketArt />

          <View style={styles.heroRightBox}>
            <Text style={styles.heroTitle}>Live Cricket Score</Text>
            <Text style={styles.heroSubtitle}>
              Get up to the minute updates on matches from ground
            </Text>

            <TouchableOpacity
              onPress={() => onNavigateToTab && onNavigateToTab('home')}
              style={styles.goToScoreBtn}
              activeOpacity={0.85}
            >
              <Text style={styles.goToScoreText}>Go To Score</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Banner 2: Grey Card - IPL Highlights (Watch Highlights) */}
        <View style={styles.featureAdContainer}>
          <View style={styles.adHeaderRow}>
            <View style={styles.adHeaderAvatar}>
              <Ionicons name="person" size={18} color="#FFFFFF" />
              <View style={styles.adBadgePillGreen}>
                <Text style={styles.adBadgeText}>AD</Text>
              </View>
            </View>
            <View style={styles.adHeaderTexts}>
              <Text style={styles.featureAdTitle}>IPL Highlights</Text>
              <Text style={styles.featureAdSubtitle} numberOfLines={1}>
                Catch up on today's match highlights in minutes!
              </Text>
            </View>
          </View>

          <View style={styles.featureImageWrapper}>
            <Image
              source={require('../../assets/welcome_ad_banner.jpg')}
              style={styles.featureImage}
              resizeMode="cover"
            />
          </View>

          <TouchableOpacity
            onPress={() => onNavigateToTab && onNavigateToTab('news')}
            style={styles.greenActionBtn}
            activeOpacity={0.85}
          >
            <Text style={styles.greenActionBtnText}>Watch Highlights</Text>
          </TouchableOpacity>
        </View>

        {/* Section 3: 2-Column Grid Layout (IPL Schedule, Play Game, Play Game, Venues) */}
        <View style={styles.gridContainer}>
          <TouchableOpacity
            onPress={onNavigateToSchedule}
            style={styles.gridCard}
            activeOpacity={0.85}
          >
            <Text style={styles.gridTitle}>IPL Schedule</Text>
            <Text style={styles.gridSubtitle}>
              All IPL match in date, time schedules
            </Text>
            <View style={styles.gridArtWrapper}>
              <BatsmanArt />
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handlePlayGame}
            style={styles.gridCard}
            activeOpacity={0.85}
          >
            <View style={styles.gridAdPill}>
              <Text style={styles.gridAdText}>AD</Text>
            </View>
            <Text style={styles.gridTitle}>Play Game</Text>
            <Text style={styles.gridSubtitle}>Let's the play of game</Text>
            <View style={styles.gridArtWrapper}>
              <WicketsGameArt />
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handlePlayGame}
            style={styles.gridCard}
            activeOpacity={0.85}
          >
            <View style={styles.gridAdPill}>
              <Text style={styles.gridAdText}>AD</Text>
            </View>
            <Text style={styles.gridTitle}>Play Game</Text>
            <Text style={styles.gridSubtitle}>Let's the play of game</Text>
            <View style={styles.gridArtWrapper}>
              <WicketsGameArt />
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setVenuesModalVisible(true)}
            style={styles.gridCard}
            activeOpacity={0.85}
          >
            <Text style={styles.gridTitle}>Venues</Text>
            <Text style={styles.gridSubtitle}>
              Check all match in location display
            </Text>
            <View style={styles.gridArtWrapper}>
              <StadiumArt />
            </View>
          </TouchableOpacity>
        </View>

        {/* Section 4: Full-width Horizontal Card - Point Table */}
        <TouchableOpacity
          onPress={() => onNavigateToTab && onNavigateToTab('series', 'table')}
          style={styles.horizontalCard}
          activeOpacity={0.85}
        >
          <View style={styles.horizontalLeft}>
            <PodiumArt />
            <Text style={styles.horizontalTitle}>Point Table</Text>
          </View>

          <View style={styles.greenChevronSquare}>
            <Ionicons name="chevron-forward-sharp" size={14} color="#FFFFFF" style={{ marginLeft: -1 }} />
            <Ionicons name="chevron-forward-sharp" size={14} color="#FFFFFF" style={{ marginLeft: -8 }} />
          </View>
        </TouchableOpacity>

        {/* Section 5: Full-width Horizontal Card - All Records */}
        <TouchableOpacity
          onPress={() => setCurrentSubScreen('records')}
          style={styles.horizontalCard}
          activeOpacity={0.85}
        >
          <View style={styles.horizontalLeft}>
            <FolderArt />
            <Text style={[styles.horizontalTitle, { marginLeft: 16 }]}>All Records</Text>
          </View>

          <View style={styles.greenChevronSquare}>
            <Ionicons name="chevron-forward-sharp" size={14} color="#FFFFFF" style={{ marginLeft: -1 }} />
            <Ionicons name="chevron-forward-sharp" size={14} color="#FFFFFF" style={{ marginLeft: -8 }} />
          </View>
        </TouchableOpacity>

        {/* Section 6: Grey Card - IPL News (Read More) */}
        <View style={styles.featureAdContainer}>
          <View style={styles.adHeaderRow}>
            <View style={styles.adRedBallCircle}>
              <Ionicons name="baseball" size={18} color="#DC2626" />
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

          <View style={styles.featureImageWrapper}>
            <Image
              source={require('../../assets/welcome_hero_art.jpg')}
              style={styles.featureImage}
              resizeMode="cover"
            />
          </View>

          <TouchableOpacity
            onPress={() => onNavigateToTab && onNavigateToTab('news')}
            style={styles.greenActionBtn}
            activeOpacity={0.85}
          >
            <Text style={styles.greenActionBtnText}>Read More</Text>
          </TouchableOpacity>
        </View>

        {/* Section 7: Full-width Horizontal Card - Play Game (AD) */}
        <TouchableOpacity
          onPress={handlePlayGame}
          style={styles.horizontalCard}
          activeOpacity={0.85}
        >
          <View style={styles.horizontalLeft}>
            <WicketsGameArt />
            <Text style={[styles.horizontalTitle, { marginLeft: 16 }]}>Play Game</Text>
          </View>

          <View style={styles.cardAdTagGreen}>
            <Text style={styles.cardAdTagText}>AD</Text>
          </View>
        </TouchableOpacity>

        {/* Section 8: Full-width Horizontal Card - Playoff History */}
        <TouchableOpacity
          onPress={() => setCurrentSubScreen('playoffs')}
          style={styles.horizontalCard}
          activeOpacity={0.85}
        >
          <View style={styles.horizontalLeft}>
            <PlayoffCertificateArt />
            <Text style={[styles.horizontalTitle, { marginLeft: 16 }]}>Playoff History</Text>
          </View>

          <View style={styles.greenChevronSquare}>
            <Ionicons name="chevron-forward-sharp" size={14} color="#FFFFFF" style={{ marginLeft: -1 }} />
            <Ionicons name="chevron-forward-sharp" size={14} color="#FFFFFF" style={{ marginLeft: -8 }} />
          </View>
        </TouchableOpacity>

        {/* Section 9: Bottom Row Action Buttons */}
        <View style={styles.bottomButtonsRow}>
          <TouchableOpacity
            onPress={handleShareApp}
            style={styles.actionPillButton}
            activeOpacity={0.85}
          >
            <Text style={styles.actionPillText}>Share App</Text>
            <View style={styles.actionIconCircle}>
              <Ionicons name="share-social" size={15} color="#007A3B" />
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handlePrivacyPolicy}
            style={styles.actionPillButton}
            activeOpacity={0.85}
          >
            <View style={styles.actionIconCircleLeft}>
              <Ionicons name="shield-checkmark" size={15} color="#007A3B" />
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

      {/* Venues Modal */}
      <Modal visible={venuesModalVisible} animationType="slide" transparent={true}>
        <View style={modalStyles.overlay}>
          <View style={modalStyles.content}>
            <View style={modalStyles.header}>
              <Text style={modalStyles.title}>IPL Venues 2026</Text>
              <TouchableOpacity onPress={() => setVenuesModalVisible(false)}>
                <Ionicons name="close-circle" size={26} color="#64748B" />
              </TouchableOpacity>
            </View>

            <FlatList
              data={venuesList}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View style={modalStyles.venueItem}>
                  <View style={modalStyles.venueIcon}>
                    <Ionicons name="location" size={20} color="#007A3B" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={modalStyles.venueName}>{item.name}</Text>
                    <Text style={modalStyles.venueCity}>{item.city} • Capacity: {item.capacity}</Text>
                  </View>
                </View>
              )}
            />
          </View>
        </View>
      </Modal>

      {/* Cricket Game Trivia Modal */}
      <Modal visible={gameModalVisible} animationType="fade" transparent={true}>
        <View style={modalStyles.overlay}>
          <View style={modalStyles.content}>
            <View style={modalStyles.header}>
              <Text style={modalStyles.title}>Cricket Trivia Quiz</Text>
              <TouchableOpacity onPress={() => setGameModalVisible(false)}>
                <Ionicons name="close-circle" size={26} color="#64748B" />
              </TouchableOpacity>
            </View>

            <View style={{ paddingVertical: 20, alignItems: 'center' }}>
              <Ionicons name="game-controller" size={54} color="#007A3B" />
              <Text style={{ fontSize: 18, fontWeight: '800', marginTop: 12, color: '#0F172A' }}>
                Play & Win Cricket Quiz!
              </Text>
              <Text style={{ fontSize: 13, color: '#64748B', textAlign: 'center', marginTop: 6, paddingHorizontal: 20 }}>
                Test your IPL cricket knowledge with 10 fun questions and win trophies!
              </Text>

              <TouchableOpacity
                onPress={() => {
                  setGameModalVisible(false);
                  Alert.alert('Quiz Started', 'Question 1: Who won the first IPL season in 2008?\n\nAnswer: Rajasthan Royals');
                }}
                style={[styles.greenActionBtn, { width: '80%', marginTop: 20 }]}
              >
                <Text style={styles.greenActionBtnText}>Start Game Now</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

// --- Artwork Styles ---
const artStyles = StyleSheet.create({
  heroContainer: {
    width: 90,
    height: 90,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  trophyWrap: {
    position: 'absolute',
    top: 4,
    left: 8,
  },
  batWrap: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    transform: [{ rotate: '-25deg' }],
  },
  stumpsWrap: {
    position: 'absolute',
    bottom: 6,
    left: 2,
    flexDirection: 'row',
    gap: 3,
  },
  stumpBar: {
    width: 3.5,
    height: 32,
    backgroundColor: '#FEF08A',
    borderRadius: 2,
  },
  ballRed: {
    position: 'absolute',
    top: 36,
    right: 30,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#EF4444',
  },
  batsmanContainer: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  batsmanBody: {
    transform: [{ rotate: '-10deg' }],
  },
  ballRedSmall: {
    position: 'absolute',
    top: 4,
    left: 4,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
  },
  wicketsContainer: {
    width: 44,
    height: 40,
    position: 'relative',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  stumpsRow: {
    flexDirection: 'row',
    gap: 3,
    marginBottom: 4,
  },
  stumpYellow: {
    width: 3,
    height: 24,
    backgroundColor: '#F59E0B',
    borderRadius: 1.5,
  },
  pinkBallWrap: {
    position: 'absolute',
    top: 2,
    right: 0,
  },
  pinkBall: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#EC4899',
  },
  grassBase: {
    width: 40,
    height: 4,
    backgroundColor: '#22C55E',
    borderRadius: 2,
  },
  stadiumContainer: {
    width: 44,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stadiumBowl: {
    width: 42,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#E2E8F0',
    borderWidth: 2,
    borderColor: '#10B981',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  pitchField: {
    width: 24,
    height: 12,
    backgroundColor: '#86EFAC',
    borderRadius: 6,
  },
  flagRow: {
    position: 'absolute',
    top: -8,
    flexDirection: 'row',
    gap: 4,
  },
  podiumContainer: {
    width: 38,
    height: 36,
    alignItems: 'center',
    justifyContent: 'flex-end',
    position: 'relative',
  },
  medalWrap: {
    position: 'absolute',
    top: 0,
  },
  podiumRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 2,
  },
  podiumBox: {
    width: 10,
    borderRadius: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  podiumNum: {
    color: '#FFFFFF',
    fontSize: 7,
    fontWeight: '900',
  },
  folderContainer: {
    width: 38,
    height: 34,
    position: 'relative',
  },
  folderTab: {
    width: 14,
    height: 4,
    backgroundColor: '#F59E0B',
    borderTopLeftRadius: 2,
    borderTopRightRadius: 2,
  },
  folderBack: {
    width: 36,
    height: 28,
    backgroundColor: '#FBBF24',
    borderRadius: 4,
    position: 'relative',
    overflow: 'hidden',
  },
  folderPaper: {
    width: 28,
    height: 18,
    backgroundColor: '#FFFFFF',
    alignSelf: 'center',
    marginTop: 2,
    borderRadius: 2,
  },
  folderFront: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 18,
    backgroundColor: '#F59E0B',
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  folderFaceRow: {
    flexDirection: 'row',
    gap: 4,
  },
  folderEye: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: '#78350F',
  },
  folderSmile: {
    width: 6,
    height: 2,
    backgroundColor: '#78350F',
    borderRadius: 1,
    marginTop: 1,
  },
  certContainer: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  certSheet: {
    width: 32,
    height: 34,
    backgroundColor: '#E0F2FE',
    borderWidth: 1.5,
    borderColor: '#38BDF8',
    borderRadius: 6,
    padding: 4,
    position: 'relative',
  },
  certLineLong: {
    width: 20,
    height: 3,
    backgroundColor: '#0284C7',
    borderRadius: 1.5,
    marginBottom: 3,
  },
  certLineShort: {
    width: 14,
    height: 3,
    backgroundColor: '#0284C7',
    borderRadius: 1.5,
    marginBottom: 3,
  },
  certRibbonBadge: {
    position: 'absolute',
    bottom: 2,
    right: 2,
  },
});

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
  adBadgeGreenCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#DCFCE7',
    borderWidth: 1.5,
    borderColor: '#16A34A',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  adRedBallCircleHeader: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#EF4444',
    alignItems: 'center',
    justifyContent: 'center',
  },
  redBallInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FCA5A5',
  },
  adSmallPillGreen: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: '#16A34A',
    paddingHorizontal: 3,
    paddingVertical: 1,
    borderRadius: 5,
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

  /* Hero Green Card */
  greenHeroCard: {
    backgroundColor: '#008000',
    borderRadius: 22,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
    shadowColor: '#008000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  heroRightBox: {
    flex: 1,
    marginLeft: 12,
  },
  heroTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '900',
    marginBottom: 4,
  },
  heroSubtitle: {
    color: '#E6F4EA',
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 16,
    marginBottom: 12,
  },
  goToScoreBtn: {
    backgroundColor: '#FFFFFF',
    alignSelf: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
  },
  goToScoreText: {
    color: '#008000',
    fontSize: 13,
    fontWeight: '900',
  },

  /* Feature AD Container (Grey Container) */
  featureAdContainer: {
    backgroundColor: '#EFEFEF',
    borderRadius: 20,
    padding: 12,
    marginBottom: 14,
  },
  adHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  adHeaderAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#475569',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginRight: 10,
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
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 10,
  },
  featureImage: {
    width: '100%',
    height: '100%',
  },
  greenActionBtn: {
    width: '100%',
    backgroundColor: '#008000',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  greenActionBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },

  /* 2-Column Grid Cards */
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  gridCard: {
    width: '48.5%',
    height: 142,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#008000',
    borderRadius: 20,
    padding: 12,
    marginBottom: 12,
    position: 'relative',
    justifyContent: 'space-between',
  },
  gridAdPill: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#16A34A',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 5,
    zIndex: 2,
  },
  gridAdText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '900',
  },
  gridTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#000000',
    marginBottom: 2,
  },
  gridSubtitle: {
    fontSize: 11,
    color: '#4B5563',
    fontWeight: '500',
    lineHeight: 14,
  },
  gridArtWrapper: {
    alignSelf: 'flex-end',
    marginTop: 'auto',
  },

  /* Horizontal Full Cards (Point Table, Play Game, All Records, Playoff History) */
  horizontalCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#008000',
    borderRadius: 20,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'relative',
  },
  horizontalLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  horizontalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#000000',
    marginLeft: 14,
  },
  greenChevronSquare: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: '#008000',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardAdTagGreen: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#16A34A',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 5,
  },
  cardAdTagText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '900',
  },

  /* Bottom Row Buttons */
  bottomButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
    marginBottom: 16,
  },
  actionPillButton: {
    width: '48.5%',
    height: 44,
    backgroundColor: '#008000',
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

const modalStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  content: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    paddingBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  venueItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F8FAFC',
  },
  venueIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#DCFCE7',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  venueName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
  },
  venueCity: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
});
