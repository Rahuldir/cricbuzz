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
import {
  getInProgressFixtures,
  getUpcomingFixtures,
  getCompletedFixtures,
} from '../services/cricketApi';
import MatchCenterModal from '../components/MatchCenterModal';
import { TeamFlag } from '../utils/flagHelper';
import EmptyStateView from '../components/EmptyStateView';

export default function MatchesScreen({ onBack }) {
  const { theme } = useTheme();

  const [activeSubTab, setActiveSubTab] = useState('upcoming'); // 'live' | 'recent' | 'upcoming'
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [liveFixtures, setLiveFixtures] = useState([]);
  const [upcomingFixtures, setUpcomingFixtures] = useState([]);
  const [completedFixtures, setCompletedFixtures] = useState([]);

  const [selectedFixture, setSelectedFixture] = useState(null);
  const [matchCenterVisible, setMatchCenterVisible] = useState(false);

  const fetchMatches = useCallback(async (isSilent = false) => {
    if (!isSilent) setLoading(true);
    try {
      const [liveRes, upRes, compRes] = await Promise.all([
        getInProgressFixtures(10),
        getUpcomingFixtures(10),
        getCompletedFixtures(10),
      ]);

      setLiveFixtures(liveRes.fixtures || []);
      setUpcomingFixtures(upRes.fixtures || []);
      setCompletedFixtures(compRes.fixtures || []);
    } catch (err) {
      console.warn('Fetch error:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchMatches();
    const interval = setInterval(() => fetchMatches(true), 30000);
    return () => clearInterval(interval);
  }, [fetchMatches]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchMatches();
  };

  const openFixtureDetail = (fixture) => {
    setSelectedFixture(fixture);
    setMatchCenterVisible(true);
  };

  let displayedFixtures = [];
  if (activeSubTab === 'live') displayedFixtures = liveFixtures;
  else if (activeSubTab === 'upcoming') displayedFixtures = upcomingFixtures;
  else if (activeSubTab === 'recent') displayedFixtures = completedFixtures;

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right', 'bottom']}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* 1. Header Bar Matching Screenshots 2 & 3 */}
      <View style={styles.topHeaderBar}>
        <TouchableOpacity onPress={onBack} style={styles.backButton} activeOpacity={0.7}>
          <Ionicons name="chevron-back" size={28} color="#000000" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Live Score</Text>

        {/* Top Right Circular AD Badge Icon */}
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
          <View style={styles.adTrophyCircle}>
            <Ionicons name="trophy" size={18} color="#D97706" />
            <View style={styles.adTagPillGreen}>
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

      {/* 3. 3-Tab Segmented Navigation Bar (Live | Recent | Upcoming) */}
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

      {/* 4. Content Area */}
      {loading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#008000" />
          <Text style={{ marginTop: 12, fontSize: 13, color: '#64748B', fontWeight: '700' }}>
            Loading Matches...
          </Text>
        </View>
      ) : (
        <ScrollView
          style={styles.scrollContent}
          contentContainerStyle={styles.scrollInner}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#008000"
            />
          }
        >
          {displayedFixtures.length === 0 ? (
            <EmptyStateView
              type={activeSubTab}
              onRefresh={onRefresh}
            />
          ) : (
            <View style={{ paddingBottom: 16 }}>
              {displayedFixtures.map((match) => (
                <TouchableOpacity
                  key={match.fixtureId || match.id}
                  onPress={() => openFixtureDetail(match)}
                  activeOpacity={0.85}
                  style={styles.matchCard}
                >
                  {/* Card Header */}
                  <View style={styles.matchHeader}>
                    <Text style={styles.matchSeriesTitle} numberOfLines={1}>
                      {match.title || match.series || 'IPL 2026 T20'}
                    </Text>
                    <View style={styles.statusBadge}>
                      <Text style={styles.statusBadgeText}>
                        {match.status || 'Scheduled'}
                      </Text>
                    </View>
                  </View>

                  {/* Team Matchup */}
                  <View style={styles.teamsRow}>
                    <View style={styles.teamCol}>
                      <TeamFlag
                        logo={match.team1?.logo}
                        teamName={match.team1?.name}
                        countryCode={match.team1?.shortName}
                        size={28}
                      />
                      <Text style={styles.teamNameText} numberOfLines={1}>
                        {match.team1?.name}
                      </Text>
                      <Text style={styles.scoreText}>
                        {match.team1?.score || '-'}
                      </Text>
                    </View>

                    <View style={styles.vsBadgeCircle}>
                      <Text style={styles.vsText}>VS</Text>
                    </View>

                    <View style={styles.teamCol}>
                      <TeamFlag
                        logo={match.team2?.logo}
                        teamName={match.team2?.name}
                        countryCode={match.team2?.shortName}
                        size={28}
                      />
                      <Text style={styles.teamNameText} numberOfLines={1}>
                        {match.team2?.name}
                      </Text>
                      <Text style={styles.scoreText}>
                        {match.team2?.score || '-'}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.matchFooter}>
                    <Text style={styles.matchVenueText} numberOfLines={1}>
                      {match.venue || match.matchDate || 'Matches from Ground'}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </ScrollView>
      )}

      {/* 5. Fixed Bottom Sticky AD Banner */}
      <View style={styles.bottomAdBanner}>
        <View style={styles.adIconBox}>
          <View style={styles.adRedBallCircle}>
            <Ionicons name="baseball" size={20} color="#DC2626" />
            <View style={styles.adTagPillGreen}>
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

      {/* Match Center Modal */}
      <MatchCenterModal
        visible={matchCenterVisible}
        fixture={selectedFixture}
        onClose={() => setMatchCenterVisible(false)}
      />
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

  /* Top Sub Header Banner */
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
  adTrophyCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FEF3C7',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  adRedBallCircle: {
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

  /* Sub-Tab Navigation Bar */
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

  /* Scroll Area */
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
    borderWidth: 1.5,
    borderColor: '#008000',
    borderRadius: 18,
    padding: 14,
    marginBottom: 12,
  },
  matchHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    paddingBottom: 6,
  },
  matchSeriesTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
    flex: 1,
  },
  statusBadge: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  statusBadgeText: {
    color: '#16A34A',
    fontSize: 10,
    fontWeight: '900',
  },
  teamsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  teamCol: {
    flex: 1,
    alignItems: 'center',
  },
  teamNameText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 4,
  },
  scoreText: {
    fontSize: 14,
    fontWeight: '900',
    color: '#008000',
    marginTop: 2,
  },
  vsBadgeCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#008000',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 8,
  },
  vsText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '900',
  },
  matchFooter: {
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 6,
  },
  matchVenueText: {
    fontSize: 11,
    color: '#64748B',
    textAlign: 'center',
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
});
