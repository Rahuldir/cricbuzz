import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

export default function EmptyStateView({
  type = 'live', // 'live' | 'upcoming' | 'completed' | 'history' | 'general'
  onRefresh,
  onAction,
  actionLabel,
}) {
  const { theme } = useTheme();

  const getEmptyTitle = () => {
    switch (type) {
      case 'live':
        return 'No Live Match Available.';
      case 'upcoming':
        return 'No Upcoming Matches Available.';
      case 'completed':
        return 'No Recent Match Results Available.';
      default:
        return 'No Matches Available.';
    }
  };

  return (
    <View style={styles.container}>
      {/* Folder Icon with Exclamation Mark matching Screenshot 3 */}
      <View style={styles.iconContainer}>
        {/* Grey Stroke Folder Base */}
        <View style={styles.folderShape}>
          {/* Top Folder Tab Handles */}
          <View style={styles.folderHandleRow}>
            <View style={styles.folderPillSmall} />
            <View style={styles.folderPillSmall} />
          </View>

          {/* Folder Sheet */}
          <View style={styles.folderBackSheet}>
            <View style={styles.folderFrontSheet} />
          </View>

          {/* Bottom Exclamation Badge */}
          <View style={styles.exclamationCircle}>
            <Text style={styles.exclamationMarkText}>!</Text>
          </View>
        </View>
      </View>

      {/* Main Title */}
      <Text style={styles.titleText}>
        {getEmptyTitle()}
      </Text>

      {/* Optional Action Button */}
      {onRefresh && (
        <TouchableOpacity
          onPress={onRefresh}
          style={styles.refreshButton}
          activeOpacity={0.8}
        >
          <Ionicons name="refresh-outline" size={15} color="#FFFFFF" style={{ marginRight: 6 }} />
          <Text style={styles.refreshButtonText}>Tap to Refresh</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 48,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    width: 140,
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  folderShape: {
    width: 100,
    height: 84,
    borderWidth: 3.5,
    borderColor: '#475569',
    borderRadius: 16,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  folderHandleRow: {
    position: 'absolute',
    top: -12,
    flexDirection: 'row',
    gap: 6,
  },
  folderPillSmall: {
    width: 18,
    height: 6,
    borderWidth: 3,
    borderColor: '#475569',
    borderRadius: 3,
    backgroundColor: '#FFFFFF',
  },
  folderBackSheet: {
    width: 76,
    height: 52,
    backgroundColor: '#64748B',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  folderFrontSheet: {
    width: 70,
    height: 44,
    backgroundColor: '#FFFFFF',
    borderRadius: 6,
  },
  exclamationCircle: {
    position: 'absolute',
    bottom: -16,
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 3.5,
    borderColor: '#475569',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  exclamationMarkText: {
    fontSize: 20,
    fontWeight: '900',
    color: '#475569',
    marginTop: -2,
  },
  titleText: {
    fontSize: 18,
    fontWeight: '900',
    color: '#000000',
    textAlign: 'center',
    marginBottom: 16,
  },
  refreshButton: {
    backgroundColor: '#008000',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  refreshButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
});
