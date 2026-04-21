import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, Shadows, BorderRadius, Typography } from '@/constants/theme';
import { ScreenHeader } from '@/components/screen-header';

import { bookingService } from '@/services/bookingService';
import { useToast } from '@/components/toast-provider';
import { useCart } from '@/contexts/cart-context';

export default function OffersScreen() {
  const { showToast } = useToast();
  const { totalAmount, refreshCart } = useCart();
  const [promoCode, setPromoCode] = useState('');
  const [coupons, setCoupons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    fetchCoupons();
  }, [totalAmount]);

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const response = await bookingService.getAvailableCoupons(totalAmount);
      if (response.success) {
        setCoupons(response.data as any[]);
      }
    } catch (error) {
      console.error('Error fetching coupons:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyCoupon = async (code: string) => {
    try {
      const response = await bookingService.applyCoupon(code);
      if (response.success) {
        showToast({ message: `Coupon ${code} applied successfully!`, type: 'success' });
        await refreshCart();
        router.back();
      } else {
        showToast({ message: 'Invalid or inapplicable coupon', type: 'error' });
      }
    } catch (error: any) {
      showToast({ message: error.response?.data?.message || 'Failed to apply coupon', type: 'error' });
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScreenHeader title="Offers" showBackButton onBackPress={() => router.back()} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.headerSection}>
          <Text style={styles.mainTitle}>Privileges &{"\n"}Exclusive Offers</Text>
          <Text style={styles.subtitle}>
            Curated benefits designed for your transformation journey. Discover our latest seasonal rewards.
          </Text>
        </View>

        {/* Custom Promo Code Section */}
        <View style={styles.promoInputSection}>
          <View style={styles.inputWrapper}>
             <Ionicons name="search-outline" size={20} color={Colors.textLight} style={styles.searchIcon} />
             <TextInput
               style={styles.textInput}
               placeholder="Enter promo code"
               value={promoCode}
               onChangeText={setPromoCode}
               placeholderTextColor={Colors.textLight}
               autoCapitalize="characters"
             />
             <TouchableOpacity 
               style={styles.applyInlineBtn}
               onPress={() => handleApplyCoupon(promoCode)}
             >
               <Text style={styles.applyInlineText}>Apply</Text>
             </TouchableOpacity>
          </View>
        </View>

        <View style={styles.availableSection}>
          <View style={styles.availableHeader}>
            <Text style={styles.availableTitle}>Available Coupons</Text>
            <Text style={styles.offersCount}>{coupons.length} OFFERS</Text>
          </View>

          {loading ? (
             <ActivityIndicator color={Colors.primary} style={{ marginTop: 20 }} />
          ) : coupons.length === 0 ? (
            <Text style={{ textAlign: 'center', color: Colors.textMuted, marginTop: 20 }}>No coupons available at the moment.</Text>
          ) : (
            coupons.map((coupon) => (
              <View key={coupon._id} style={styles.couponCard}>
                <View style={styles.couponHeader}>
                  <View style={styles.couponTitleGroup}>
                    <Text style={styles.couponTitle}>{coupon.code}</Text>
                    <Text style={styles.couponDesc}>
                      {['PERCENTAGE', 'PERCENT'].includes(coupon.discountType) ? `${coupon.discountValue}%` : `₹${coupon.discountValue}`} off on orders above ₹{coupon.minOrderAmount}
                    </Text>
                    {coupon.message && <Text style={[styles.couponDesc, { color: coupon.isApplicable ? Colors.success : Colors.error, marginTop: 4 }]}>{coupon.message}</Text>}
                  </View>
                  <Ionicons name="pricetag-outline" size={20} color={Colors.primary} opacity={0.7} />
                </View>

                <View style={styles.codeContainer}>
                  <View style={styles.codeColumn}>
                    <Text style={styles.promoCodeLabel}>PROMO CODE</Text>
                    <Text style={styles.promoCodeText}>{coupon.code}</Text>
                  </View>
                  <TouchableOpacity 
                    style={[styles.applyBtn, !coupon.isApplicable && { opacity: 0.5 }]}
                    onPress={() => handleApplyCoupon(coupon.code)}
                    disabled={!coupon.isApplicable}
                  >
                    <Text style={styles.applyBtnText}>Apply</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
        </View>

        <Text style={styles.footerNote}>
          TERMS & CONDITIONS APPLY TO ALL PROMOTIONS. VALID FOR LIMITED TIME ONLY. NOT COMBINABLE WITH OTHER OFFERS.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafafa', // Light off-white from image
  },
  scrollContent: {
    padding: Spacing.xl,
  },
  headerSection: {
    marginBottom: 40,
  },
  mainTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: Colors.dark,
    lineHeight: 34,
    fontFamily: 'serif', // Trying to match the elegant font from image
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 12,
    lineHeight: 20,
    opacity: 0.8,
  },
  promoInputSection: {
    marginBottom: 40,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 60,
    ...Shadows.sm,
  },
  searchIcon: {
    marginRight: 12,
  },
  textInput: {
    flex: 1,
    fontSize: 15,
    color: Colors.dark,
  },
  applyInlineBtn: {
    paddingHorizontal: 12,
  },
  applyInlineText: {
    color: Colors.primary,
    fontWeight: '700',
    fontSize: 15,
  },
  availableSection: {
    marginBottom: 30,
  },
  availableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  availableTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.dark,
    fontFamily: 'serif',
  },
  offersCount: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textLight,
    letterSpacing: 1,
  },
  couponCard: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    ...Shadows.sm,
  },
  couponHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  couponTitleGroup: {
    flex: 1,
    marginRight: 10,
  },
  couponTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.dark,
    fontFamily: 'serif',
    marginBottom: 4,
  },
  couponDesc: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  codeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 15,
  },
  codeColumn: {
    flex: 1,
  },
  promoCodeLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: Colors.textLight,
    marginBottom: 2,
    letterSpacing: 0.5,
  },
  promoCodeText: {
    fontSize: 15,
    fontWeight: '900',
    color: Colors.dark,
    letterSpacing: 1,
  },
  applyBtn: {
    paddingHorizontal: 15,
  },
  applyBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.primary,
  },
  footerNote: {
    fontSize: 10,
    textAlign: 'center',
    color: Colors.textLight,
    lineHeight: 16,
    paddingHorizontal: 30,
    marginTop: 20,
    letterSpacing: 0.5,
  }
});
