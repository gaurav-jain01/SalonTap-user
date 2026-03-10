import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BorderRadius, Colors, Shadows, Spacing } from '@/constants/theme';
import { ScreenHeader } from '@/components/screen-header';

const SECTIONS = [
  {
    title: 'Information We Collect',
    content: 'We collect information you provide directly to us, such as when you create an account, make a booking, or contact us for support. This includes your name, email address, phone number, and payment information.',
  },
  {
    title: 'How We Use Your Information',
    content: 'We use the information we collect to provide, maintain, and improve our services, process transactions, send notifications about your bookings, and respond to your requests and inquiries.',
  },
  {
    title: 'Information Sharing',
    content: 'We do not sell, trade, or rent your personal information to third parties. We may share your information with service providers who assist us in operating the app, conducting our business, or serving our users.',
  },
  {
    title: 'Data Security',
    content: 'We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. All payment transactions are encrypted using SSL technology.',
  },
  {
    title: 'Your Rights',
    content: 'You have the right to access, update, or delete your personal information at any time through your profile settings. You can also opt out of marketing communications by updating your notification preferences.',
  },
  {
    title: 'Contact Us',
    content: 'If you have any questions about this Privacy Policy, please contact us at privacy@salontap.com or call +91 1800-123-4567.',
  },
];

export default function PrivacyPolicyScreen() {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScreenHeader title="Privacy Policy" />
      
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Intro */}
        <View style={styles.introCard}>
          <View style={styles.introIcon}>
            <Ionicons name="shield-checkmark" size={32} color={Colors.primary} />
          </View>
          <Text style={styles.introTitle}>Your Privacy Matters</Text>
          <Text style={styles.introText}>
            Last updated: March 1, 2026. This policy describes how SalonTap collects, uses, and protects your personal data.
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
});
