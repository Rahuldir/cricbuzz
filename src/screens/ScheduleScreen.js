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
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import EmptyStateView from '../components/EmptyStateView';

// Local transparent PNG team logos matching exact screenshot
const LOCAL_TEAM_LOGOS = {
  CSK: require('../../assets/team_logos/CSK.png'),
  GT: require('../../assets/team_logos/GT.png'),
  RCB: require('../../assets/team_logos/RCB.png'),
  MI: require('../../assets/team_logos/MI.png'),
  DC: require('../../assets/team_logos/DC.png'),
  KKR: require('../../assets/team_logos/KKR.png'),
  LSG: require('../../assets/team_logos/LSG.png'),
  SRH: require('../../assets/team_logos/SRH.png'),
  RR: require('../../assets/team_logos/RR.png'),
  PBKS: require('../../assets/team_logos/PBKS.png'),
};

const SCHEDULE_DATA = [
  {
    id: 1,
    matchNo: 'Match 1 of 74 • IPL 2026',
    venue: 'M. Chinnaswamy Stadium, Bengaluru',
    time: '7:30 PM',
    team1: { code: 'RCB', name: 'Royal Challengers Bengaluru', logo: LOCAL_TEAM_LOGOS.RCB },
    team2: { code: 'SRH', name: 'Sunrisers Hyderabad', logo: LOCAL_TEAM_LOGOS.SRH },
    date: '28-Mar-26,Saturday',
    pitchReport: 'Batting-friendly pitch with short boundaries & high bounce. Dew expected in 2nd innings.',
    weather: '27°C, Clear Sky, Humidity 54%',
    toss: 'Toss at 7:00 PM IST',
    headToHead: { total: 24, team1Wins: 11, team2Wins: 12, noResult: 1 },
    winPrediction: { team1: 52, team2: 48 },
    squad1: ['Virat Kohli (C)', 'Faf du Plessis', 'Rajat Patidar', 'Glenn Maxwell', 'Dinesh Karthik (WK)', 'Mohammed Siraj', 'Yash Dayal', 'Cameron Green'],
    squad2: ['Pat Cummins (C)', 'Travis Head', 'Abhishek Sharma', 'Heinrich Klaasen (WK)', 'Nitish Kumar Reddy', 'Bhuvaneshwar Kumar', 'T. Natarajan', 'Aiden Markram'],
    recentHeadToHead: [
      { date: '15 Apr 2024', result: 'SRH won by 25 runs', score: 'SRH 287/3 (20) vs RCB 262/7 (20)' },
      { date: '25 Apr 2024', result: 'RCB won by 35 runs', score: 'RCB 206/7 (20) vs SRH 171/8 (20)' },
      { date: '21 May 2023', result: 'RCB won by 8 wickets', score: 'SRH 186/5 (20) vs RCB 187/2 (19.4)' },
    ],
  },
  {
    id: 2,
    matchNo: 'Match 2 of 74 • IPL 2026',
    venue: 'Wankhede Stadium, Mumbai',
    time: '7:30 PM',
    team1: { code: 'MI', name: 'Mumbai Indians', logo: LOCAL_TEAM_LOGOS.MI },
    team2: { code: 'KKR', name: 'Kolkata Knight Riders', logo: LOCAL_TEAM_LOGOS.KKR },
    date: '29-Mar-26,Sunday',
    pitchReport: 'Red soil pitch with true pace & bounce. Excellent for stroke play.',
    weather: '29°C, Humid, Humidity 68%',
    toss: 'Toss at 7:00 PM IST',
    headToHead: { total: 33, team1Wins: 23, team2Wins: 10, noResult: 0 },
    winPrediction: { team1: 55, team2: 45 },
    squad1: ['Hardik Pandya (C)', 'Rohit Sharma', 'Suryakumar Yadav', 'Ishan Kishan (WK)', 'Jasprit Bumrah', 'Tilak Varma', 'Tim David', 'Gerald Coetzee'],
    squad2: ['Shreyas Iyer (C)', 'Sunil Narine', 'Phil Salt (WK)', 'Rinku Singh', 'Andre Russell', 'Mitchell Starc', 'Varun Chakaravarthy', 'Harshit Rana'],
    recentHeadToHead: [
      { date: '03 May 2024', result: 'KKR won by 24 runs', score: 'KKR 169/10 (19.5) vs MI 145/10 (18.5)' },
      { date: '11 May 2024', result: 'KKR won by 18 runs', score: 'KKR 157/7 (16) vs MI 139/8 (16)' },
      { date: '16 Apr 2023', result: 'MI won by 5 wickets', score: 'KKR 185/6 (20) vs MI 186/5 (17.4)' },
    ],
  },
  {
    id: 3,
    matchNo: 'Match 3 of 74 • IPL 2026',
    venue: 'Barsapara Stadium, Guwahati',
    time: '7:30 PM',
    team1: { code: 'RR', name: 'Rajasthan Royals', logo: LOCAL_TEAM_LOGOS.RR },
    team2: { code: 'CSK', name: 'Chennai Super Kings', logo: LOCAL_TEAM_LOGOS.CSK },
    date: '07-Apr-26,Tuesday',
    pitchReport: 'Fresh track with good seam movement early on. Spinners come into play in middle overs.',
    weather: '24°C, Pleasant, Humidity 60%',
    toss: 'Toss at 7:00 PM IST',
    headToHead: { total: 29, team1Wins: 14, team2Wins: 15, noResult: 0 },
    winPrediction: { team1: 50, team2: 50 },
    squad1: ['Sanju Samson (C & WK)', 'Yashasvi Jaiswal', 'Jos Buttler', 'Riyan Parag', 'Yuzvendra Chahal', 'Trent Boult', 'Avesh Khan', 'Ravichandran Ashwin'],
    squad2: ['Ruturaj Gaikwad (C)', 'MS Dhoni (WK)', 'Ravindra Jadeja', 'Shivam Dube', 'Matheesha Pathirana', 'Rachin Ravindra', 'Daryl Mitchell', 'Deepak Chahar'],
    recentHeadToHead: [
      { date: '12 May 2024', result: 'CSK won by 5 wickets', score: 'RR 141/5 (20) vs CSK 145/5 (18.2)' },
      { date: '27 Apr 2023', result: 'RR won by 32 runs', score: 'RR 202/5 (20) vs CSK 170/6 (20)' },
      { date: '12 Apr 2023', result: 'RR won by 3 runs', score: 'RR 175/8 (20) vs CSK 172/6 (20)' },
    ],
  },
  {
    id: 4,
    matchNo: 'Match 4 of 74 • IPL 2026',
    venue: 'Arun Jaitley Stadium, New Delhi',
    time: '7:30 PM',
    team1: { code: 'DC', name: 'Delhi Capitals', logo: LOCAL_TEAM_LOGOS.DC },
    team2: { code: 'GT', name: 'Gujarat Titans', logo: LOCAL_TEAM_LOGOS.GT },
    date: '08-Apr-26,Wednesday',
    pitchReport: 'Short boundaries with high scoring history. Fast outfield.',
    weather: '28°C, Clear, Humidity 45%',
    toss: 'Toss at 7:00 PM IST',
    headToHead: { total: 5, team1Wins: 3, team2Wins: 2, noResult: 0 },
    winPrediction: { team1: 51, team2: 49 },
    squad1: ['Rishabh Pant (C & WK)', 'Axar Patel', 'Kuldeep Yadav', 'Jake Fraser-McGurk', 'Tristan Stubbs', 'Mukesh Kumar', 'Khaleel Ahmed', 'Abishek Porel'],
    squad2: ['Shubman Gill (C)', 'Rashid Khan', 'Sai Sudharsan', 'David Miller', 'Rahul Tewatia', 'Mohit Sharma', 'Noor Ahmad', 'Wriddhiman Saha (WK)'],
    recentHeadToHead: [
      { date: '24 Apr 2024', result: 'DC won by 4 runs', score: 'DC 224/4 (20) vs GT 220/8 (20)' },
      { date: '17 Apr 2024', result: 'DC won by 6 wickets', score: 'GT 89/10 (17.3) vs DC 92/4 (8.5)' },
      { date: '02 May 2023', result: 'DC won by 5 runs', score: 'DC 130/8 (20) vs GT 125/6 (20)' },
    ],
  },
  {
    id: 5,
    matchNo: 'Match 5 of 74 • IPL 2026',
    venue: 'Eden Gardens, Kolkata',
    time: '7:30 PM',
    team1: { code: 'KKR', name: 'Kolkata Knight Riders', logo: LOCAL_TEAM_LOGOS.KKR },
    team2: { code: 'LSG', name: 'Lucknow Super Giants', logo: LOCAL_TEAM_LOGOS.LSG },
    date: '09-Apr-26,Thursday',
    pitchReport: 'Classic Kolkata deck with spin assistance as game progresses.',
    weather: '28°C, Humid, Humidity 72%',
    toss: 'Toss at 7:00 PM IST',
    headToHead: { total: 5, team1Wins: 2, team2Wins: 3, noResult: 0 },
    winPrediction: { team1: 54, team2: 46 },
    squad1: ['Shreyas Iyer (C)', 'Sunil Narine', 'Phil Salt (WK)', 'Rinku Singh', 'Andre Russell', 'Varun Chakaravarthy', 'Harshit Rana', 'Ramandeep Singh'],
    squad2: ['KL Rahul (C & WK)', 'Marcus Stoinis', 'Nicholas Pooran', 'Ravi Bishnoi', 'Mayank Yadav', 'Krunal Pandya', 'Ayush Badoni', 'Mohsin Khan'],
    recentHeadToHead: [
      { date: '05 May 2024', result: 'KKR won by 98 runs', score: 'KKR 235/6 (20) vs LSG 137/10 (16.1)' },
      { date: '14 Apr 2024', result: 'KKR won by 8 wickets', score: 'LSG 161/7 (20) vs KKR 162/2 (15.4)' },
      { date: '20 May 2023', result: 'LSG won by 1 run', score: 'LSG 176/8 (20) vs KKR 175/7 (20)' },
    ],
  },
  {
    id: 6,
    matchNo: 'Match 6 of 74 • IPL 2026',
    venue: 'Barsapara Stadium, Guwahati',
    time: '3:30 PM',
    team1: { code: 'RR', name: 'Rajasthan Royals', logo: LOCAL_TEAM_LOGOS.RR },
    team2: { code: 'PBKS', name: 'Punjab Kings', logo: LOCAL_TEAM_LOGOS.PBKS },
    date: '12-Apr-26,Sunday',
    pitchReport: 'Day match with dry surface favoring spinners.',
    weather: '31°C, Sunny, Humidity 48%',
    toss: 'Toss at 3:00 PM IST',
    headToHead: { total: 27, team1Wins: 16, team2Wins: 11, noResult: 0 },
    winPrediction: { team1: 53, team2: 47 },
    squad1: ['Sanju Samson (C & WK)', 'Yashasvi Jaiswal', 'Jos Buttler', 'Riyan Parag', 'Yuzvendra Chahal', 'Trent Boult', 'Sandeep Sharma', 'Dhruv Jurel'],
    squad2: ['Shikhar Dhawan (C)', 'Shashank Singh', 'Ashutosh Sharma', 'Sam Curran', 'Arshdeep Singh', 'Kagiso Rabada', 'Jitesh Sharma (WK)', 'Liam Livingstone'],
    recentHeadToHead: [
      { date: '15 May 2024', result: 'PBKS won by 5 wickets', score: 'RR 144/9 (20) vs PBKS 145/5 (18.5)' },
      { date: '13 Apr 2024', result: 'RR won by 3 wickets', score: 'PBKS 147/8 (20) vs RR 152/7 (19.5)' },
      { date: '19 May 2023', result: 'RR won by 4 wickets', score: 'PBKS 187/5 (20) vs RR 189/6 (19.4)' },
    ],
  },
];

