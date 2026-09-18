import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  RefreshControl,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { getIplPlayoff } from '../services/cricketApi';
import { SkeletonBox } from '../components/ShimmerSkeleton';
import EmptyStateView from '../components/EmptyStateView';

const { width } = Dimensions.get('window');

export default function PlayoffsScreen() {
  const { theme } = useTheme();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [playoffs, setPlayoffs] = useState([]);
  const [playoffImages, setPlayoffImages] = useState([]);

  const loadPlayoffs = useCallback(async (isSilent = false) => {
    if (!isSilent) setLoading(true);
    try {
      const res = await getIplPlayoff();
      setPlayoffs(res.playoffs || []);
      setPlayoffImages(res.playoffImages || []);
    } catch (err) {
      console.warn('Playoffs fetch err:', err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadPlayoffs();
    const timer = setInterval(() => loadPlayoffs(true), 60000);
    return () => clearInterval(timer);
  }, [loadPlayoffs]);

  const onRefresh = () => {
    setRefreshing(true);
    loadPlayoffs();
  };

  return (
    <View style={{ backgroundColor: theme.bg }} className="flex-1">
      {/* Header Banner */}
      <View
        style={{ backgroundColor: theme.card, borderColor: theme.cardBorder }}
        className="px-4 pt-3 pb-3 border-b shadow-xs"
      >
        <View className="flex-row justify-between items-center">
          <View className="flex-row items-center space-x-2">
            <View className="w-8 h-8 rounded-lg bg-amber-500/20 items-center justify-center mr-2">
              <Ionicons name="trophy" size={18} color="#F59E0B" />
            </View>
            <View>
              <Text style={{ color: theme.text }} className="font-black text-base tracking-wide">
                IPL PLAYOFFS & FINALS
              </Text>
              <Text style={{ color: theme.textMuted }} className="text-[11px]">
                Road to Championship • Live API
              </Text>
            </View>
          </View>

          <View className="flex-row items-center px-2.5 py-1 rounded-full bg-amber-500/20">
            <Text className="text-amber-500 text-[10px] font-black uppercase tracking-wider">
              Playoffs Bracket
            </Text>
          </View>
        </View>
      </View>

      {/* Main Content */}
      {loading ? (
        <ScrollView className="flex-1 px-4 mt-3" showsVerticalScrollIndicator={false}>
          <View className="flex-row justify-center items-center py-3">
            <ActivityIndicator size="small" color={theme.accent} style={{ marginRight: 8 }} />
            <Text style={{ color: theme.accent }} className="text-xs font-bold tracking-wide">
              LOADING PLAYOFFS DATA...
            </Text>
          </View>
          <SkeletonBox width={'100%'} height={140} borderRadius={20} style={{ marginBottom: 16 }} />
          <SkeletonBox width={'100%'} height={140} borderRadius={20} style={{ marginBottom: 16 }} />
        </ScrollView>
      ) : (
        <ScrollView
          className="flex-1 px-4 mt-3"
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={theme.accent}
              colors={[theme.accent, '#10B981', '#009270']}
            />
          }
        >
          {playoffs.length === 0 ? (
            <EmptyStateView
              type="general"
              onRefresh={onRefresh}
              actionLabel="Reload Playoffs"
            />
          ) : (
            <View className="space-y-4 pb-8">
              {playoffs.map((item, idx) => {
                const isFinal = item.stage === 'Grand Final';
                return (
                  <View
                    key={idx}
                    style={{
                      backgroundColor: theme.card,
                      borderColor: isFinal ? '#F59E0B' : theme.cardBorder,
                      borderWidth: isFinal ? 2 : 1,
                    }}
                    className="p-4 rounded-3xl shadow-sm mb-3.5"
                  >
                    {/* Stage Header */}
                    <View
                      className="flex-row justify-between items-center pb-2.5 border-b"
                      style={{ borderColor: theme.divider }}
                    >
                      <View className="flex-row items-center space-x-1.5">
                        <Ionicons
                          name={isFinal ? 'trophy' : 'ribbon'}
                          size={16}
                          color={isFinal ? '#F59E0B' : theme.accent}
                          style={{ marginRight: 4 }}
                        />
                        <Text
                          style={{ color: isFinal ? '#F59E0B' : theme.text }}
                          className="font-black text-sm uppercase tracking-wide"
                        >
                          {item.stage}
                        </Text>
                      </View>

                      <View
                        style={{
                          backgroundColor: isFinal ? '#F59E0B25' : theme.accentLight,
                        }}
                        className="px-2.5 py-0.5 rounded-full"
                      >
                        <Text
                          style={{ color: isFinal ? '#F59E0B' : theme.accent }}
                          className="text-[10px] font-extrabold uppercase"
                        >
                          {item.status}
                        </Text>
                      </View>
                    </View>

                    {/* Teams Matchup */}
                    <View className="py-3.5 flex-row justify-between items-center">
                      <View className="items-center flex-1 pr-1">
                        <Text
                          style={{ color: theme.text }}
                          className="text-sm font-black text-center"
                          numberOfLines={1}
                        >
                          {item.team1}
                        </Text>
                      </View>

                      <View
                        style={{
                          backgroundColor: isFinal ? '#F59E0B20' : theme.inputBg,
                          borderColor: isFinal ? '#F59E0B50' : theme.cardBorder,
                        }}
                        className="w-8 h-8 rounded-full border items-center justify-center mx-2"
                      >
                        <Text
                          style={{ color: isFinal ? '#F59E0B' : theme.textMuted }}
                          className="text-xs font-black"
                        >
                          VS
                        </Text>
                      </View>

                      <View className="items-center flex-1 pl-1">
                        <Text
                          style={{ color: theme.text }}
                          className="text-sm font-black text-center"
                          numberOfLines={1}
                        >
                          {item.team2}
                        </Text>
                      </View>
                    </View>

                    {/* Footer Details */}
                    <View
                      className="pt-2.5 border-t space-y-1.5"
                      style={{ borderColor: theme.divider }}
                    >
                      <View className="flex-row items-center">
                        <Ionicons name="time-outline" size={13} color={theme.textMuted} style={{ marginRight: 5 }} />
                        <Text style={{ color: theme.textSecondary }} className="text-xs font-medium">
                          {item.date}
                        </Text>
                      </View>

                      <View className="flex-row items-center">
                        <Ionicons name="location-outline" size={13} color={theme.textMuted} style={{ marginRight: 5 }} />
                        <Text style={{ color: theme.textMuted }} className="text-xs flex-1" numberOfLines={1}>
                          {item.venue}
                        </Text>
                      </View>

                      <View
                        className="mt-1 pt-1.5 border-t flex-row items-center"
                        style={{ borderColor: theme.cardBorderSubtle }}
                      >
                        <Ionicons
                          name="information-circle-outline"
                          size={13}
                          color={isFinal ? '#F59E0B' : theme.accent}
                          style={{ marginRight: 5 }}
                        />
                        <Text
                          style={{ color: isFinal ? '#F59E0B' : theme.accent }}
                          className="text-[11px] font-semibold flex-1"
                        >
                          {item.note}
                        </Text>
                      </View>
                    </View>
                  </View>
                );
              })}

              {/* Official Playoff Season Images from API */}
              {playoffImages && playoffImages.length > 0 && (
                <View className="mt-2">
                  <Text style={{ color: theme.text }} className="font-extrabold text-sm mb-2 uppercase tracking-wide">
                    Historical Playoff Brackets (API Archive)
                  </Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row -mx-1 px-1">
                    {playoffImages.map((img) => (
                      <View
                        key={img.id}
                        style={{
                          backgroundColor: theme.card,
                          borderColor: theme.cardBorder,
                          width: width * 0.7,
                        }}
                        className="p-2 rounded-2xl border mr-3 shadow-xs"
                      >
                        <Image
                          source={{ uri: img.imageUrl }}
                          style={{ width: '100%', height: 160, borderRadius: 12 }}
                          resizeMode="contain"
                        />
                        <Text style={{ color: theme.textMuted }} className="text-[10px] text-center mt-1">
                          Season Archive #{img.id}
                        </Text>
                      </View>
                    ))}
                  </ScrollView>
                </View>
              )}
            </View>
          )}
        </ScrollView>
      )}
    </View>
  );
}
