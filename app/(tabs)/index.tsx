import { AutoScrollBanner } from '@/components/auto-scroll-banner';
import { CategoryCircle, CategoryItem } from '@/components/category-circle';
import { CircleIconButton } from '@/components/circle-icon-button';
import { GenderToggle, Gender } from '@/components/gender-toggle';
import { SectionHeader } from '@/components/section-header';
import { ServiceCard, ServiceItem } from '@/components/service-card';
import { Colors, GlobalStyles, Shadows, Spacing, Typography } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const BANNERS = [
  { id: '1', image: require('@/assets/images/banner1.png') },
  { id: '2', image: require('@/assets/images/banner2.png') },
  { id: '3', image: require('@/assets/images/banner3.png') },
  { id: '4', image: require('@/assets/images/banner4.png') },
];

const CATEGORIES: (CategoryItem & { gender: Gender | 'unisex' })[] = [
  { id: '1', name: 'Haircut', icon: 'content-cut', color: Colors.category.haircut.color, bgColor: Colors.category.haircut.bg, gender: 'men' },
  { id: '2', name: 'Shaving', icon: 'razor-sharp', color: '#607D8B', bgColor: '#ECEFF1', gender: 'men' },
  { id: '3', name: 'Massage', icon: 'spa', color: Colors.category.massage.color, bgColor: Colors.category.massage.bg, gender: 'unisex' },
  { id: '4', name: 'Coloring', icon: 'spray', color: Colors.category.coloring.color, bgColor: Colors.category.coloring.bg, gender: 'unisex' },
  { id: '5', name: 'Facial', icon: 'face-woman-outline', color: Colors.category.facial.color, bgColor: Colors.category.facial.bg, gender: 'women' },
  { id: '6', name: 'Makeup', icon: 'lipstick', color: Colors.category.makeup.color, bgColor: Colors.category.makeup.bg, gender: 'women' },
  { id: '7', name: 'Nails', icon: 'hand-wash-outline', color: Colors.category.nails.color, bgColor: Colors.category.nails.bg, gender: 'women' },
  { id: '8', name: 'Beard', icon: 'face-man', color: '#795548', bgColor: '#EFEBE9', gender: 'men' },
];

const SERVICES: (ServiceItem & { gender: Gender | 'unisex' })[] = [
  {
    id: '1', name: 'Premium Haircut', description: 'Expert styling with premium products for a fresh new look.',
    regularPrice: '₹799', salePrice: '₹499', rating: 4.8,
    image: require('@/assets/images/service_haircut.png'),
    tags: ['Trending', 'Top Rated'], gender: 'men',
  },
  {
    id: '2', name: 'Deep Tissue Massage', description: 'Relaxing full body massage to relieve stress and tension.',
    regularPrice: '₹1,799', salePrice: '₹1,299', rating: 4.9,
    image: require('@/assets/images/service_massage.png'),
    tags: ['Best Seller', 'Spa'], gender: 'unisex',
  },
  {
    id: '3', name: 'Gold Facial', description: 'Luxurious gold-infused facial for radiant, glowing skin.',
    regularPrice: '₹1,299', salePrice: '₹899', rating: 4.7,
    image: require('@/assets/images/service_facial.png'),
    tags: ['Popular', 'Skin Care'], gender: 'women',
  },
  {
    id: '4', name: 'Nail Art', description: 'Creative and trendy nail designs by expert artists.',
    regularPrice: '₹999', salePrice: '₹699', rating: 4.6,
    image: require('@/assets/images/service_nails.png'),
    tags: ['New', 'Creative'], gender: 'women',
  },
  {
    id: '5', name: 'Beard Styling', description: 'Professional beard grooming and shaping for a sharp look.',
    regularPrice: '₹599', salePrice: '₹349', rating: 4.8,
    image: require('@/assets/images/service_haircut.png'),
    tags: ['Trending', 'Men\'s Special'], gender: 'men',
  },
  {
    id: '6', name: 'Bridal Makeup', description: 'Complete bridal makeup package for your special day.',
    regularPrice: '₹5,999', salePrice: '₹4,499', rating: 4.9,
    image: require('@/assets/images/service_facial.png'),
    tags: ['Premium', 'Bridal'], gender: 'women',
  },
];

export default function HomeScreen() {
  const [selectedGender, setSelectedGender] = useState<Gender>('men');

  const filteredCategories = CATEGORIES.filter(
    (c) => c.gender === selectedGender || c.gender === 'unisex'
  );
  const filteredServices = SERVICES.filter(
    (s) => s.gender === selectedGender || s.gender === 'unisex'
  );

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
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Gender Toggle */}
        <GenderToggle selected={selectedGender} onChange={setSelectedGender} />

        {/* Auto Scroll Banner */}
        <AutoScrollBanner banners={BANNERS} />

        {/* Categories Section */}
        <SectionHeader title="Categories" />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesContent}
        >
          {filteredCategories.map((cat) => (
            <CategoryCircle key={cat.id} item={cat} />
          ))}
        </ScrollView>

        {/* Popular Services Section */}
        <SectionHeader title="Popular Services" />
        <View style={styles.servicesGrid}>
          {filteredServices.map((service) => (
            <ServiceCard key={service.id} item={service} />
          ))}
        </View>
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
    paddingTop: 16,
    paddingBottom: Spacing.md,
    gap: 8,
  },
  scrollContent: {
    paddingBottom: Spacing.xl,
    backgroundColor: Colors.backgroundSecondary,
  },
  servicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.xl,
  },
});
