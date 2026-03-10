import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BorderRadius, Colors, Shadows, Spacing } from '@/constants/theme';
import { ScreenHeader } from '@/components/screen-header';

const SECTIONS = [
  {
    title: 'Acceptance of Terms',
    content: 'By accessing and using SalonTap, you agree to be bound by these Terms and Conditions. If you do not agree to these terms, please do not use our services.',
  },
  {
    title: 'Booking & Cancellation',
    content: 'All bookings are subject to availability. You may cancel a booking up to 2 hours before the appointment without any charges. Cancellations made within 2 hours may incur a cancellation fee of up to 25% of the service cost.',
  },
  {
    title: 'Payment Terms',
    content: 'Payments can be made through wallet, UPI, credit/debit cards, or net banking. All prices are in INR and inclusive of applicable taxes. Refunds will be processed within 5-7 business days.',
  },
  {
    title: 'User Responsibilities',
    content: 'You are responsible for maintaining the confidentiality of your account. You agree to provide accurate information and arrive on time for appointments. Any misuse of the platform may result in account suspension.',
  },
  {
    title: 'Service Quality',
    content: 'SalonTap partners with experienced professionals to deliver quality services. If you are unsatisfied with a service, report within 24 hours for review and potential refund or re-service.',
  },
  {
    title: 'Intellectual Property',
    content: 'All content, logos, and designs on SalonTap are our property. You may not reproduce, distribute, or create derivative works without our written permission.',
  },
  {
    title: 'Limitation of Liability',
    content: 'SalonTap is a platform connecting users with service providers. We are not liable for the quality of services provided by individual professionals beyond our dispute resolution policy.',
  },
  {
    title: 'Changes to Terms',
    content: 'We reserve the right to modify these terms at any time. Continued use of SalonTap after changes constitutes acceptance of the new terms.',
  },
];

export default function TermsConditionsScreen() {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScreenHeader title="Terms & Conditions" />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Intro */}
        <View style={styles.introCard}>
          <View style={styles.introIcon}>
            <Ionicons name="document-text" size={32} color={Colors.primary} />
          </View>
          <Text style={styles.introTitle}>Terms & Conditions</Text>
          <Text style={styles.introText}>
            Effective: March 1, 2026. Please read these terms carefully before using SalonTap services.
          </Text>
        </View>

        {/* Sections */}
        {SECTIONS.map((section, index) => (
          <View key={index} style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <View style={styles.numberBadge}>
                <Text style={styles.numberText}>{index + 1}</Text>
              </View>
              <Text style={styles.sectionTitle}>{section.title}</Text>
            </View>
            <Text style={styles.sectionContent}>{section.content}</Text>
          </View>
        ))}

        <Text style={styles.footer}>
          By using SalonTap, you acknowledge that you have read and understood these Terms & Conditions.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.backgroundSecondary },
  scrollContent: { padding: Spacing.xl, paddingBottom: 40 },

  introCard: {
    backgroundColor: Colors.white, borderRadius: BorderRadius.md,
    padding: Spacing.xl, alignItems: 'center', marginBottom: Spacing.xl, ...Shadows.sm,
  },
  introIcon: {
    width: 64, height: 64, borderRadius: 32,
    backgroundColor: Colors.primary + '12', alignItems: 'center', justifyContent: 'center', marginBottom: Spacing.md,
  },
  introTitle: { fontSize: 20, fontWeight: '700', color: Colors.dark, marginBottom: Spacing.sm },
  introText: { fontSize: 14, lineHeight: 21, color: Colors.textSecondary, textAlign: 'center' },

  sectionCard: {
    backgroundColor: Colors.white, borderRadius: BorderRadius.md,
    padding: Spacing.lg, marginBottom: Spacing.md, ...Shadows.sm,
  },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.sm },
  numberBadge: {
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center', marginRight: Spacing.md,
  },
  numberText: { fontSize: 13, fontWeight: '700', color: Colors.white },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: Colors.dark, flex: 1 },
  sectionContent: { fontSize: 13, lineHeight: 21, color: Colors.textSecondary, paddingLeft: 40 },

  footer: {
    fontSize: 12, lineHeight: 18, color: Colors.textMuted,
    textAlign: 'center', marginTop: Spacing.md, fontStyle: 'italic',
  },
});
