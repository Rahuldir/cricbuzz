import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { getIplPlayoff } from '../services/cricketApi';
import { TeamFlag } from '../utils/flagHelper';

const PLAYOFF_YEARS = [
  {
    year: '2011',
    q1: { t1: 'Royal Challengers Bangalore', c1: 'RCB', t2: 'Chennai Super Kings', c2: 'CSK', date: 'Qualifier 1, May 24', venue: 'Wankhede Stadium, Mumbai', winner: 'CSK' },
    elim: { t1: 'Kolkata Knight Riders', c1: 'KKR', t2: 'Mumbai Indians', c2: 'MI', date: 'Eliminator, May 25', venue: 'Wankhede Stadium, Mumbai', winner: 'MI' },
    q2: { t1: 'Royal Challengers Bangalore', c1: 'RCB', t2: 'Mumbai Indians', c2: 'MI', date: 'Qualifier 2, May 27', venue: 'MA Chidambaram Stadium, Chennai', winner: 'RCB' },
    final: { t1: 'Chennai Super Kings', c1: 'CSK', t2: 'Royal Challengers Bangalore', c2: 'RCB', date: 'Final, May 28', venue: 'MA Chidambaram Stadium, Chennai', winner: 'CSK' },
  },
  {
    year: '2012',
    q1: { t1: 'Delhi Daredevils', c1: 'DD', t2: 'Kolkata Knight Riders', c2: 'KKR', date: 'Qualifier 1, May 22', venue: 'Subrata Roy Sahara Stadium, Pune', winner: 'KKR' },
    elim: { t1: 'Mumbai Indians', c1: 'MI', t2: 'Chennai Super Kings', c2: 'CSK', date: 'Eliminator, May 23', venue: 'M. Chinnaswamy Stadium, Bengaluru', winner: 'CSK' },
    q2: { t1: 'Delhi Daredevils', c1: 'DD', t2: 'Chennai Super Kings', c2: 'CSK', date: 'Qualifier 2, May 25', venue: 'MA Chidambaram Stadium, Chennai', winner: 'CSK' },
    final: { t1: 'Kolkata Knight Riders', c1: 'KKR', t2: 'Chennai Super Kings', c2: 'CSK', date: 'Final, May 27', venue: 'MA Chidambaram Stadium, Chennai', winner: 'KKR' },
  },
  {
    year: '2013',
    q1: { t1: 'Chennai Super Kings', c1: 'CSK', t2: 'Mumbai Indians', c2: 'MI', date: 'Qualifier 1, May 21', venue: 'Feroz Shah Kotla, Delhi', winner: 'CSK' },
    elim: { t1: 'Rajasthan Royals', c1: 'RR', t2: 'Sunrisers Hyderabad', c2: 'SRH', date: 'Eliminator, May 22', venue: 'Feroz Shah Kotla, Delhi', winner: 'RR' },
    q2: { t1: 'Mumbai Indians', c1: 'MI', t2: 'Rajasthan Royals', c2: 'RR', date: 'Qualifier 2, May 24', venue: 'Eden Gardens, Kolkata', winner: 'MI' },
    final: { t1: 'Chennai Super Kings', c1: 'CSK', t2: 'Mumbai Indians', c2: 'MI', date: 'Final, May 26', venue: 'Eden Gardens, Kolkata', winner: 'MI' },
  },
  {
    year: '2014',
    q1: { t1: 'Kings XI Punjab', c1: 'KXIP', t2: 'Kolkata Knight Riders', c2: 'KKR', date: 'Qualifier 1, May 28', venue: 'Eden Gardens, Kolkata', winner: 'KKR' },
    elim: { t1: 'Chennai Super Kings', c1: 'CSK', t2: 'Mumbai Indians', c2: 'MI', date: 'Eliminator, May 28', venue: 'Brabourne Stadium, Mumbai', winner: 'CSK' },
    q2: { t1: 'Kings XI Punjab', c1: 'KXIP', t2: 'Chennai Super Kings', c2: 'CSK', date: 'Qualifier 2, May 30', venue: 'Wankhede Stadium, Mumbai', winner: 'KXIP' },
    final: { t1: 'Kolkata Knight Riders', c1: 'KKR', t2: 'Kings XI Punjab', c2: 'KXIP', date: 'Final, Jun 01', venue: 'M. Chinnaswamy Stadium, Bengaluru', winner: 'KKR' },
  },
];

