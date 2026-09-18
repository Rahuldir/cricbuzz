import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

const CRICKET_NEWS = [
  {
    id: 'news-1',
    headline: 'Team India announces squad for upcoming ICC T20 World Cup',
    summary: 'Rohit Sharma to captain the side with Hardik Pandya as his deputy; key young spinners earn maiden call-ups.',
    category: 'Team India',
    timeAgo: '1 hour ago',
    imageUrl: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=800&q=80',
    readTime: '3 min read',
  },
  {
    id: 'news-2',
    headline: 'IPL 2024: KKR consolidate top spot after emphatic victory over Mumbai Indians',
    summary: 'Sunil Narine starred with both bat and ball at Eden Gardens as Kolkata secured their playoff qualification.',
    category: 'IPL 2024',
    timeAgo: '3 hours ago',
    imageUrl: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800&q=80',
    readTime: '4 min read',
  },
  {
    id: 'news-3',
    headline: 'Virat Kohli on strike rate debate: "Numbers are for outside noise; context wins games"',
    summary: 'The star batter reflects on his evolving T20 game and aggressive mindset in the middle overs.',
    category: 'Interviews',
    timeAgo: '5 hours ago',
    imageUrl: 'https://images.unsplash.com/photo-1531415074868-036b107e775a?w=800&q=80',
    readTime: '5 min read',
  },
  {
    id: 'news-4',
    headline: 'Australia announce Pat Cummins rested for initial group fixtures of Caribbean tour',
    summary: 'Mitchell Marsh will lead the side as part of workload management ahead of the World Cup.',
    category: 'International',
    timeAgo: '8 hours ago',
    imageUrl: 'https://images.unsplash.com/photo-1587280501635-68a0e82cd5ff?w=800&q=80',
    readTime: '2 min read',
  },
  {
    id: 'news-5',
    headline: 'Women\'s Premier League (WPL) set for expansion in 2025: BCCI official',
    summary: 'Discussions underway to introduce two new franchises and extend the tournament window.',
    category: 'WPL',
    timeAgo: '12 hours ago',
    imageUrl: 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?w=800&q=80',
    readTime: '4 min read',
  },
];

export default function NewsScreen() {
  const { theme } = useTheme();
  const [refreshing, setRefreshing] = useState(false);
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = ['All', 'Team India', 'IPL 2024', 'Interviews', 'International'];

  const filteredNews = activeCategory === 'All'
    ? CRICKET_NEWS
    : CRICKET_NEWS.filter((n) => n.category === activeCategory);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 800);
  };

  return (
    <View style={{ backgroundColor: theme.bg }} className="flex-1">
      {/* Category Pills */}
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
        {/* Featured Big News Banner */}
        {filteredNews.length > 0 && (
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
        )}

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
      </ScrollView>
    </View>
  );
}
