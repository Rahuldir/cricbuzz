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
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import MatchesHistoryScreen from './MatchesHistoryScreen';
import PlayoffsScreen from './PlayoffsScreen';

// --- Enhanced Transparent Artwork Graphic Components ---

// 1. Top Green Hero Banner - Left Side 3D Cricket Equipment Artwork
const HeroCricketArt = () => (
  <View style={artStyles.heroContainer}>
    {/* Glow Background Circle */}
    <View style={artStyles.heroGlowCircle} />

    {/* Golden Trophy */}
    <View style={artStyles.trophyWrap}>
      <Ionicons name="trophy" size={44} color="#FFD700" />
    </View>

    {/* Wooden Bat */}
    <View style={artStyles.batWrap}>
      <MaterialCommunityIcons name="cricket" size={52} color="#F59E0B" />
    </View>

    {/* 3 Stumps with Bails */}
    <View style={artStyles.stumpsWrap}>
      <View style={artStyles.bailsTop} />
      <View style={artStyles.stumpBarRow}>
        <View style={artStyles.stumpBar} />
        <View style={artStyles.stumpBar} />
        <View style={artStyles.stumpBar} />
      </View>
    </View>

    {/* Shiny Red Cricket Ball with Seam */}
    <View style={artStyles.ballRed}>
      <View style={artStyles.ballSeam} />
    </View>
  </View>
);

// 2. Cricketer Batsman Graphic for IPL Schedule Card (Transparent BG matching reference image)
const BatsmanArt = () => (
  <View style={artStyles.batsmanContainer}>
    {/* Floating Red Cricket Ball with Seam & Motion Trail */}
    <View style={artStyles.batsmanBallGroup}>
      <View style={artStyles.batsmanRedBall}>
        <View style={artStyles.batsmanBallSeam} />
        <View style={artStyles.batsmanBallGlow} />
      </View>
      <View style={artStyles.batsmanBallMotionLine} />
    </View>

    {/* Cricketer Batsman Figure in Action Stance */}
    <View style={artStyles.batsmanFigure}>
      {/* Helmet & Visor */}
      <View style={artStyles.helmetHead}>
        <View style={artStyles.helmetGridVisor} />
      </View>
      {/* Upper Torso / Jersey */}
      <View style={artStyles.jerseyTorso}>
        <View style={artStyles.jerseyCollar} />
      </View>
      {/* Wooden Bat */}
      <View style={artStyles.cricketBatShape}>
        <View style={artStyles.batHandle} />
      </View>
      {/* Legs & Batting Pads */}
      <View style={artStyles.battingPads}>
        <View style={artStyles.padLegLeft} />
        <View style={artStyles.padLegRight} />
      </View>
    </View>
  </View>
);

// 3. Wickets & Flying Bails & Pink Ball Graphic for Play Game Cards (Transparent BG matching reference image)
const WicketsGameArt = () => (
  <View style={artStyles.wicketsContainer}>
    {/* Flying Bails floating at top angle */}
    <View style={artStyles.bailsFlyRow}>
      <View style={[artStyles.bailBar, { transform: [{ rotate: '-35deg' }], marginRight: 4 }]} />
      <View style={[artStyles.bailBar, { transform: [{ rotate: '25deg' }] }]} />
    </View>

    {/* 3 Golden Stumps */}
    <View style={artStyles.stumpsGroup}>
      <View style={artStyles.stumpBar} />
      <View style={artStyles.stumpBar} />
      <View style={artStyles.stumpBar} />
    </View>

    {/* Bright Pink Cricket Ball with Seam & Speed Lines */}
    <View style={artStyles.pinkBallGroup}>
      <View style={artStyles.pinkBallCore}>
        <View style={artStyles.pinkBallWhiteSeam} />
        <View style={artStyles.pinkBallGloss} />
      </View>
      {/* Motion curves */}
      <View style={artStyles.speedCurveTop} />
      <View style={artStyles.speedCurveBottom} />
    </View>

    {/* Oval Green Grass Patch Base */}
    <View style={artStyles.grassTurfPatch} />
  </View>
);

