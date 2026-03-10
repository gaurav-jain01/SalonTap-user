import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Colors, Spacing, Shadows } from '@/constants/theme';

interface ScreenHeaderProps {
  title: string;
  subtitle?: string;
  showBackButton?: boolean;
  onBackPress?: () => void;
}

export function ScreenHeader({ 
  title, 
  subtitle, 
  showBackButton = true,
  onBackPress 
}: ScreenHeaderProps) {
  const handleBack = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      if (router.canGoBack()) {
        router.back();
      }
    }
  };

  return (
    <View style={styles.header}>
      {showBackButton && (
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={Colors.dark} />
        </TouchableOpacity>
      )}
      <View style={styles.titleContainer}>
        <Text style={styles.headerTitle}>{title}</Text>
        {subtitle && <Text style={styles.headerSubtitle}>{subtitle}</Text>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.md,
    backgroundColor: Colors.white,
    ...Shadows.md,
    gap: Spacing.md,
    zIndex: 10,
  },
  backButton: {
    padding: 4,
    marginLeft: -4,
  },
  titleContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 20, // Normalized size (reduced from 24/22)
    fontWeight: '700',
    color: Colors.dark,
  },
  headerSubtitle: {
    fontSize: 13,
    color: Colors.textMuted,
    marginTop: 2,
  },
});
