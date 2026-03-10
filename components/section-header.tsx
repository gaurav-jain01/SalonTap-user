import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors, Typography, Spacing } from '@/constants/theme';

interface SectionHeaderProps {
  title: string;
  showSeeAll?: boolean;
  onSeeAll?: () => void;
}

export function SectionHeader({ title, showSeeAll = true, onSeeAll }: SectionHeaderProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {showSeeAll && (
        <TouchableOpacity activeOpacity={0.7} onPress={onSeeAll}>
          <Text style={styles.seeAllText}>See All →</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    marginBottom: Spacing.xs,
  },
  title: {
    ...Typography.sectionTitle,
  },
  seeAllText: {
    fontSize: 14,
    color: Colors.textMuted,
    fontWeight: '500',
  },
});
