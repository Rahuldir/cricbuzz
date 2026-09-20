import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  Modal,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { getIplPointTable } from '../services/cricketApi';
import { TeamFlag } from '../utils/flagHelper';
import { SkeletonBox } from '../components/ShimmerSkeleton';
import EmptyStateView from '../components/EmptyStateView';

export default function PointsTableScreen({ onBack }) {
  const { theme } = useTheme();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [pointsTable, setPointsTable] = useState([]);
  const [selectedYear, setSelectedYear] = useState('2024');
  const [yearDrawerVisible, setYearDrawerVisible] = useState(false);

  const allYears = [
    '2008', '2009', '2010', '2011', '2012', '2013', '2014', '2015',
    '2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023', '2024', '2025', '2026'
  ];

  const loadPointsTable = useCallback(async (yearToFetch = selectedYear, isSilent = false) => {
    if (!isSilent) setLoading(true);
    try {
      const res = await getIplPointTable(yearToFetch);
      setPointsTable(res.pointsTable || []);
      if (res.year) {
        setSelectedYear(res.year);
      }
    } catch (err) {
      console.warn('Points Table fetch err:', err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [selectedYear]);

  useEffect(() => {
    loadPointsTable(selectedYear);
    const timer = setInterval(() => {
      loadPointsTable(selectedYear, true);
    }, 45000);
    return () => clearInterval(timer);
  }, [loadPointsTable, selectedYear]);

  const onRefresh = () => {
    setRefreshing(true);
    loadPointsTable(selectedYear);
  };

  const onSelectYear = (yr) => {
    setSelectedYear(yr);
    setYearDrawerVisible(false);
    loadPointsTable(yr);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right', 'bottom']}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* 1. Header Matching Screenshots 1 & 5 */}
      <View style={styles.topHeaderBar}>
        <TouchableOpacity onPress={onBack} style={styles.backButton} activeOpacity={0.7}>
          <Ionicons name="chevron-back" size={28} color="#000000" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Point Table</Text>

        {/* Top Right Circular AD Badge with Wickets/Ball Graphic */}
        <TouchableOpacity
          onPress={() => setYearDrawerVisible(true)}
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
          <TouchableOpacity onPress={() => setYearDrawerVisible(true)} style={styles.adRedBallCircle}>
            <Ionicons name="baseball" size={18} color="#DC2626" />
            <View style={styles.adBadgePillGreen}>
              <Text style={styles.adBadgeText}>AD</Text>
            </View>
          </TouchableOpacity>
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

      {/* Year Selector Bar Trigger */}
      <View style={styles.yearSelectorRow}>
        <TouchableOpacity
          onPress={() => setYearDrawerVisible(true)}
          style={styles.yearTriggerBtn}
          activeOpacity={0.8}
        >
          <Ionicons name="calendar-outline" size={16} color="#008000" style={{ marginRight: 6 }} />
          <Text style={styles.yearTriggerText}>Season: IPL {selectedYear}</Text>
          <Ionicons name="chevron-down" size={16} color="#008000" style={{ marginLeft: 6 }} />
        </TouchableOpacity>
      </View>

      {/* 3. Main Points Table */}
      {loading ? (
        <ScrollView className="flex-1 px-4 mt-2" showsVerticalScrollIndicator={false}>
          <View className="flex-row justify-center items-center py-4">
            <ActivityIndicator size="small" color="#008000" style={{ marginRight: 8 }} />
            <Text style={{ color: '#008000' }} className="text-xs font-bold tracking-wide">
              FETCHING IPL {selectedYear} STANDINGS...
            </Text>
          </View>
          <SkeletonBox width={'100%'} height={300} borderRadius={12} />
        </ScrollView>
      ) : (
        <ScrollView
          style={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#008000"
              colors={['#008000', '#10B981', '#009270']}
            />
          }
        >
          {pointsTable.length === 0 ? (
            <EmptyStateView type="general" onRefresh={onRefresh} actionLabel="Reload Standings" />
          ) : (
            <View style={styles.tableContainer}>
              {/* Solid Green Table Header Row (Exact match Screenshot 1 & 5) */}
              <View style={styles.tableHeaderRow}>
                <Text style={[styles.tableHeaderCell, { flex: 1.8, textAlign: 'left', paddingLeft: 8 }]}>Team</Text>
                <Text style={[styles.tableHeaderCell, { flex: 1, textAlign: 'center' }]}>Loss</Text>
                <Text style={[styles.tableHeaderCell, { flex: 1, textAlign: 'center' }]}>Match</Text>
                <Text style={[styles.tableHeaderCell, { flex: 1, textAlign: 'center' }]}>Points</Text>
                <Text style={[styles.tableHeaderCell, { flex: 1.2, textAlign: 'center' }]}>Nt.Rate</Text>
              </View>

              {/* Table Data Rows */}
              {pointsTable.map((item, idx) => (
                <View key={item.rank || idx} style={styles.tableDataRow}>
                  {/* Team Logo & Code */}
                  <View style={{ flex: 1.8, flexDirection: 'row', alignItems: 'center', paddingLeft: 8 }}>
                    <TeamFlag
                      logo={item.logo}
                      teamName={item.team}
                      countryCode={item.shortName}
                      size={24}
                      style={{ marginRight: 6 }}
                    />
                    <Text style={styles.teamCodeText} numberOfLines={1}>
                      {item.shortName || item.team}
                    </Text>
                  </View>

                  {/* Loss */}
                  <Text style={[styles.tableDataCell, { flex: 1, textAlign: 'center' }]}>
                    {item.lost}
                  </Text>

                  {/* Match */}
                  <Text style={[styles.tableDataCell, { flex: 1, textAlign: 'center' }]}>
                    {item.played}
                  </Text>

                  {/* Points */}
                  <Text style={[styles.tableDataCell, { flex: 1, textAlign: 'center', fontWeight: '800' }]}>
                    {item.points}
                  </Text>

                  {/* Nt.Rate */}
                  <Text style={[styles.tableDataCell, { flex: 1.2, textAlign: 'center', color: '#334155' }]}>
                    {item.nrr}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </ScrollView>
      )}

      {/* 4. Bottom Ad Banner (Exact match Screenshot 1 & 5) */}
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

      {/* 5. Left Vertical Year Drawer Modal (Exact match Screenshots 1 & 5) */}
      <Modal visible={yearDrawerVisible} animationType="fade" transparent={true} onRequestClose={() => setYearDrawerVisible(false)}>
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setYearDrawerVisible(false)}>
          <View style={styles.drawerContent}>
            <Text style={styles.drawerTitle}>Select Season</Text>
            <ScrollView showsVerticalScrollIndicator={false}>
              {allYears.map((yr) => {
                const isSelected = selectedYear === yr;
                return (
                  <TouchableOpacity
                    key={yr}
                    onPress={() => onSelectYear(yr)}
                    style={[styles.yearDrawerItem, isSelected && styles.yearDrawerItemSelected]}
                  >
                    <Text style={[styles.yearDrawerItemText, isSelected && styles.yearDrawerItemTextSelected]}>
                      {yr}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
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
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  adIconBox: {
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
  yearSelectorRow: {
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  yearTriggerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#ECFDF3',
    borderWidth: 1,
    borderColor: '#15803D',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  yearTriggerText: {
    color: '#008000',
    fontSize: 13,
    fontWeight: '800',
  },
  scrollContent: {
    flex: 1,
  },
  tableContainer: {
    marginHorizontal: 16,
    marginTop: 4,
    marginBottom: 20,
  },
  tableHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#008000',
    paddingVertical: 12,
    paddingHorizontal: 4,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  tableHeaderCell: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  tableDataRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
  },
  teamCodeText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
  },
  tableDataCell: {
    fontSize: 14,
    color: '#000000',
    fontWeight: '600',
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
  },
  drawerContent: {
    width: 140,
    maxHeight: '75%',
    backgroundColor: '#FAF5FF',
    marginLeft: 16,
    borderRadius: 16,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#E9D5FF',
  },
  drawerTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: '#6B21A8',
    textAlign: 'center',
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F3E8FF',
    paddingBottom: 6,
  },
  yearDrawerItem: {
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  yearDrawerItemSelected: {
    backgroundColor: '#E9D5FF',
  },
  yearDrawerItemText: {
    fontSize: 16,
    color: '#334155',
    fontWeight: '600',
  },
  yearDrawerItemTextSelected: {
    color: '#008000',
    fontWeight: '900',
  },
});
