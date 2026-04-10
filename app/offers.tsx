import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, Shadows, BorderRadius, Typography } from '@/constants/theme';
import { ScreenHeader } from '@/components/screen-header';

const availableCoupons = [
  {
    id: '1',
    title: 'The Grand Appointment',
    description: 'Save ₹150 on bookings over ₹1000',
    code: 'GRAND150',
    icon: 'shield-checkmark',
  },
  {
    id: '2',
    title: 'Mid-Week Serenity',
    description: '20% off all Spa services on Tuesday - Thursday',
    code: 'RELAX20',
    icon: 'leaf',
  },
  {
    id: '3',
    title: 'Signature Loyalty',
    description: 'Complimentary deep conditioning with any cut',
    code: 'GLOSSME',
    icon: 'star',
  },
];

export default function OffersScreen() {
  const [promoCode, setPromoCode] = useState('');

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
             />
             <TouchableOpacity style={styles.applyInlineBtn}>
               <Text style={styles.applyInlineText}>Apply</Text>
             </TouchableOpacity>
          </View>
        </View>

        <View style={styles.availableSection}>
          <View style={styles.availableHeader}>
            <Text style={styles.availableTitle}>Available Coupons</Text>
            <Text style={styles.offersCount}>3 OFFERS</Text>
          </View>

          {availableCoupons.map((coupon) => (
            <View key={coupon.id} style={styles.couponCard}>
              <View style={styles.couponHeader}>
                <View style={styles.couponTitleGroup}>
                  <Text style={styles.couponTitle}>{coupon.title}</Text>
                  <Text style={styles.couponDesc}>{coupon.description}</Text>
                </View>
                <Ionicons name={coupon.icon as any} size={20} color={Colors.primary} opacity={0.7} />
              </View>

              <View style={styles.codeContainer}>
                <View style={styles.codeColumn}>
                  <Text style={styles.promoCodeLabel}>PROMO CODE</Text>
                  <Text style={styles.promoCodeText}>{coupon.code}</Text>
                </View>
                <TouchableOpacity style={styles.applyBtn}>
                  <Text style={styles.applyBtnText}>Apply</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
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
