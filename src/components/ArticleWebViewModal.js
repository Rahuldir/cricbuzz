import React, { useState, Component } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Share,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

let WebView = null;
try {
  WebView = require('react-native-webview').WebView;
} catch {
  WebView = null;
}

class WebViewErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.warn('WebView failed to render (fallback to browser link):', error?.message);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

export default function ArticleWebViewModal({ visible, article, onClose }) {
  const { theme } = useTheme();
  const [loading, setLoading] = useState(true);

  if (!visible || !article?.link) return null;

  const handleShare = async () => {
    try {
      await Share.share({
        title: article.headline || article.title,
        message: `${article.headline || article.title}\n\nRead more at: ${article.link}`,
        url: article.link,
      });
    } catch { }
  };

  const handleOpenBrowser = async () => {
    try {
      if (article.link) {
        await Linking.openURL(article.link);
      }
    } catch (e) {
      console.warn('Could not open link:', e.message);
    }
  };

  const fallbackView = (
    <View style={{ flex: 1, backgroundColor: theme.bg, justifyContent: 'center', alignItems: 'center', padding: 24 }}>
      <View style={{ backgroundColor: theme.card, borderColor: theme.cardBorder, borderWidth: 1, borderRadius: 20, padding: 24, alignItems: 'center', width: '100%', maxWidth: 400 }}>
        <Ionicons name="newspaper-outline" size={48} color={theme.accent} style={{ marginBottom: 16 }} />
        <Text style={{ color: theme.text, fontSize: 18, fontWeight: '700', textAlign: 'center', marginBottom: 8 }}>
          {article.headline || article.title || 'Cricket News Story'}
        </Text>
        <Text style={{ color: theme.textMuted, fontSize: 13, textAlign: 'center', marginBottom: 20 }}>
          {article.snippet || article.description || 'Tap below to read the complete story directly in your browser.'}
        </Text>
        <TouchableOpacity
          onPress={handleOpenBrowser}
          style={{ backgroundColor: theme.accent, paddingVertical: 12, paddingHorizontal: 24, borderRadius: 12, flexDirection: 'row', alignItems: 'center' }}
          activeOpacity={0.8}
        >
          <Ionicons name="open-outline" size={18} color="#FFFFFF" style={{ marginRight: 8 }} />
          <Text style={{ color: '#FFFFFF', fontWeight: 'bold', fontSize: 14 }}>
            Open Full Story in Browser
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={{ flex: 1, backgroundColor: theme.bg }}>
        {/* In-app Browser Header Bar */}
        <View
          style={{ backgroundColor: theme.headerBg }}
          className="px-4 pt-12 pb-3.5 flex-row items-center justify-between shadow-md"
        >
          <TouchableOpacity
            onPress={onClose}
            className="flex-row items-center py-1 pr-3"
            activeOpacity={0.8}
          >
            <Ionicons name="close" size={24} color="#FFFFFF" />
            <Text className="text-white font-bold text-xs ml-1">Close</Text>
          </TouchableOpacity>

          <View className="flex-1 items-center px-2">
            <Text className="text-white font-extrabold text-xs tracking-wide text-center" numberOfLines={1}>
              {article.category || 'Cricket Story'}
            </Text>
            <Text className="text-emerald-200 text-[10px] text-center" numberOfLines={1}>
              {article.link}
            </Text>
          </View>

          <View className="flex-row items-center">
            <TouchableOpacity
              onPress={handleOpenBrowser}
              className="p-1.5 mr-1"
              activeOpacity={0.8}
            >
              <Ionicons name="open-outline" size={20} color="#FFFFFF" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleShare}
              className="p-1.5"
              activeOpacity={0.8}
            >
              <Ionicons name="share-social-outline" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Loading Progress Spinner */}
        {loading && WebView && (
          <View
            style={{ backgroundColor: theme.card }}
            className="flex-row items-center justify-center py-2 border-b border-slate-200 dark:border-slate-800"
          >
            <ActivityIndicator size="small" color={theme.accent} style={{ marginRight: 8 }} />
            <Text style={{ color: theme.textMuted }} className="text-xs font-semibold">
              Loading article from live source...
            </Text>
          </View>
        )}

        {/* Embedded In-App WebView with ErrorBoundary */}
        {WebView ? (
          <WebViewErrorBoundary fallback={fallbackView}>
            <WebView
              source={{ uri: article.link }}
              onLoadStart={() => setLoading(true)}
              onLoadEnd={() => setLoading(false)}
              style={{ flex: 1, backgroundColor: theme.bg }}
              allowsBackForwardNavigationGestures
              startInLoadingState={false}
              javaScriptEnabled
              domStorageEnabled
            />
          </WebViewErrorBoundary>
        ) : (
          fallbackView
        )}
      </View>
    </Modal>
  );
}
