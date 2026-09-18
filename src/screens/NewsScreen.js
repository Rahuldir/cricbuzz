import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { getCricketNews } from '../services/cricketApi';
import EmptyStateView from '../components/EmptyStateView';

export default function NewsScreen() {
  const { theme } = useTheme();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [newsList, setNewsList] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');

  const loadNews = useCallback(async (isSilent = false) => {
    if (!isSilent) setLoading(true);
    try {
      const res = await getCricketNews();
      setNewsList(res.news || []);
    } catch (err) {
      console.warn('News fetch err:', err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadNews();
  }, [loadNews]);

  const onRefresh = () => {
    setRefreshing(true);
    loadNews();
  };

  const categories = ['All', ...new Set(newsList.map((n) => n.category).filter(Boolean))];

  const filteredNews = activeCategory === 'All'
    ? newsList
    : newsList.filter((n) => n.category === activeCategory);

  return (
    <View style={{ backgroundColor: theme.bg }} className="flex-1">
      {/* Category Pills */}
      {categories.length > 1 && (
        <View className="py-2.5 px-4 bg-slate-100 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="space-x-2">
            {categories.map((cat) => {
              const isActive = activeCategory === cat;
              return (
                <TouchableOpacity
                  key={cat}
                  onPress={() => setActiveCategory(cat)}
                  style={{
                    backgroundColor: isActive ? theme.accent : theme.card,
                    borderColor: isActive ? theme.accent : theme.cardBorder,
                  }}
                  className="px-3.5 py-1.5 rounded-full border mr-2"
                  activeOpacity={0.7}
                >
                  <Text
                    style={{
                      color: isActive ? '#FFFFFF' : theme.text,
                      fontWeight: isActive ? '800' : '600',
                    }}
                    className="text-xs"
                  >
                    {cat}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      )}

      {loading ? (
        <View className="flex-1 items-center justify-center py-16">
          <ActivityIndicator size="large" color={theme.accent} />
          <Text style={{ color: theme.textMuted }} className="text-xs font-semibold mt-3">
            Loading Cricket News...
          </Text>
        </View>
      ) : (
        <ScrollView
          className="flex-1 px-4 pt-3"
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={theme.accent}
            />
          }
        >
          {filteredNews.length === 0 ? (
            <EmptyStateView
              type="news"
              onRefresh={onRefresh}
              actionLabel="Reload News"
            />
          ) : (
            <>
              {/* Featured Big News Banner */}
              <TouchableOpacity
                style={{
                  backgroundColor: theme.card,
                  borderColor: theme.cardBorder,
                }}
                className="rounded-2xl border shadow-sm mb-4 overflow-hidden"
                activeOpacity={0.88}
              >
                <View className="h-44 bg-slate-800 relative">
                  <Image
                    source={{ uri: filteredNews[0].imageUrl }}
                    className="w-full h-full"
                    resizeMode="cover"
                  />
                  <View className="absolute top-3 left-3 bg-emerald-600 px-2.5 py-0.5 rounded">
                    <Text className="text-white font-black text-[10px] uppercase">
                      {filteredNews[0].category}
                    </Text>
                  </View>
                </View>
                <View className="p-4">
                  <Text style={{ color: theme.text }} className="font-extrabold text-base leading-snug mb-1.5">
                    {filteredNews[0].headline}
                  </Text>
                  <Text style={{ color: theme.textSecondary }} className="text-xs leading-relaxed mb-2" numberOfLines={2}>
                    {filteredNews[0].summary}
                  </Text>
                  <View className="flex-row items-center justify-between">
                    <Text style={{ color: theme.textMuted }} className="text-[11px]">
                      {filteredNews[0].timeAgo} • {filteredNews[0].readTime}
                    </Text>
                    <Ionicons name="bookmark-outline" size={16} color={theme.textMuted} />
                  </View>
                </View>
              </TouchableOpacity>

              {/* List of Other News */}
              <View className="space-y-3 pb-8">
                {filteredNews.slice(1).map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    style={{
                      backgroundColor: theme.card,
                      borderColor: theme.cardBorder,
                    }}
                    className="p-3 rounded-2xl border shadow-xs flex-row mb-3"
                    activeOpacity={0.85}
                  >
                    <View className="flex-1 mr-3 justify-between">
                      <View>
                        <View className="flex-row items-center mb-1">
                          <Text style={{ color: theme.accent }} className="text-[10px] font-black uppercase mr-2">
                            {item.category}
                          </Text>
                          <Text style={{ color: theme.textMuted }} className="text-[10px]">
                            {item.timeAgo}
                          </Text>
                        </View>
                        <Text style={{ color: theme.text }} className="font-bold text-xs leading-snug" numberOfLines={2}>
                          {item.headline}
                        </Text>
                      </View>
                      <Text style={{ color: theme.textMuted }} className="text-[10px] mt-1">
                        {item.readTime}
                      </Text>
                    </View>

                    <Image
                      source={{ uri: item.imageUrl }}
                      className="w-20 h-20 rounded-xl bg-slate-700"
                      resizeMode="cover"
                    />
                  </TouchableOpacity>
                ))}
              </View>
            </>
          )}
        </ScrollView>
      )}
    </View>
  );
}