// 4. Stadium Graphic for Venues Card (Transparent BG)
const StadiumArt = () => (
  <View style={artStyles.stadiumContainer}>
    <View style={artStyles.stadiumBowl}>
      <View style={artStyles.pitchField}>
        <View style={artStyles.pitchStrip} />
      </View>
      <View style={artStyles.flagRow}>
        <Ionicons name="flag" size={10} color="#EF4444" />
        <Ionicons name="flag" size={10} color="#3B82F6" />
        <Ionicons name="flag" size={10} color="#10B981" />
      </View>
    </View>
  </View>
);

// 5. Podium Graphic for Point Table Card (Transparent BG)
const PodiumArt = () => (
  <View style={artStyles.podiumContainer}>
    <View style={artStyles.medalWrap}>
      <Ionicons name="star" size={16} color="#FFD700" />
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

// 6. Yellow File Folder Graphic for All Records Card (Transparent BG)
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

// 7. Certificate Ribbon Graphic for Playoff History Card (Transparent BG)
const PlayoffCertificateArt = () => (
  <View style={artStyles.certContainer}>
    <View style={artStyles.certSheet}>
      <View style={artStyles.certLineLong} />
      <View style={artStyles.certLineShort} />
      <View style={artStyles.certLineShort} />
      <View style={artStyles.certRibbonBadge}>
        <Ionicons name="ribbon" size={15} color="#F59E0B" />
      </View>
    </View>
  </View>
);

export default function LiveCricketScoreScreen({ onBack, onNavigateToSchedule, onNavigateToTab }) {
  const [currentSubScreen, setCurrentSubScreen] = useState(null); // 'records' | 'playoffs'
  const [venuesModalVisible, setVenuesModalVisible] = useState(false);
  const [gameModalVisible, setGameModalVisible] = useState(false);

  const venuesList = [
    {
      id: '1',
      name: 'Eden Gardens,Kolkata',
      opened: '1864',
      capacity: '80,000',
      image: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?q=80&w=800&auto=format&fit=crop',
    },
    {
      id: '2',
      name: 'Wankhede Stadium,Mumbai',
      opened: '1933',
      capacity: '33,108',
      image: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?q=80&w=800&auto=format&fit=crop',
    },
    {
      id: '3',
      name: 'M. A. Chidambaram Stadium,Chennai',
      opened: '1916',
      capacity: '33,500',
      image: 'https://images.unsplash.com/photo-1512719994953-eabf50895df7?q=80&w=800&auto=format&fit=crop',
    },
    {
      id: '4',
      name: 'M. Chinnaswamy Stadium,Bengaluru',
      opened: '1969',
      capacity: '40,000',
      image: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=800&auto=format&fit=crop',
    },
    {
      id: '5',
      name: 'Narendra Modi Stadium,Ahmedabad',
      opened: '1983',
      capacity: '132,000',
      image: 'https://images.unsplash.com/photo-1562077772-3bd90403f7f0?q=80&w=800&auto=format&fit=crop',
    },
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
        {/* Banner 1: Vibrant Green Live Cricket Score Hero Banner */}
        <View style={styles.greenHeroCard}>
          {/* Enhanced 3D Left Cricket Image */}
          <HeroCricketArt />

          {/* Right Text Content */}
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

        {/* Section 3: 2-Column Grid Cards (Light Green BG #F4FBF6, Solid Green Border #008000) */}
        <View style={styles.gridContainer}>
          {/* Grid Item 1: IPL Schedule */}
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

          {/* Grid Item 2: Play Game (AD) */}
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

          {/* Grid Item 3: Play Game (AD) */}
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

          {/* Grid Item 4: Venues */}
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

        {/* Section 4: Full-width Horizontal Card - Point Table (Light Green BG #F4FBF6) */}
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

      {/* Venues Screen / Modal Matching Screenshots 2 & 4 */}
      <Modal visible={venuesModalVisible} animationType="slide" transparent={false} onRequestClose={() => setVenuesModalVisible(false)}>
        <SafeAreaView style={styles.container} edges={['top', 'left', 'right', 'bottom']}>
          <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

          {/* Top Header Bar */}
          <View style={styles.topHeaderBar}>
            <TouchableOpacity onPress={() => setVenuesModalVisible(false)} style={styles.backButton} activeOpacity={0.7}>
              <Ionicons name="chevron-back" size={28} color="#000000" />
            </TouchableOpacity>

            <Text style={styles.headerTitle}>Venue</Text>

            {/* Top Right Circular AD Badge */}
            <View style={styles.topRightAdBadge}>
              <View style={styles.adBadgeGreenCircle}>
                <View style={styles.adRedBallCircleHeader}>
                  <View style={styles.redBallInner} />
                </View>
                <View style={styles.adSmallPillGreen}>
                  <Text style={styles.adSmallPillText}>AD</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Sub-Header AD Card (Exact match Screenshot 2 & 4) */}
          <View style={styles.adBannerCard}>
            <View style={styles.adIconBox}>
              <View style={styles.adRedBallCircle}>
                <Ionicons name="baseball" size={18} color="#DC2626" />
                <View style={styles.adBadgePillGreen}>
                  <Text style={styles.adBadgeText}>AD</Text>
                </View>
              </View>
            </View>

            <View style={styles.adTextBox}>
              <Text style={styles.adTitle} numberOfLines={1}>IPL Highlights</Text>
              <Text style={styles.adSubtitle} numberOfLines={1}>
                Catch up on today's match highlights in minutes!
              </Text>
            </View>

            <TouchableOpacity style={styles.installButton} activeOpacity={0.85}>
              <Text style={styles.installButtonText}>Install</Text>
            </TouchableOpacity>
          </View>

          {/* Venues Cards Scroll List */}
          <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
            {venuesList.map((item) => (
              <View key={item.id} style={venueCardStyles.cardContainer}>
                {/* Green Stadium Header Banner */}
                <View style={venueCardStyles.headerBanner}>
                  <Text style={venueCardStyles.headerBannerText} numberOfLines={1}>
                    {item.name}
                  </Text>
                </View>

                {/* Stadium Image */}
                <View style={venueCardStyles.imageWrapper}>
                  <Image source={{ uri: item.image }} style={venueCardStyles.stadiumImage} resizeMode="cover" />
                </View>

                {/* Opened & Capacity Info Bar */}
                <View style={venueCardStyles.infoRow}>
                  <Text style={venueCardStyles.infoLabelText}>
                    Opened : <Text style={venueCardStyles.infoValText}>{item.opened}</Text>
                  </Text>
                  <Text style={venueCardStyles.infoLabelText}>
                    Capacity : <Text style={venueCardStyles.infoValText}>{item.capacity}</Text>
                  </Text>
                </View>
              </View>
            ))}
          </ScrollView>

          {/* Bottom AD Banner */}
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
              <Text style={styles.adTitle} numberOfLines={1}>IPL News</Text>
              <Text style={styles.adSubtitle} numberOfLines={1}>
                Stay updated with the latest IPL news and
              </Text>
            </View>

            <TouchableOpacity style={styles.installButton} activeOpacity={0.85}>
              <Text style={styles.installButtonText}>Install</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
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
    width: 96,
    height: 96,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroGlowCircle: {
    position: 'absolute',
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  trophyWrap: {
    position: 'absolute',
    top: 4,
    left: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  batWrap: {
    position: 'absolute',
    bottom: 2,
    right: 0,
    transform: [{ rotate: '-28deg' }],
    shadowColor: '#000',
    shadowOffset: { width: 1, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  stumpsWrap: {
    position: 'absolute',
    bottom: 4,
    left: 4,
    alignItems: 'center',
  },
  bailsTop: {
    width: 18,
    height: 3,
    backgroundColor: '#FEF08A',
    borderRadius: 1.5,
    marginBottom: 1,
  },
  stumpBarRow: {
    flexDirection: 'row',
    gap: 3.5,
  },
  stumpBar: {
    width: 3.5,
    height: 34,
    backgroundColor: '#FEF08A',
    borderRadius: 2,
  },
  ballRed: {
    position: 'absolute',
    top: 36,
    right: 28,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#EF4444',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#991B1B',
  },
  ballSeam: {
    width: 14,
    height: 2,
    backgroundColor: '#FFFFFF',
    borderRadius: 1,
    transform: [{ rotate: '45deg' }],
  },
  batsmanContainer: {
    width: 56,
    height: 54,
    position: 'relative',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  batsmanBallGroup: {
    position: 'absolute',
    top: 4,
    left: 0,
    alignItems: 'center',
    zIndex: 5,
  },
  batsmanRedBall: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#EF4444',
    borderWidth: 1,
    borderColor: '#B91C1C',
    alignItems: 'center',
    justifyContent: 'center',
  },
  batsmanBallSeam: {
    width: 12,
    height: 2,
    backgroundColor: '#FFFFFF',
    borderRadius: 1,
    transform: [{ rotate: '45deg' }],
  },
  batsmanBallGlow: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#FCA5A5',
    position: 'absolute',
    top: 2,
    right: 2,
  },
  batsmanBallMotionLine: {
    width: 12,
    height: 2,
    backgroundColor: '#EF4444',
    opacity: 0.5,
    borderRadius: 1,
    marginTop: 2,
  },
  batsmanFigure: {
    width: 42,
    height: 46,
    position: 'relative',
    alignItems: 'center',
  },
  helmetHead: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#475569',
    borderWidth: 1,
    borderColor: '#1E293B',
    position: 'relative',
    zIndex: 3,
  },
  helmetGridVisor: {
    width: 8,
    height: 3,
    backgroundColor: '#94A3B8',
    position: 'absolute',
    bottom: 3,
    left: 1,
    borderRadius: 1,
  },
  jerseyTorso: {
    width: 22,
    height: 18,
    backgroundColor: '#CBD5E1',
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    marginTop: -2,
    position: 'relative',
    zIndex: 2,
  },
  jerseyCollar: {
    width: 10,
    height: 3,
    backgroundColor: '#38BDF8',
    alignSelf: 'center',
    borderBottomLeftRadius: 2,
    borderBottomRightRadius: 2,
  },
  cricketBatShape: {
    width: 7,
    height: 26,
    backgroundColor: '#F59E0B',
    borderRadius: 2,
    borderWidth: 1,
    borderColor: '#D97706',
    position: 'absolute',
    right: -4,
    top: 8,
    transform: [{ rotate: '-35deg' }],
    zIndex: 4,
  },
  batHandle: {
    width: 3,
    height: 8,
    backgroundColor: '#1E293B',
    alignSelf: 'center',
    borderTopLeftRadius: 1,
    borderTopRightRadius: 1,
  },
  battingPads: {
    flexDirection: 'row',
    gap: 2,
    marginTop: -2,
    zIndex: 1,
  },
  padLegLeft: {
    width: 9,
    height: 18,
    backgroundColor: '#FFFFFF',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  padLegRight: {
    width: 9,
    height: 18,
    backgroundColor: '#FFFFFF',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  wicketsContainer: {
    width: 54,
    height: 50,
    position: 'relative',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  bailsFlyRow: {
    flexDirection: 'row',
    position: 'absolute',
    top: 2,
    alignSelf: 'center',
    zIndex: 3,
  },
  bailBar: {
    width: 10,
    height: 3,
    backgroundColor: '#FBBF24',
    borderRadius: 1.5,
    borderWidth: 0.5,
    borderColor: '#D97706',
  },
  stumpsGroup: {
    flexDirection: 'row',
    gap: 4,
    marginBottom: 4,
    zIndex: 2,
  },
  stumpBar: {
    width: 4,
    height: 30,
    backgroundColor: '#F59E0B',
    borderRadius: 2,
    borderWidth: 0.8,
    borderColor: '#D97706',
  },
  pinkBallGroup: {
    position: 'absolute',
    top: 10,
    right: -2,
    zIndex: 4,
    alignItems: 'center',
  },
  pinkBallCore: {
    width: 17,
    height: 17,
    borderRadius: 8.5,
    backgroundColor: '#EC4899',
    borderWidth: 1,
    borderColor: '#BE185D',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pinkBallWhiteSeam: {
    width: 14,
    height: 2,
    backgroundColor: '#FFFFFF',
    borderRadius: 1,
    transform: [{ rotate: '-35deg' }],
  },
  pinkBallGloss: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#FBCFE8',
    position: 'absolute',
    top: 2,
    right: 2,
  },
  speedCurveTop: {
    width: 12,
    height: 2,
    backgroundColor: '#EC4899',
    opacity: 0.7,
    borderRadius: 1,
    marginTop: 2,
    transform: [{ rotate: '15deg' }],
  },
  speedCurveBottom: {
    width: 9,
    height: 2,
    backgroundColor: '#EC4899',
    opacity: 0.4,
    borderRadius: 1,
    marginTop: 2,
    transform: [{ rotate: '15deg' }],
  },
  grassTurfPatch: {
    width: 48,
    height: 6,
    backgroundColor: '#22C55E',
    borderRadius: 3,
    borderWidth: 1,
    borderColor: '#16A34A',
    zIndex: 1,
  },
  stadiumContainer: {
    width: 48,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stadiumBowl: {
    width: 44,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#E2E8F0',
    borderWidth: 2,
    borderColor: '#10B981',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  pitchField: {
    width: 26,
    height: 14,
    backgroundColor: '#86EFAC',
    borderRadius: 7,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pitchStrip: {
    width: 14,
    height: 4,
    backgroundColor: '#FEF08A',
    borderRadius: 1,
  },
  flagRow: {
    position: 'absolute',
    top: -9,
    flexDirection: 'row',
    gap: 4,
  },
  podiumContainer: {
    width: 40,
    height: 38,
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
    gap: 2.5,
  },
  podiumBox: {
    width: 11,
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
    width: 40,
    height: 36,
    position: 'relative',
  },
  folderTab: {
    width: 16,
    height: 4,
    backgroundColor: '#F59E0B',
    borderTopLeftRadius: 2,
    borderTopRightRadius: 2,
  },
  folderBack: {
    width: 38,
    height: 30,
    backgroundColor: '#FBBF24',
    borderRadius: 5,
    position: 'relative',
    overflow: 'hidden',
  },
  folderPaper: {
    width: 30,
    height: 20,
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
    height: 20,
    backgroundColor: '#F59E0B',
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
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
    width: 7,
    height: 2,
    backgroundColor: '#78350F',
    borderRadius: 1,
    marginTop: 1,
  },
  certContainer: {
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
  },
  certSheet: {
    width: 34,
    height: 36,
    backgroundColor: '#E0F2FE',
    borderWidth: 1.5,
    borderColor: '#38BDF8',
    borderRadius: 6,
    padding: 4,
    position: 'relative',
  },
  certLineLong: {
    width: 22,
    height: 3,
    backgroundColor: '#0284C7',
    borderRadius: 1.5,
    marginBottom: 3,
  },
  certLineShort: {
    width: 15,
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
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 3,
  },
  heroRightBox: {
    flex: 1,
    marginLeft: 14,
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

  /* 2-Column Grid Cards (Light Green Tint BG #ECFDF3, Solid Green Border #15803D) */
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  gridCard: {
    width: '48.5%',
    height: 148,
    backgroundColor: '#ECFDF3',
    borderWidth: 1.5,
    borderColor: '#15803D',
    borderRadius: 22,
    padding: 14,
    marginBottom: 12,
    position: 'relative',
    justifyContent: 'space-between',
  },
  gridAdPill: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#15803D',
    paddingHorizontal: 7,
    paddingVertical: 2.5,
    borderRadius: 6,
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

  /* Horizontal Full Cards (Point Table, Play Game, All Records, Playoff History) - Light Green BG #ECFDF3 */
  horizontalCard: {
    backgroundColor: '#ECFDF3',
    borderWidth: 1.5,
    borderColor: '#15803D',
    borderRadius: 22,
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

const venueCardStyles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#008000',
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  headerBanner: {
    backgroundColor: '#008000',
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerBannerText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '800',
    textAlign: 'center',
  },
  imageWrapper: {
    width: '100%',
    height: 180,
    padding: 8,
    backgroundColor: '#FFFFFF',
  },
  stadiumImage: {
    width: '100%',
    height: '100%',
    borderRadius: 14,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
  },
  infoLabelText: {
    fontSize: 16,
    color: '#000000',
    fontWeight: '500',
  },
  infoValText: {
    fontSize: 16,
    fontWeight: '900',
    color: '#000000',
  },
});
