import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

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
    venue: 'M. Chinnaswamy Stadium, Bengaluru',
    time: '7:30 PM',
    team1: { code: 'RCB', name: 'Royal Challengers Bengaluru', logo: LOCAL_TEAM_LOGOS.RCB },
    team2: { code: 'SRH', name: 'Sunrisers Hyderabad', logo: LOCAL_TEAM_LOGOS.SRH },
    date: '28-Mar-26,Saturday',
  },
  {
    id: 2,
    venue: 'Wankhede Stadium, Mumbai',
    time: '7:30 PM',
    team1: { code: 'MI', name: 'Mumbai Indians', logo: LOCAL_TEAM_LOGOS.MI },
    team2: { code: 'KKR', name: 'Kolkata Knight Riders', logo: LOCAL_TEAM_LOGOS.KKR },
    date: '29-Mar-26,Sunday',
  },
  {
    id: 3,
    venue: 'Barsapara Stadium, Guwahati',
    time: '7:30 PM',
    team1: { code: 'RR', name: 'Rajasthan Royals', logo: LOCAL_TEAM_LOGOS.RR },
    team2: { code: 'CSK', name: 'Chennai Super Kings', logo: LOCAL_TEAM_LOGOS.CSK },
    date: '07-Apr-26,Tuesday',
  },
  {
    id: 4,
    venue: 'Arun Jaitley Stadium, New Delhi',
    time: '7:30 PM',
    team1: { code: 'DC', name: 'Delhi Capitals', logo: LOCAL_TEAM_LOGOS.DC },
    team2: { code: 'GT', name: 'Gujarat Titans', logo: LOCAL_TEAM_LOGOS.GT },
    date: '08-Apr-26,Wednesday',
  },
  {
    id: 5,
    venue: 'Eden Gardens, Kolkata',
    time: '7:30 PM',
    team1: { code: 'KKR', name: 'Kolkata Knight Riders', logo: LOCAL_TEAM_LOGOS.KKR },
    team2: { code: 'LSG', name: 'Lucknow Super Giants', logo: LOCAL_TEAM_LOGOS.LSG },
    date: '09-Apr-26,Thursday',
  },
  {
    id: 6,
    venue: 'Barsapara Stadium, Guwahati',
    time: '3:30 PM',
    team1: { code: 'RR', name: 'Rajasthan Royals', logo: LOCAL_TEAM_LOGOS.RR },
    team2: { code: 'PBKS', name: 'Punjab Kings', logo: LOCAL_TEAM_LOGOS.PBKS },
    date: '12-Apr-26,Sunday',
  },
];

export default function ScheduleScreen({ onBack }) {
  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right', 'bottom']}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* 1. Top Header Bar Matching Screenshots 2 & 5 */}
      <View style={styles.topHeaderBar}>
        <TouchableOpacity onPress={onBack} style={styles.backButton} activeOpacity={0.7}>
          <Ionicons name="chevron-back" size={28} color="#000000" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>IPL Schedule</Text>

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
          <View key={item.id} style={styles.matchCard}>
            {/* Green Header Bar */}
            <View style={styles.matchCardHeader}>
              <Text style={styles.stadiumNameText} numberOfLines={1}>
                {item.venue}
              </Text>
              <View style={styles.timePill}>
                <Text style={styles.timePillText}>{item.time}</Text>
              </View>
            </View>

            {/* Team Matchup Content */}
            <View style={styles.matchupRow}>
              {/* Team 1 */}
              <View style={styles.teamCol}>
                <View style={styles.logoWrapper}>
                  <Image source={item.team1.logo} style={styles.logoImage} resizeMode="contain" />
                </View>
                <Text style={styles.teamCodeText}>{item.team1.code}</Text>
              </View>

              {/* VS Badge */}
              <View style={styles.vsBadge}>
                <Text style={styles.vsBadgeText}>VS</Text>
              </View>

              {/* Team 2 */}
              <View style={styles.teamCol}>
                <View style={styles.logoWrapper}>
                  <Image source={item.team2.logo} style={styles.logoImage} resizeMode="contain" />
                </View>
                <Text style={styles.teamCodeText}>{item.team2.code}</Text>
              </View>
            </View>

            {/* Bottom Date Pill Container */}
            <View style={styles.datePillBox}>
              <Text style={styles.datePillText}>{item.date}</Text>
            </View>
          </View>
        ))}
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

  /* Top Sub Header AD Banner */
  adBannerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
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
    borderColor: '#E2E8F0',
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  matchCardHeader: {
    backgroundColor: '#007A3B',
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
    paddingHorizontal: 14,
    paddingVertical: 4,
    borderRadius: 14,
  },
  timePillText: {
    color: '#007A3B',
    fontSize: 13,
    fontWeight: '800',
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
  vsBadge: {
    backgroundColor: '#007A3B',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 8,
  },
  vsBadgeText: {
    color: '#FFFFFF',
    fontSize: 14,
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
  },
  datePillText: {
    color: '#000000',
    fontSize: 14,
    fontWeight: '700',
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
