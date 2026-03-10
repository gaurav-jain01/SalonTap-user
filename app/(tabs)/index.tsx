import { AutoScrollBanner, BannerItem } from '@/components/auto-scroll-banner';
import { CircleIconButton } from '@/components/circle-icon-button';
import { Gender, GenderToggle } from '@/components/gender-toggle';
import { SectionHeader } from '@/components/section-header';
import { ServiceCard } from '@/components/service-card';
import { Colors, GlobalStyles, Spacing } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { router } from 'expo-router';
import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type CategoryItem = {
  id: string;
  name: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  bgColor: string;
};

const BANNERS: BannerItem[] = [
  { id: '1', image: require('@/assets/images/salon_banner_1.png') },
  { id: '2', image: require('@/assets/images/salon_banner_2.png') },
  { id: '3', image: require('@/assets/images/salon_banner_3.png') },
  { id: '4', image: require('@/assets/images/salon_banner_4.png') },
];

const CATEGORIES: (CategoryItem & { gender: Gender | 'unisex' })[] = [
  { id: '1', name: 'Haircut', icon: 'content-cut', color: Colors.category.haircut.color, bgColor: Colors.category.haircut.bg, gender: 'men' },
  { id: '2', name: 'Shaving', icon: 'content-cut', color: '#607D8B', bgColor: '#ECEFF1', gender: 'men' },
  { id: '3', name: 'Massage', icon: 'spa', color: Colors.category.massage.color, bgColor: Colors.category.massage.bg, gender: 'unisex' },
  { id: '4', name: 'Coloring', icon: 'spray', color: Colors.category.coloring.color, bgColor: Colors.category.coloring.bg, gender: 'unisex' },
  { id: '5', name: 'Facial', icon: 'face-woman-outline', color: Colors.category.facial.color, bgColor: Colors.category.facial.bg, gender: 'women' },
  { id: '6', name: 'Makeup', icon: 'lipstick', color: Colors.category.makeup.color, bgColor: Colors.category.makeup.bg, gender: 'women' },
  { id: '7', name: 'Nails', icon: 'hand-wash-outline', color: Colors.category.nails.color, bgColor: Colors.category.nails.bg, gender: 'women' },
];

const SERVICES = [
  { id: '1', name: 'Premium Haircut', salon: 'Style Studio', price: '₹499', rating: 4.8, reviews: 120, image: require('@/assets/images/service_haircut.png'), gender: 'men' },
  { id: '2', name: 'Deep Massage', salon: 'Zen Spa', price: '₹1,299', rating: 4.9, reviews: 85, image: require('@/assets/images/service_massage.png'), gender: 'unisex' },
  { id: '3', name: 'Gold Facial', salon: 'Glamour', price: '₹899', rating: 4.7, reviews: 210, image: require('@/assets/images/service_facial.png'), gender: 'women' },
  { id: '4', name: 'Nail Art', salon: 'Pretty Nails', price: '₹699', rating: 4.6, reviews: 156, image: require('@/assets/images/service_nails.png'), gender: 'women' },
];

export default function HomeScreen() {
  const [selectedGender, setSelectedGender] = useState<Gender>('men');
  const [address, setAddress] = useState('Fetching location...');
  const [locLoading, setLocLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setAddress('Location permission denied');
          setLocLoading(false);
          return;
        }

        let location = await Location.getCurrentPositionAsync({});
        let reverse = await Location.reverseGeocodeAsync({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });

        if (reverse && reverse.length > 0) {
          const addr = reverse[0];
          const city = addr.city || addr.region || '';
          const sub = addr.name || addr.district || addr.street || '';
          setAddress(city ? `${sub}${sub ? ', ' : ''}${city}` : 'Indore, India');
        } else {
          setAddress('Vijay Nagar, Indore');
        }
      } catch (error) {
        setAddress('Indore, India');
      } finally {
        setLocLoading(false);
      }
    })();
  }, []);

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
          <TouchableOpacity 
            style={styles.locationButton} 
            activeOpacity={0.7}
            onPress={() => router.push('/add-address')}
          >
            <Ionicons name="location-sharp" size={16} color={Colors.primary} />
            {locLoading ? (
              <ActivityIndicator size="small" color={Colors.primary} style={{ marginLeft: 4 }} />
            ) : (
              <Text style={styles.locationText} numberOfLines={1}>
                {address}
              </Text>
            )}
            <Ionicons name="chevron-down" size={14} color={Colors.textSecondary} />
          </TouchableOpacity>
        </View>

        <View style={styles.rightSection}>
          <CircleIconButton name="wallet-outline" onPress={() => router.push('/wallet')} />
          <CircleIconButton name="person-outline" onPress={() => router.push('/profile')} />
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Banner */}
        <AutoScrollBanner banners={BANNERS} />

        {/* Gender Toggle */}
        <GenderToggle selected={selectedGender} onChange={setSelectedGender} />

        {/* Categories */}
        <SectionHeader title="Categories" showSeeAll onPress={() => router.push('/(tabs)/categories')} />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesContent}
        >
          {filteredCategories.map((cat) => (
            <TouchableOpacity key={cat.id} style={styles.categoryItem} activeOpacity={0.7}>
              <View style={[styles.iconCircle, { backgroundColor: cat.bgColor }]}>
                <Ionicons name={cat.icon} size={24} color={cat.color} />
              </View>
              <Text style={styles.categoryName}>{cat.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Popular Services */}
        <SectionHeader title="Popular Services" showSeeAll onPress={() => router.push('/(tabs)/categories')} />
        <View style={styles.servicesGrid}>
          {filteredServices.map((service) => (
            <ServiceCard key={service.id} {...service} />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.white,
  },
  leftSection: {
    flex: 1,
  },
  welcomeText: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.dark,
    marginHorizontal: 4,
    maxWidth: '85%',
  },
  rightSection: {
    flexDirection: 'row',
    gap: 10,
  },
  categoryItem: {
    alignItems: 'center',
    width: 70,
  },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    ...GlobalStyles.center,
  },
  categoryName: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textDark,
  },
  categoriesContent: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.xl,
    gap: 12, // Gap between category circles
  },
  scrollContent: {
    paddingBottom: 40,
    backgroundColor: Colors.backgroundSecondary,
  },
  servicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.xl,
  },
});