export default function ScheduleScreen({ onBack }) {
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [activeSubTab, setActiveSubTab] = useState('live'); // 'live' | 'recent' | 'upcoming'
  const [selectedSquadTeam, setSelectedSquadTeam] = useState('team1'); // 'team1' | 'team2'
  const [reminderSet, setReminderSet] = useState(false);

  const handleShareMatch = async (match) => {
    try {
      await Share.share({
        message: `🏏 IPL 2026 Match Preview!\n${match.team1.name} vs ${match.team2.name}\n📅 Date: ${match.date}\n⏰ Time: ${match.time}\n🏟️ Venue: ${match.venue}\nStay updated on Live Score!`,
      });
    } catch (error) {
      console.warn('Share error:', error);
    }
  };

  const handleToggleReminder = () => {
    setReminderSet(!reminderSet);
    Alert.alert(
      reminderSet ? 'Reminder Removed' : 'Reminder Set! 🔔',
      reminderSet
        ? 'Match reminder has been turned off.'
        : `You will be notified 15 minutes before ${selectedMatch?.team1?.code} vs ${selectedMatch?.team2?.code} starts!`
    );
  };

  // Render Match Details View matching Screenshot 3 & 4 exact design
  if (selectedMatch) {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'left', 'right', 'bottom']}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

        {/* 1. Header Bar matching Screenshot 3 ("Live Score") */}
        <View style={styles.topHeaderBar}>
          <TouchableOpacity
            onPress={() => setSelectedMatch(null)}
            style={styles.backButton}
            activeOpacity={0.7}
          >
            <Ionicons name="chevron-back" size={28} color="#000000" />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Live Score</Text>

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

        {/* 2. Top Sub-Header AD Card */}
        <View style={styles.adBannerCard}>
          <View style={styles.adIconBox}>
            <View style={styles.adBallCircle}>
              <Ionicons name="baseball" size={18} color="#DC2626" />
              <View style={styles.adTagPillGreen}>
                <Text style={styles.adTagText}>AD</Text>
              </View>
            </View>
          </View>

          <View style={styles.adTextBox}>
            <Text style={styles.adTitle} numberOfLines={1}>IPL Live Matches</Text>
            <Text style={styles.adSubtitle} numberOfLines={1}>
              Watch live Cricket matches on your phone. Don't
            </Text>
          </View>

          <TouchableOpacity style={styles.installButton} activeOpacity={0.85}>
            <Text style={styles.installButtonText}>Install</Text>
          </TouchableOpacity>
        </View>

        {/* 3. 3-Tab Segmented Nav Bar (Live | Recent | Upcoming*) matching Screenshot 3 */}
        <View style={styles.tabsContainer}>
          <View style={styles.tabsRow}>
            {[
              { id: 'live', label: 'Live', hasDot: false },
              { id: 'recent', label: 'Recent', hasDot: false },
              { id: 'upcoming', label: 'Upcoming', hasDot: true },
            ].map((tab) => {
              const isActive = activeSubTab === tab.id;
              return (
                <TouchableOpacity
                  key={tab.id}
                  onPress={() => setActiveSubTab(tab.id)}
                  style={[
                    styles.tabButton,
                    isActive && styles.activeTabButton,
                  ]}
                  activeOpacity={0.85}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text
                      style={[
                        styles.tabText,
                        isActive && styles.activeTabText,
                      ]}
                    >
                      {tab.label}
                    </Text>
                    {tab.hasDot && (
                      <View style={styles.redNotificationDot} />
                    )}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* 4. Tab Content Area */}
        <ScrollView
          style={styles.scrollContent}
          contentContainerStyle={styles.scrollInner}
          showsVerticalScrollIndicator={false}
        >
          {/* TAB 1: LIVE TAB -> Live Scorecard & Match Center */}
          {activeSubTab === 'live' && (
            <View style={{ paddingBottom: 16 }}>
              {/* Live Badge Banner */}
              <View style={styles.liveBadgeBannerRow}>
                <View style={styles.livePulseDot} />
                <Text style={styles.liveBadgeBannerText}>LIVE • 1st Innings in Progress</Text>
              </View>

              {/* Main Live Score Card */}
              <View style={styles.liveScoreMainCard}>
                <Text style={styles.matchNoTag}>{selectedMatch.matchNo}</Text>

                {/* Score Grid */}
                <View style={styles.liveTeamRow}>
                  <View style={styles.teamCol}>
                    <View style={styles.logoWrapper}>
                      <Image source={selectedMatch.team1.logo} style={styles.logoImage} resizeMode="contain" />
                    </View>
                    <Text style={styles.teamCodeText}>{selectedMatch.team1.code}</Text>
                    <Text style={styles.liveScoreBigText}>168/4</Text>
                    <Text style={styles.liveOversText}>(17.2 ov)</Text>
                  </View>

                  <View style={styles.vsBadgeCircleBig}>
                    <Text style={styles.vsTextBig}>VS</Text>
                  </View>

                  <View style={styles.teamCol}>
                    <View style={styles.logoWrapper}>
                      <Image source={selectedMatch.team2.logo} style={styles.logoImage} resizeMode="contain" />
                    </View>
                    <Text style={styles.teamCodeText}>{selectedMatch.team2.code}</Text>
                    <Text style={styles.liveScoreBigText}>Yet to Bat</Text>
                    <Text style={styles.liveOversText}>(0.0 ov)</Text>
                  </View>
                </View>

                {/* Run Rate Info */}
                <View style={styles.rrInfoRow}>
                  <Text style={styles.rrInfoText}>CRR: <Text style={styles.rrVal}>9.69</Text></Text>
                  <Text style={styles.rrInfoText}>Projected: <Text style={styles.rrVal}>195</Text></Text>
                </View>
              </View>

              {/* Current Batting Partnership */}
              <View style={styles.detailSectionCard}>
                <View style={styles.sectionTitleRow}>
                  <Ionicons name="baseball" size={18} color="#008000" />
                  <Text style={styles.sectionTitleText}>Current Batters</Text>
                </View>

                <View style={styles.batterRowHeader}>
                  <Text style={[styles.batterColHeader, { flex: 2 }]}>Batter</Text>
                  <Text style={styles.batterColHeader}>R</Text>
                  <Text style={styles.batterColHeader}>B</Text>
                  <Text style={styles.batterColHeader}>4s</Text>
                  <Text style={styles.batterColHeader}>6s</Text>
                  <Text style={[styles.batterColHeader, { flex: 1.2, textAlign: 'right' }]}>SR</Text>
                </View>

                {/* Striker */}
                <View style={styles.batterRowItem}>
                  <Text style={[styles.batterNameText, { flex: 2 }]} numberOfLines={1}>
                    {selectedMatch.squad1[0]} <Text style={{ color: '#008000' }}>*</Text>
                  </Text>
                  <Text style={styles.batterValText}>68</Text>
                  <Text style={styles.batterSubValText}>44</Text>
                  <Text style={styles.batterSubValText}>6</Text>
                  <Text style={styles.batterSubValText}>2</Text>
                  <Text style={[styles.batterValText, { flex: 1.2, textAlign: 'right' }]}>154.5</Text>
                </View>

                {/* Non-Striker */}
                <View style={styles.batterRowItem}>
                  <Text style={[styles.batterNameText, { flex: 2 }]} numberOfLines={1}>
                    {selectedMatch.squad1[2]}
                  </Text>
                  <Text style={styles.batterValText}>34</Text>
                  <Text style={styles.batterSubValText}>22</Text>
                  <Text style={styles.batterSubValText}>3</Text>
                  <Text style={styles.batterSubValText}>1</Text>
                  <Text style={[styles.batterValText, { flex: 1.2, textAlign: 'right' }]}>154.5</Text>
                </View>
              </View>

              {/* Current Bowler & Over Timeline */}
              <View style={styles.detailSectionCard}>
                <View style={styles.sectionTitleRow}>
                  <Ionicons name="fitness" size={18} color="#008000" />
                  <Text style={styles.sectionTitleText}>Bowler & Recent Balls</Text>
                </View>

                <View style={styles.bowlerDetailRow}>
                  <Text style={styles.bowlerNameText}>{selectedMatch.squad2[0]}</Text>
                  <Text style={styles.bowlerFigText}>2/32 (3.2 ov) • Econ 9.60</Text>
                </View>

                {/* Recent Balls Timeline */}
                <View style={styles.ballsTimelineRow}>
                  {['4', '1', '6', 'W', '0', '2'].map((b, idx) => (
                    <View
                      key={idx}
                      style={[
                        styles.ballBubble,
                        b === 'W' && styles.ballBubbleWicket,
                        (b === '4' || b === '6') && styles.ballBubbleBoundary,
                      ]}
                    >
                      <Text
                        style={[
                          styles.ballBubbleText,
                          (b === 'W' || b === '4' || b === '6') && { color: '#FFFFFF' },
                        ]}
                      >
                        {b}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            </View>
          )}

          {/* TAB 2: UPCOMING TAB -> Detailed Match Info Card */}
          {activeSubTab === 'upcoming' && (
            <View style={{ paddingBottom: 16 }}>
              {/* Match Header Badge */}
              <View style={styles.matchCardDetailHeader}>
                <Text style={styles.stadiumNameText} numberOfLines={1}>
                  {selectedMatch.venue}
                </Text>
                <View style={styles.timePill}>
                  <Text style={styles.timePillText}>{selectedMatch.time}</Text>
                </View>
              </View>

              {/* Main Teams Matchup Card */}
              <View style={styles.matchupBox}>
                <Text style={styles.matchNoTag}>{selectedMatch.matchNo}</Text>

                <View style={styles.matchupRow}>
                  {/* Team 1 */}
                  <View style={styles.teamCol}>
                    <View style={styles.logoWrapper}>
                      <Image source={selectedMatch.team1.logo} style={styles.logoImage} resizeMode="contain" />
                    </View>
                    <Text style={styles.teamCodeText}>{selectedMatch.team1.code}</Text>
                    <Text style={styles.teamFullName} numberOfLines={1}>{selectedMatch.team1.name}</Text>
                  </View>

                  {/* VS Badge */}
                  <View style={styles.vsBadgeLarge}>
                    <Text style={styles.vsBadgeTextLarge}>VS</Text>
                  </View>

                  {/* Team 2 */}
                  <View style={styles.teamCol}>
                    <View style={styles.logoWrapper}>
                      <Image source={selectedMatch.team2.logo} style={styles.logoImage} resizeMode="contain" />
                    </View>
                    <Text style={styles.teamCodeText}>{selectedMatch.team2.code}</Text>
                    <Text style={styles.teamFullName} numberOfLines={1}>{selectedMatch.team2.name}</Text>
                  </View>
                </View>

                {/* Date Banner */}
                <View style={styles.datePillBox}>
                  <Ionicons name="calendar-outline" size={16} color="#008000" style={{ marginRight: 6 }} />
                  <Text style={styles.datePillText}>{selectedMatch.date}</Text>
                </View>

                {/* Win Predictor Percentage Bar */}
                <View style={styles.predictorBox}>
                  <View style={styles.predictorHeaderRow}>
                    <Text style={styles.predictorTitle}>Win Predictor</Text>
                    <Text style={styles.predictorRatioText}>
                      {selectedMatch.team1.code} {selectedMatch.winPrediction.team1}% - {selectedMatch.winPrediction.team2}% {selectedMatch.team2.code}
                    </Text>
                  </View>
                  <View style={styles.barContainer}>
                    <View style={[styles.barFillLeft, { flex: selectedMatch.winPrediction.team1 }]} />
                    <View style={[styles.barFillRight, { flex: selectedMatch.winPrediction.team2 }]} />
                  </View>
                </View>
              </View>

              {/* Match Information Grid */}
              <View style={styles.detailSectionCard}>
                <View style={styles.sectionTitleRow}>
                  <Ionicons name="information-circle" size={20} color="#008000" />
                  <Text style={styles.sectionTitleText}>Match Info & Conditions</Text>
                </View>

                <View style={styles.infoGridRow}>
                  <View style={styles.infoGridBox}>
                    <Ionicons name="sunny-outline" size={18} color="#D97706" />
                    <Text style={styles.infoLabel}>Weather</Text>
                    <Text style={styles.infoValue}>{selectedMatch.weather}</Text>
                  </View>
                  <View style={styles.infoGridBox}>
                    <Ionicons name="time-outline" size={18} color="#2563EB" />
                    <Text style={styles.infoLabel}>Toss Info</Text>
                    <Text style={styles.infoValue}>{selectedMatch.toss}</Text>
                  </View>
                </View>

                <View style={styles.pitchReportBox}>
                  <Text style={styles.pitchReportLabel}>🏟️ Pitch & Conditions:</Text>
                  <Text style={styles.pitchReportText}>{selectedMatch.pitchReport}</Text>
                </View>
              </View>

              {/* Head to Head Statistics */}
              <View style={styles.detailSectionCard}>
                <View style={styles.sectionTitleRow}>
                  <Ionicons name="stats-chart" size={20} color="#008000" />
                  <Text style={styles.sectionTitleText}>Head to Head Stats</Text>
                </View>

                <View style={styles.h2hRow}>
                  <View style={styles.h2hStatBox}>
                    <Text style={styles.h2hNumber}>{selectedMatch.headToHead.total}</Text>
                    <Text style={styles.h2hLabel}>Total Played</Text>
                  </View>
                  <View style={[styles.h2hStatBox, { borderLeftWidth: 1, borderRightWidth: 1, borderColor: '#E2E8F0' }]}>
                    <Text style={[styles.h2hNumber, { color: '#008000' }]}>{selectedMatch.headToHead.team1Wins}</Text>
                    <Text style={styles.h2hLabel}>{selectedMatch.team1.code} Wins</Text>
                  </View>
                  <View style={styles.h2hStatBox}>
                    <Text style={[styles.h2hNumber, { color: '#DC2626' }]}>{selectedMatch.headToHead.team2Wins}</Text>
                    <Text style={styles.h2hLabel}>{selectedMatch.team2.code} Wins</Text>
                  </View>
                </View>
              </View>

              {/* Probable Playing XI / Squad */}
              <View style={styles.detailSectionCard}>
                <View style={styles.sectionTitleRow}>
                  <Ionicons name="people" size={20} color="#008000" />
                  <Text style={styles.sectionTitleText}>Probable Playing XI</Text>
                </View>

                {/* Team Toggle Pills */}
                <View style={styles.squadToggleRow}>
                  <TouchableOpacity
                    onPress={() => setSelectedSquadTeam('team1')}
                    style={[
                      styles.squadTabPill,
                      selectedSquadTeam === 'team1' && styles.squadTabPillActive,
                    ]}
                    activeOpacity={0.8}
                  >
                    <Text
                      style={[
                        styles.squadTabPillText,
                        selectedSquadTeam === 'team1' && styles.squadTabPillTextActive,
                      ]}
                    >
                      {selectedMatch.team1.code}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => setSelectedSquadTeam('team2')}
                    style={[
                      styles.squadTabPill,
                      selectedSquadTeam === 'team2' && styles.squadTabPillActive,
                    ]}
                    activeOpacity={0.8}
                  >
                    <Text
                      style={[
                        styles.squadTabPillText,
                        selectedSquadTeam === 'team2' && styles.squadTabPillTextActive,
                      ]}
                    >
                      {selectedMatch.team2.code}
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* Squad List */}
                <View style={styles.squadListGrid}>
                  {(selectedSquadTeam === 'team1' ? selectedMatch.squad1 : selectedMatch.squad2).map((player, idx) => (
                    <View key={idx} style={styles.playerItemRow}>
                      <View style={styles.playerDot} />
                      <Text style={styles.playerNameText}>{player}</Text>
                    </View>
                  ))}
                </View>
              </View>

              {/* Quick Action Buttons */}
              <View style={styles.actionButtonsRow}>
                <TouchableOpacity
                  onPress={handleToggleReminder}
                  style={[
                    styles.actionBtn,
                    reminderSet ? styles.actionBtnActive : styles.actionBtnOutline,
                  ]}
                  activeOpacity={0.85}
                >
                  <Ionicons
                    name={reminderSet ? 'notifications' : 'notifications-outline'}
                    size={18}
                    color={reminderSet ? '#FFFFFF' : '#008000'}
                    style={{ marginRight: 6 }}
                  />
                  <Text
                    style={[
                      styles.actionBtnText,
                      reminderSet ? styles.actionBtnTextActive : styles.actionBtnTextOutline,
                    ]}
                  >
                    {reminderSet ? 'Reminder Set' : 'Set Reminder'}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => handleShareMatch(selectedMatch)}
                  style={[styles.actionBtn, styles.actionBtnGreen]}
                  activeOpacity={0.85}
                >
                  <Ionicons name="share-social-outline" size={18} color="#FFFFFF" style={{ marginRight: 6 }} />
                  <Text style={[styles.actionBtnText, styles.actionBtnTextActive]}>
                    Share Match
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* TAB 3: RECENT TAB -> Previous Encounters */}
          {activeSubTab === 'recent' && (
            <View style={{ paddingBottom: 16 }}>
              <Text style={styles.recentSectionHeader}>
                Recent Encounters ({selectedMatch.team1.code} vs {selectedMatch.team2.code})
              </Text>

              {selectedMatch.recentHeadToHead.map((item, index) => (
                <View key={index} style={styles.recentMatchCard}>
                  <View style={styles.recentHeaderRow}>
                    <Text style={styles.recentDateText}>{item.date}</Text>
                    <View style={styles.recentResultPill}>
                      <Text style={styles.recentResultPillText}>{item.result}</Text>
                    </View>
                  </View>
                  <Text style={styles.recentScoreText}>{item.score}</Text>
                </View>
              ))}
            </View>
          )}
        </ScrollView>

        {/* 5. Fixed Bottom Sticky AD Banner */}
        <View style={styles.bottomAdBanner}>
          <View style={styles.adIconBox}>
            <View style={styles.adBallCircle}>
              <Ionicons name="baseball" size={20} color="#DC2626" />
              <View style={styles.adTagPillGreen}>
                <Text style={styles.adTagText}>AD</Text>
              </View>
            </View>
          </View>

          <View style={styles.adTextBox}>
            <Text style={styles.adTitle} numberOfLines={1}>IPL Live Matches</Text>
            <Text style={styles.adSubtitle} numberOfLines={1}>
              Watch live Cricket matches on your phone. Don't
            </Text>
          </View>

          <TouchableOpacity style={styles.installButton} activeOpacity={0.85}>
            <Text style={styles.installButtonText}>Install</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Default IPL Schedule Cards List View
  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right', 'bottom']}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* 1. Top Header Bar */}
      <View style={styles.topHeaderBar}>
        <TouchableOpacity onPress={onBack} style={styles.backButton} activeOpacity={0.7}>
          <Ionicons name="chevron-back" size={28} color="#000000" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>IPL Schedule</Text>

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

      {/* 2. Top Sub-Header AD Card */}
      <View style={styles.adBannerCard}>
        <View style={styles.adIconBox}>
          <View style={styles.adBallCircle}>
            <Ionicons name="baseball" size={18} color="#DC2626" />
            <View style={styles.adTagPillGreen}>
              <Text style={styles.adTagText}>AD</Text>
            </View>
          </View>
        </View>

        <View style={styles.adTextBox}>
          <Text style={styles.adTitle} numberOfLines={1}>IPL Live Matches</Text>
          <Text style={styles.adSubtitle} numberOfLines={1}>
            Watch live Cricket matches on your phone. Don't
          </Text>
        </View>

        <TouchableOpacity style={styles.installButton} activeOpacity={0.85}>
          <Text style={styles.installButtonText}>Install</Text>
        </TouchableOpacity>
      </View>

      {/* 3. Schedule Cards List */}
      <ScrollView
        style={styles.scrollContent}
        contentContainerStyle={styles.scrollInner}
        showsVerticalScrollIndicator={false}
      >
        {SCHEDULE_DATA.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.matchCardCompact}
            activeOpacity={0.85}
            onPress={() => {
              setSelectedMatch(item);
              setActiveSubTab('upcoming');
            }}
          >
            {/* 1. Green Header Bar (Top Left: Venue / Top Right: Time) */}
            <View style={styles.matchCardHeaderCompact}>
              <View style={styles.headerLeftRowCompact}>
                <Ionicons name="location-sharp" size={13} color="#FFFFFF" style={{ marginRight: 4 }} />
                <Text style={styles.stadiumNameTextCompact} numberOfLines={1}>
                  {item.venue}
                </Text>
              </View>
              <View style={styles.timePillCompact}>
                <Ionicons name="time-outline" size={12} color="#008000" style={{ marginRight: 3 }} />
                <Text style={styles.timePillTextCompact}>{item.time}</Text>
              </View>
            </View>

            {/* 2. Team Matchup Row (Center: Multi-Layered Cloud-Style VS Graphic Badge) */}
            <View style={styles.matchupRowCompact}>
              {/* Team 1 (Left) */}
              <View style={styles.teamColCompact}>
                <View style={styles.logoWrapperCompact}>
                  <Image source={item.team1.logo} style={styles.logoImageCompact} resizeMode="contain" />
                </View>
                <Text style={styles.teamCodeTextCompact}>{item.team1.code}</Text>
              </View>

              {/* Center Cloud-Style VS Icon Badge */}
              <View style={styles.cloudVsBox}>
                <View style={styles.cloudVsShape}>
                  <Ionicons name="cloud" size={48} color="#008000" style={styles.cloudBackdropMain} />
                  <Ionicons name="cloud" size={38} color="#16A34A" style={styles.cloudBackdropLeft} />
                  <Ionicons name="cloud" size={34} color="#22C55E" style={styles.cloudBackdropRight} />
                  <Ionicons name="cloud-outline" size={52} color="#DCFCE7" style={styles.cloudOutlineGlow} />
                  <View style={styles.cloudVsPill}>
                    <Text style={styles.cloudVsText}>VS</Text>
                  </View>
                </View>
              </View>

              {/* Team 2 (Right) */}
              <View style={styles.teamColCompact}>
                <View style={styles.logoWrapperCompact}>
                  <Image source={item.team2.logo} style={styles.logoImageCompact} resizeMode="contain" />
                </View>
                <Text style={styles.teamCodeTextCompact}>{item.team2.code}</Text>
              </View>
            </View>

            {/* 3. Bottom Date Bar (Bottom Left: Date / Bottom Right: Details hint) */}
            <View style={styles.datePillBoxCompact}>
              <View style={styles.dateLeftRowCompact}>
                <Ionicons name="calendar" size={13} color="#008000" style={{ marginRight: 5 }} />
                <Text style={styles.datePillTextCompact}>{item.date}</Text>
              </View>
              <View style={styles.tapDetailsHintRowCompact}>
                <Text style={styles.tapDetailsHintTextCompact}>Match Details</Text>
                <Ionicons name="chevron-forward" size={12} color="#008000" />
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* 4. Fixed Bottom Sticky AD Banner */}
      <View style={styles.bottomAdBanner}>
        <View style={styles.adIconBox}>
          <View style={styles.adBallCircle}>
            <Ionicons name="baseball" size={20} color="#DC2626" />
            <View style={styles.adTagPillGreen}>
              <Text style={styles.adTagText}>AD</Text>
            </View>
          </View>
        </View>

        <View style={styles.adTextBox}>
          <Text style={styles.adTitle} numberOfLines={1}>IPL Live Matches</Text>
          <Text style={styles.adSubtitle} numberOfLines={1}>
            Watch live Cricket matches on your phone. Don't
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

  /* Top Sub Header AD Banner */
  adBannerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
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
  adBallCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FEF2F2',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  adTagPillGreen: {
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

  /* Sub-Tab Navigation Bar matching Screenshot 3 */
  tabsContainer: {
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  tabsRow: {
    flexDirection: 'row',
    backgroundColor: '#EFEFEF',
    borderRadius: 22,
    padding: 4,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 18,
  },
  activeTabButton: {
    backgroundColor: '#008000',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#4B5563',
  },
  activeTabText: {
    color: '#FFFFFF',
    fontWeight: '900',
  },
  redNotificationDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#EF4444',
    marginLeft: 4,
    marginTop: -6,
  },

  /* Scrollable Match Cards List */
  scrollContent: {
    flex: 1,
    paddingHorizontal: 16,
  },
  scrollInner: {
    paddingTop: 4,
    paddingBottom: 24,
  },

  /* Match Card */
  matchCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: '#008000',
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  matchCardHeader: {
    backgroundColor: '#008000',
    paddingVertical: 8,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  stadiumNameText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
    flex: 1,
    marginRight: 8,
  },
  timePill: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderRadius: 14,
  },
  timePillText: {
    color: '#008000',
    fontSize: 13,
    fontWeight: '900',
  },
  matchupRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: 16,
    paddingHorizontal: 10,
  },
  teamCol: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 90,
  },
  logoWrapper: {
    width: 80,
    height: 54,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  logoImage: {
    width: '100%',
    height: '100%',
  },
  teamCodeText: {
    fontSize: 15,
    fontWeight: '900',
    color: '#000000',
  },
  teamFullName: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
    textAlign: 'center',
    marginTop: 2,
  },
  vsBadge: {
    backgroundColor: '#008000',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 8,
  },
  vsBadgeText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '900',
  },
  vsBadgeLarge: {
    backgroundColor: '#008000',
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 10,
  },
  vsBadgeTextLarge: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
  },
  datePillBox: {
    backgroundColor: '#EFEFEF',
    borderRadius: 14,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 14,
    marginBottom: 12,
    flexDirection: 'row',
  },
  datePillBoxWithHint: {
    backgroundColor: '#EFEFEF',
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 14,
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 14,
    marginBottom: 12,
    flexDirection: 'row',
  },
  datePillText: {
    color: '#000000',
    fontSize: 14,
    fontWeight: '700',
  },
  tapDetailsHintRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#008000',
  },
  tapDetailsHintText: {
    color: '#008000',
    fontSize: 11,
    fontWeight: '800',
    marginRight: 2,
  },

  /* Selected Match Detail Styles */
  matchCardDetailHeader: {
    backgroundColor: '#008000',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  matchupBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: '#008000',
    padding: 14,
    marginBottom: 16,
  },
  matchNoTag: {
    fontSize: 12,
    fontWeight: '800',
    color: '#008000',
    textAlign: 'center',
    textTransform: 'uppercase',
    marginBottom: 8,
  },

  /* Predictor Bar */
  predictorBox: {
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  predictorHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  predictorTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0F172A',
  },
  predictorRatioText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#008000',
  },
  barContainer: {
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E2E8F0',
    flexDirection: 'row',
    overflow: 'hidden',
  },
  barFillLeft: {
    backgroundColor: '#008000',
  },
  barFillRight: {
    backgroundColor: '#DC2626',
  },

  /* Detail Section Cards */
  detailSectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    padding: 16,
    marginBottom: 14,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitleText: {
    fontSize: 15,
    fontWeight: '900',
    color: '#0F172A',
    marginLeft: 8,
  },
  infoGridRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 10,
  },
  infoGridBox: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  infoLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
    marginTop: 4,
  },
  infoValue: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 2,
  },
  pitchReportBox: {
    backgroundColor: '#F0FDF4',
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  pitchReportLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: '#166534',
    marginBottom: 2,
  },
  pitchReportText: {
    fontSize: 12,
    color: '#15803D',
    fontWeight: '500',
    lineHeight: 16,
  },

  /* Head to Head Stats */
  h2hRow: {
    flexDirection: 'row',
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  h2hStatBox: {
    flex: 1,
    alignItems: 'center',
  },
  h2hNumber: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0F172A',
  },
  h2hLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
    marginTop: 2,
  },

  /* Squad Toggle */
  squadToggleRow: {
    flexDirection: 'row',
    backgroundColor: '#EFEFEF',
    borderRadius: 12,
    padding: 3,
    marginBottom: 12,
  },
  squadTabPill: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 10,
  },
  squadTabPillActive: {
    backgroundColor: '#008000',
  },
  squadTabPillText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#4B5563',
  },
  squadTabPillTextActive: {
    color: '#FFFFFF',
  },
  squadListGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  playerItemRow: {
    width: '50%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
    paddingRight: 4,
  },
  playerDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#008000',
    marginRight: 6,
  },
  playerNameText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1E293B',
  },

  /* Action Buttons */
  actionButtonsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 4,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 14,
  },
  actionBtnOutline: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#008000',
  },
  actionBtnActive: {
    backgroundColor: '#008000',
  },
  actionBtnGreen: {
    backgroundColor: '#008000',
  },
  actionBtnText: {
    fontSize: 13,
    fontWeight: '800',
  },
  actionBtnTextOutline: {
    color: '#008000',
  },
  actionBtnTextActive: {
    color: '#FFFFFF',
  },

  /* Recent Encounters */
  recentSectionHeader: {
    fontSize: 15,
    fontWeight: '900',
    color: '#0F172A',
    marginBottom: 12,
  },
  recentMatchCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    padding: 14,
    marginBottom: 10,
  },
  recentHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  recentDateText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
  },
  recentResultPill: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  recentResultPillText: {
    fontSize: 11,
    fontWeight: '900',
    color: '#16A34A',
  },
  recentScoreText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
  },

  /* Fixed Bottom Sticky AD Banner */
  bottomAdBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },

  /* Live Tab Styles */
  liveBadgeBannerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FCA5A5',
    marginBottom: 12,
  },
  livePulseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
    marginRight: 8,
  },
  liveBadgeBannerText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#DC2626',
  },
  liveScoreMainCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: '#008000',
    padding: 16,
    marginBottom: 14,
  },
  liveTeamRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginVertical: 8,
  },
  liveScoreBigText: {
    fontSize: 16,
    fontWeight: '900',
    color: '#008000',
    marginTop: 4,
  },
  liveOversText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
  },
  vsBadgeCircleBig: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#008000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  vsTextBig: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '900',
  },
  rrInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  rrInfoText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
  },
  rrVal: {
    fontWeight: '900',
    color: '#008000',
  },
  batterRowHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    paddingBottom: 6,
    marginBottom: 8,
  },
  batterColHeader: {
    fontSize: 11,
    fontWeight: '800',
    color: '#64748B',
    flex: 1,
    textAlign: 'center',
  },
  batterRowItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
  },
  batterNameText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0F172A',
  },
  batterValText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#0F172A',
    flex: 1,
    textAlign: 'center',
  },
  batterSubValText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
    flex: 1,
    textAlign: 'center',
  },
  bowlerDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  bowlerNameText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
  },
  bowlerFigText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#008000',
  },
  ballsTimelineRow: {
    flexDirection: 'row',
    gap: 8,
  },
  ballBubble: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  ballBubbleWicket: {
    backgroundColor: '#DC2626',
    borderColor: '#B91C1C',
  },
  ballBubbleBoundary: {
    backgroundColor: '#16A34A',
    borderColor: '#15803D',
  },
  ballBubbleText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#1E293B',
  },

  /* NEW HIGH-AESTHETIC IPL SCHEDULE CARD STYLES */
  matchCardNew: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1.8,
    borderColor: '#008000',
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  cardHeaderNew: {
    backgroundColor: '#007A3B',
    paddingVertical: 9,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  matchNoBadgeNew: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  matchNoTextNew: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 0.3,
  },
  timeBadgeNew: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 3.5,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeBadgeTextNew: {
    color: '#007A3B',
    fontSize: 12,
    fontWeight: '900',
  },
  venueRowNew: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#DCFCE7',
  },
  venueTextNew: {
    fontSize: 12,
    fontWeight: '800',
    color: '#166534',
    flex: 1,
  },
  matchupBodyNew: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: 14,
    paddingHorizontal: 12,
  },
  teamColNew: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 100,
  },
  logoContainerNew: {
    width: 76,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  logoImgNew: {
    width: '100%',
    height: '100%',
  },
  teamCodeNew: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: -0.3,
  },
  teamNameNew: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
    textAlign: 'center',
    marginTop: 1,
  },
  vsBadgeWrapperNew: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  vsCircleOuterNew: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#008000',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#DCFCE7',
    shadowColor: '#008000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  vsTextNew: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '900',
  },
  winRatioBarMini: {
    marginTop: 6,
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  winRatioTextMini: {
    fontSize: 10,
    fontWeight: '800',
    color: '#008000',
  },
  highlightsStripNew: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8FAFC',
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 10,
  },
  highlightPillNew: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  highlightTextNew: {
    fontSize: 11,
    fontWeight: '700',
    color: '#475569',
  },
  highlightDotDivider: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#CBD5E1',
    marginHorizontal: 10,
  },
  cardFooterNew: {
    backgroundColor: '#EFEFEF',
    borderRadius: 14,
    paddingVertical: 9,
    paddingHorizontal: 14,
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 12,
    marginBottom: 12,
    flexDirection: 'row',
  },
  dateGroupNew: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateTextNew: {
    color: '#0F172A',
    fontSize: 13,
    fontWeight: '800',
  },
  detailsBtnPillNew: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1.2,
    borderColor: '#008000',
    shadowColor: '#008000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  detailsBtnTextNew: {
    color: '#008000',
    fontSize: 12,
    fontWeight: '900',
  },

  /* COMPACT CLOUD-STYLE VS MATCH CARD STYLES */
  matchCardCompact: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#008000',
    overflow: 'hidden',
    marginBottom: 12,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 5,
    elevation: 3,
  },
  matchCardHeaderCompact: {
    backgroundColor: '#008000',
    paddingVertical: 6,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLeftRowCompact: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
  },
  stadiumNameTextCompact: {
    color: '#FFFFFF',
    fontSize: 12.5,
    fontWeight: '800',
    flex: 1,
  },
  timePillCompact: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  timePillTextCompact: {
    color: '#008000',
    fontSize: 11.5,
    fontWeight: '900',
  },
  matchupRowCompact: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  teamColCompact: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 85,
  },
  logoWrapperCompact: {
    width: 60,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 3,
  },
  logoImageCompact: {
    width: '100%',
    height: '100%',
  },
  teamCodeTextCompact: {
    fontSize: 14,
    fontWeight: '900',
    color: '#0F172A',
  },
  cloudVsBox: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 80,
    height: 52,
  },
  cloudVsShape: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    width: 72,
    height: 46,
  },
  cloudBackdropMain: {
    position: 'absolute',
    opacity: 0.22,
    top: -4,
  },
  cloudBackdropLeft: {
    position: 'absolute',
    opacity: 0.35,
    top: 2,
    left: -8,
  },
  cloudBackdropRight: {
    position: 'absolute',
    opacity: 0.30,
    top: 4,
    right: -8,
  },
  cloudOutlineGlow: {
    position: 'absolute',
    opacity: 0.45,
    top: -5,
  },
  cloudVsPill: {
    backgroundColor: '#008000',
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#DCFCE7',
    shadowColor: '#008000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.35,
    shadowRadius: 5,
    elevation: 4,
    zIndex: 10,
  },
  cloudVsText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 0.8,
  },
  datePillBoxCompact: {
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    paddingVertical: 7,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 10,
    marginBottom: 9,
    flexDirection: 'row',
  },
  dateLeftRowCompact: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  datePillTextCompact: {
    color: '#1E293B',
    fontSize: 12.5,
    fontWeight: '700',
  },
  tapDetailsHintRowCompact: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#16A34A',
  },
  tapDetailsHintTextCompact: {
    color: '#16A34A',
    fontSize: 10.5,
    fontWeight: '800',
    marginRight: 2,
  },
});

