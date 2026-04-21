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
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { AppLoader } from '@/components/loading/app-loader';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ApiEndpoints } from '@/constants/ApiEndpoints';
import { apiClient } from '@/services/apiClient';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import { LoadingWrapper } from '@/components/loading/loading-wrapper';
import { useCart } from '@/contexts/cart-context';

export default function HomeScreen() {
  const { totalItems } = useCart();
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
    const checkConnectivity = async () => {
      try {
        await fetch('https://www.google.com', { mode: 'no-cors' });
        console.log('Connectivity Check: Internet is REACHABLE');
      } catch (e) {
        console.log('Connectivity Check: Internet is UNREACHABLE', e);
      }
    };
    checkConnectivity();

    const fetchHome = async () => {
      try {
        console.log('Fetching Home from:', ApiEndpoints.home.home);
        const response = await apiClient.get(ApiEndpoints.home.home);
        const json = response.data;
        console.log('Home API Response Structure:', {
          success: json.success,
          hasData: !!json.data,
          servicesCount: json.data?.services?.length,
          categoriesCount: json.data?.categories?.length
        });

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
      } catch (error: any) {
        console.log('Home API Error Context:', {
          message: error.message,
          code: error.code,
          url: error.config?.url,
          status: error.response?.status,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchHome();
  }, []);

  return (
    <SafeAreaView style={GlobalStyles.screenContainer} edges={['top']}>
      
      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.leftSection}>
          <Text style={styles.welcomeText}>Hi, User</Text>
          <TouchableOpacity
            style={styles.locationButton}                                                                              
            onPress={() => router.push('/addresses')}
          >
            <Ionicons name="location-sharp" size={16} color={Colors.primary} />
            {locLoading ? (
               <AppLoader size="small" />
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
          {totalItems > 0 && (
            <View style={{ position: 'relative' }}>
              <CircleIconButton
                name="cart-outline"
                onPress={() => router.push('/cart')}
              />
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{totalItems}</Text>
              </View>
            </View>
          )}
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

      <LoadingWrapper loading={loading} type="skeleton" skeletonType="card" count={4}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* SEARCH BAR */}
          <View style={styles.searchContainer}>
            <TouchableOpacity 
              style={styles.searchBar} 
              activeOpacity={0.9}
              onPress={() => router.push('/search')}
            >
              <Ionicons name="search-outline" size={20} color={Colors.textSecondary} />
              <Text style={styles.searchPlaceholder}>Search services</Text>
            </TouchableOpacity>
          </View>

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
              {services.map((service) => {
                const reg = typeof service.regularPrice === 'string' 
                  ? parseFloat(service.regularPrice.replace(/[^0-9.]/g, '')) 
                  : service.regularPrice;
                const sale = typeof service.salePrice === 'string' 
                  ? parseFloat(service.salePrice.replace(/[^0-9.]/g, '')) 
                  : service.salePrice;
                
                const discountAmount = reg - sale;
                
                return (
                  <ServiceCard
                    key={service._id}
                    item={{
                      id: service._id,
                      name: service.name,
                      description: service.description || 'Professional grooming service',
                      regularPrice: `₹${reg}`,
                      salePrice: `₹${sale}`,
                      duration: `${service.duration} mins`,
                      image: service.images && service.images.length > 0 ? service.images[0] : 'https://via.placeholder.com/150',
                      tags: [],
                      discount: discountAmount > 0 ? `₹${discountAmount} OFF` : undefined,
                    }}
                    onAddToCart={() => console.log('Added to cart:', service._id)}
                  />
                );
              })}
            </View>
          </>
        )}
        </ScrollView>
      </LoadingWrapper>
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

  // Search
  searchContainer: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
    backgroundColor: Colors.white,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.backgroundSecondary,
    paddingHorizontal: 16,
    height: 50,
    borderRadius: 16,
    gap: 12,
  },
  searchPlaceholder: {
    flex: 1,
    fontSize: 15,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  badge: {
    position: 'absolute',
    right: -4,
    top: -4,
    backgroundColor: Colors.primary,
    borderRadius: 10,
    width: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.white,
    zIndex: 1,
  },
  badgeText: {
    color: Colors.white,
    fontSize: 10,
    fontWeight: '900',
  },
});