export default function PlayoffsScreen({ onBack }) {
  const { theme } = useTheme();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [playoffs, setPlayoffs] = useState([]);

  const loadPlayoffs = useCallback(async (isSilent = false) => {
    if (!isSilent) setLoading(true);
    try {
      const res = await getIplPlayoff();
      setPlayoffs(res.playoffs || []);
    } catch (err) {
      console.warn('Playoffs fetch err:', err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadPlayoffs();
  }, [loadPlayoffs]);

  const onRefresh = () => {
    setRefreshing(true);
    loadPlayoffs();
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right', 'bottom']}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* 1. Header Matching Screenshots 3 & 4 */}
      <View style={styles.topHeaderBar}>
        <TouchableOpacity onPress={onBack} style={styles.backButton} activeOpacity={0.7}>
          <Ionicons name="chevron-back" size={28} color="#000000" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>PlayOff History</Text>

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

      {/* 2. Top Sub-Header AD Card (Exact match Screenshot 3 & 4) */}
      <View style={styles.adBannerCard}>
        <View style={styles.adIconBox}>
          <View style={styles.adBallBlueCircle}>
            <Ionicons name="baseball" size={18} color="#0284C7" />
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

      {/* 3. PlayOff History Year Cards List */}
      <ScrollView
        style={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#008000"
            colors={['#008000', '#10B981']}
          />
        }
      >
        {PLAYOFF_YEARS.map((item) => (
          <View key={item.year} style={styles.yearCardContainer}>
            {/* Green Year Header Banner */}
            <View style={styles.yearHeaderBanner}>
              <Text style={styles.yearHeaderText}>{item.year}</Text>
            </View>

            {/* Playoff Tree Bracket Content */}
            <View style={styles.bracketBox}>
              {/* Qualifier 1 & Eliminator Box (Left Column) */}
              <View style={styles.bracketColumn}>
                {/* Q1 Item */}
                <View style={styles.matchPillBox}>
                  <View style={styles.teamPillRed}>
                    <Text style={styles.teamPillText}>{item.q1.t1}</Text>
                  </View>
                  <View style={styles.stageDatePill}>
                    <Text style={styles.stageDateText}>{item.q1.date}</Text>
                  </View>
                  <View style={styles.teamPillBlue}>
                    <Text style={styles.teamPillText}>{item.q1.t2}</Text>
                  </View>
                </View>

                {/* Eliminator Item */}
                <View style={[styles.matchPillBox, { marginTop: 14 }]}>
                  <View style={styles.teamPillBlue}>
                    <Text style={styles.teamPillText}>{item.elim.t1}</Text>
                  </View>
                  <View style={styles.stageDatePill}>
                    <Text style={styles.stageDateText}>{item.elim.date}</Text>
                  </View>
                  <View style={styles.teamPillYellow}>
                    <Text style={styles.teamPillText}>{item.elim.t2}</Text>
                  </View>
                </View>
              </View>

              {/* Qualifier 2 Box (Middle Column) */}
              <View style={styles.bracketColumnMiddle}>
                <View style={styles.matchPillBox}>
                  <View style={styles.teamPillRed}>
                    <Text style={styles.teamPillText}>{item.q2.t1}</Text>
                  </View>
                  <View style={styles.stageDatePill}>
                    <Text style={styles.stageDateText}>{item.q2.date}</Text>
                  </View>
                  <View style={styles.teamPillYellow}>
                    <Text style={styles.teamPillText}>{item.q2.t2}</Text>
                  </View>
                </View>
              </View>

              {/* Final Box & Trophy (Right Column) */}
              <View style={styles.bracketColumnRight}>
                <View style={styles.trophyIconWrap}>
                  <Ionicons name="trophy" size={28} color="#FFD700" />
                </View>
                <View style={styles.matchPillBox}>
                  <View style={styles.teamPillYellow}>
                    <Text style={styles.teamPillText}>{item.final.t1}</Text>
                  </View>
                  <View style={styles.stageDatePill}>
                    <Text style={styles.stageDateText}>{item.final.date}</Text>
                  </View>
                  <View style={styles.teamPillRed}>
                    <Text style={styles.teamPillText}>{item.final.t2}</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* 4. Bottom Ad Banner */}
      <View style={styles.bottomAdBanner}>
        <View style={styles.adIconBox}>
          <View style={styles.adBallRedCircle}>
            <Ionicons name="baseball" size={20} color="#DC2626" />
            <View style={styles.adBadgePillGreen}>
              <Text style={styles.adBadgeText}>AD</Text>
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
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  adIconBox: {
    marginRight: 10,
  },
  adBallBlueCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
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
  scrollContent: {
    flex: 1,
    paddingHorizontal: 16,
  },
  yearCardContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#008000',
    marginBottom: 16,
    overflow: 'hidden',
  },
  yearHeaderBanner: {
    backgroundColor: '#008000',
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  yearHeaderText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '900',
  },
  bracketBox: {
    backgroundColor: '#0F172A',
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bracketColumn: {
    flex: 1,
    marginRight: 4,
  },
  bracketColumnMiddle: {
    flex: 1,
    marginHorizontal: 2,
  },
  bracketColumnRight: {
    flex: 1,
    marginLeft: 4,
    alignItems: 'center',
  },
  trophyIconWrap: {
    marginBottom: 4,
  },
  matchPillBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 8,
    padding: 3,
  },
  teamPillRed: {
    backgroundColor: '#DC2626',
    paddingVertical: 3,
    paddingHorizontal: 4,
    borderRadius: 4,
  },
  teamPillBlue: {
    backgroundColor: '#0284C7',
    paddingVertical: 3,
    paddingHorizontal: 4,
    borderRadius: 4,
  },
  teamPillYellow: {
    backgroundColor: '#D97706',
    paddingVertical: 3,
    paddingHorizontal: 4,
    borderRadius: 4,
  },
  teamPillText: {
    color: '#FFFFFF',
    fontSize: 8,
    fontWeight: '800',
    textAlign: 'center',
  },
  stageDatePill: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 2,
    marginVertical: 2,
    borderRadius: 4,
  },
  stageDateText: {
    color: '#0F172A',
    fontSize: 7,
    fontWeight: '800',
    textAlign: 'center',
  },
  bottomAdBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  adBallRedCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FEF2F2',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
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
});
