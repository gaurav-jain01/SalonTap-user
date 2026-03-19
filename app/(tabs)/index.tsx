import { AutoScrollBanner, BannerItem } from '@/components/auto-scroll-banner';
import { CircleIconButton } from '@/components/circle-icon-button';
import { Gender, GenderToggle } from '@/components/gender-toggle';
import { SectionHeader } from '@/components/section-header';
import { ServiceCard } from '@/components/service-card';
import { Colors, GlobalStyles, Spacing } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import * as Location from 'expo-location';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ApiEndpoints } from '@/constants/ApiEndpoints';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

export default function HomeScreen() {
  const [selectedGender, setSelectedGender] = useState<Gender>('women');
  const [address, setAddress] = useState('Fetching location...');
  const [locLoading, setLocLoading] = useState(true);

  const [banners, setBanners] = useState<BannerItem[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const requireLogin = async (navigateTo: string) => {
      const token = await AsyncStorage.getItem("token");

      if (token) {
        router.push(navigateTo as any);
      } else {
        Alert.alert(
          "Login Required",
          "Please login to continue",
          [
            { text: "Cancel", style: "cancel" },
            { text: "Login", onPress: () => router.push("/login") }
          ]
        );
      }
    };

  /* ---------------- LOCATION ---------------- */

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
          const sub = addr.name || addr.street || '';
          setAddress(city ? `${sub}${sub ? ', ' : ''}${city}` : 'India');
        } else {
          setAddress('India');
        }
      } catch (error) {
        setAddress('India');
      } finally {
        setLocLoading(false);
      }
    })();
  }, []);

  /* ---------------- HOME API ---------------- */

  useEffect(() => {
    const fetchHome = async () => {
      try {
        const response = await fetch(ApiEndpoints.home.home);
        const json = await response.json();

        if (json.success) {
          /* BANNERS */
          const bannerData = json.data.banners.map((b: any) => ({
            id: b._id,
            image: { uri: b.image },
          }));

          setBanners(bannerData);

          /* CATEGORIES */
          setCategories(json.data.categories);

          /* SERVICES */
          setServices(json.data.services.slice(0, 6));
        }
      } catch (error) {
        console.log('Home API Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHome();
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={GlobalStyles.screenContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={GlobalStyles.screenContainer} edges={['top']}>
      
      {/* HEADER */}

      <View style={styles.header}>
        <View style={styles.leftSection}>
          <Text style={styles.welcomeText}>Hi, User</Text>

          <TouchableOpacity
            style={styles.locationButton}                                                                              
            onPress={() => router.push('/add-address')}
          >
            <Ionicons name="location-sharp" size={16} color={Colors.primary} />

            {locLoading ? (
              <ActivityIndicator
                size="small"
                color={Colors.primary}
                style={{ marginLeft: 4 }}
              />
            ) : (
              <Text style={styles.locationText} numberOfLines={1}>
                {address}
              </Text>
            )}

            <Ionicons
              name="chevron-down"
              size={14}
              color={Colors.textSecondary}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.rightSection}>
          <CircleIconButton
            name="wallet-outline"
            onPress={() => requireLogin('/wallet')}
          />
          <CircleIconButton
            name="person-outline"
            onPress={() => requireLogin('/profile')}
          />
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* BANNERS */}

        <AutoScrollBanner banners={banners} />

        {/* GENDER TOGGLE */}

        <GenderToggle selected={selectedGender} onChange={setSelectedGender} lockMen={true} />

        {selectedGender === 'men' ? (
          <View style={styles.comingSoonContainer}>
            <Ionicons name="time-outline" size={60} color={Colors.textMuted} />
            <Text style={styles.comingSoonHeader}>Coming Soon!</Text>
            <Text style={styles.comingSoonSub}>
              Men's services are currently being onboarded. We'll notify you when they're live!
            </Text>
          </View>
        ) : (
          <>
            {/* CATEGORIES */}

            <SectionHeader
              title="Categories"
              showSeeAll
              onSeeAll={() => router.push('/(tabs)/categories')}
            />

            <View style={styles.categoriesGrid}>
              {categories.map((cat) => (
                <TouchableOpacity
                  key={cat._id}
                  style={styles.categoryItem}
                  onPress={() =>
                    router.push({
                      pathname: '/sub-categories/[id]',
                      params: { id: cat._id, name: cat.name },
                    })
                  }
                >
                  <View style={styles.iconCircle}>
                    <Image
                      source={{ uri: cat.image }}
                      style={styles.categoryImage}
                      contentFit="contain"
                    />
                  </View>

                  <Text style={styles.categoryName}>{cat.name}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* SERVICES */}

            <SectionHeader
              title="Popular Services"
              showSeeAll
              onSeeAll={() => router.push('/(tabs)/categories')}
            />

            <View style={styles.servicesGrid}>
              {services.map((service) => (
                <ServiceCard
                  key={service._id}
                  item={{
                    id: service._id,
                    name: service.name,
                    description: service.description || 'Professional grooming service',
                    regularPrice: `₹${service.regularPrice}`,
                    salePrice: `₹${service.salePrice}`,
                    duration: `${service.duration} mins`,
                    image: require('@/assets/images/service_haircut.png'),
                    tags: [],
                  }}
                  onAddToCart={() => console.log('Added to cart:', service._id)}
                />
              ))}
            </View>
          </>
        )}
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

  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    backgroundColor: '#f5f5f5',
  },

  categoryImage: {
    width: 64,
    height: 64,
    borderRadius: 30,
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
    gap: 12,
  },

  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.xl,
  },

  categoryItem: {
    width: '22%', // ✅ 4 items in row
    alignItems: 'center',
    marginBottom: 16,
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

  // Coming Soon
  comingSoonContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 60,
    paddingHorizontal: 40,
  },
  comingSoonHeader: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.dark,
    marginTop: 15,
    marginBottom: 8,
  },
  comingSoonSub: {
    fontSize: 14,
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: 20,
  },
});