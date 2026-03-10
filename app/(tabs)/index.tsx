import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, Shadows, Typography, GlobalStyles } from '@/constants/theme';
import { AutoScrollBanner } from '@/components/auto-scroll-banner';
import { SectionHeader } from '@/components/section-header';
import { CategoryCircle, CategoryItem } from '@/components/category-circle';
import { CircleIconButton } from '@/components/circle-icon-button';

const BANNERS = [
  { id: '1', image: require('@/assets/images/banner1.png') },
  { id: '2', image: require('@/assets/images/banner2.png') },
  { id: '3', image: require('@/assets/images/banner3.png') },
  { id: '4', image: require('@/assets/images/banner4.png') },
];

const CATEGORIES: CategoryItem[] = [
  { id: '1', name: 'Haircut', icon: 'content-cut', color: Colors.category.haircut.color, bgColor: Colors.category.haircut.bg },
  { id: '2', name: 'Massage', icon: 'spa', color: Colors.category.massage.color, bgColor: Colors.category.massage.bg },
  { id: '3', name: 'Coloring', icon: 'spray', color: Colors.category.coloring.color, bgColor: Colors.category.coloring.bg },
  { id: '4', name: 'Facial', icon: 'face-woman-outline', color: Colors.category.facial.color, bgColor: Colors.category.facial.bg },
  { id: '5', name: 'Makeup', icon: 'lipstick', color: Colors.category.makeup.color, bgColor: Colors.category.makeup.bg },
  { id: '6', name: 'Nails', icon: 'hand-wash-outline', color: Colors.category.nails.color, bgColor: Colors.category.nails.bg },
];

export default function HomeScreen() {
  return (
    <SafeAreaView style={GlobalStyles.screenContainer} edges={['top']}>
      {/* ─── Header ──────────────────────────── */}
      <View style={styles.header}>
        <View style={styles.leftSection}>
          <Text style={styles.welcomeText}>Hi, User</Text>
          <TouchableOpacity style={styles.locationButton} activeOpacity={0.7}>
            <Ionicons name="location-sharp" size={16} color={Colors.primary} />
            <Text style={styles.locationText} numberOfLines={1}>
              Indore, MR 10 Road
            </Text>
            <Ionicons name="chevron-down" size={14} color={Colors.textSecondary} />
          </TouchableOpacity>
        </View>

        <View style={styles.rightSection}>
          <CircleIconButton name="wallet-outline" />
          <CircleIconButton name="person-outline" />
        </View>
      </View>

      {/* ─── Content ─────────────────────────── */}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={GlobalStyles.scrollContent}>
        {/* Auto Scroll Banner */}
        <AutoScrollBanner banners={BANNERS} />

        {/* Categories Section */}
        <SectionHeader title="Categories" />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesContent}
        >
          {CATEGORIES.map((cat) => (
            <CategoryCircle key={cat.id} item={cat} />
          ))}
        </ScrollView>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    ...GlobalStyles.rowBetween,
    paddingHorizontal: Spacing.xl,
    paddingVertical: 15,
    backgroundColor: Colors.white,
    ...Shadows.md,
  },
  leftSection: {
    flex: 1,
  },
  welcomeText: {
    ...Typography.heading,
  },
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.xs,
    backgroundColor: Colors.backgroundTertiary,
    alignSelf: 'flex-start',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: 20,
  },
  locationText: {
    ...Typography.caption,
    marginHorizontal: Spacing.xs,
    maxWidth: 150,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  categoriesContent: {
    paddingHorizontal: 15,
    paddingBottom: Spacing.xl,
    gap: 15,
  },
});
