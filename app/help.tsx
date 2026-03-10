import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, Shadows, BorderRadius } from '@/constants/theme';
import { ScreenHeader } from '@/components/screen-header';

const FAQ = [
  { q: 'How do I book a service?', a: 'Browse categories or services on the home screen, select a service, choose your preferred date and time, and confirm your booking.' },
  { q: 'Can I cancel my booking?', a: 'Yes, you can cancel your booking from the Orders screen. Cancellations made 2 hours before the appointment are usually free.' },
  { q: 'How do I add money to wallet?', a: 'Go to the Wallet screen, tap on "Add Money", enter the amount and complete the payment using your preferred method.' },
  { q: 'Is my payment secure?', a: 'Yes, all payments are processed through secure encrypted gateways. We do not store your card details.' },
];

export default function HelpScreen() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [message, setMessage] = useState('');

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScreenHeader title="Help & Support" subtitle="How can we help you?" />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Quick Actions */}
        <View style={styles.actionsRow}>
          <TouchableOpacity style={styles.actionCard}>
            <View style={[styles.iconCircle, { backgroundColor: '#E3F2FD' }]}>
              <Ionicons name="call" size={24} color="#2196F3" />
            </View>
            <Text style={styles.actionLabel}>Call Us</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionCard}>
            <View style={[styles.iconCircle, { backgroundColor: '#E8F5E9' }]}>
              <Ionicons name="chatbubbles" size={24} color="#4CAF50" />
            </View>
            <Text style={styles.actionLabel}>Live Chat</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionCard}>
            <View style={[styles.iconCircle, { backgroundColor: '#FFF3E0' }]}>
              <Ionicons name="mail" size={24} color="#FF9800" />
            </View>
            <Text style={styles.actionLabel}>Email Us</Text>
          </TouchableOpacity>
        </View>

        {/* FAQs */}
        <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
        {FAQ.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.faqCard}
            onPress={() => setExpandedIndex(expandedIndex === index ? null : index)}
            activeOpacity={0.7}
          >
            <View style={styles.faqHeader}>
              <Text style={styles.faqQuestion}>{item.q}</Text>
              <Ionicons
                name={expandedIndex === index ? 'chevron-up' : 'chevron-down'}
                size={20}
                color={Colors.textMuted}
              />
            </View>
            {expandedIndex === index && (
              <Text style={styles.faqAnswer}>{item.a}</Text>
            )}
          </TouchableOpacity>
        ))}

        {/* Contact Form */}
        <View style={styles.contactForm}>
          <Text style={styles.formTitle}>Still need help?</Text>
          <Text style={styles.formSubtitle}>Send us a message and we'll get back to you soon.</Text>
          <TextInput
            style={styles.messageInput}
            placeholder="Type your message here..."
            placeholderTextColor={Colors.textLight}
            multiline
            numberOfLines={4}
            value={message}
            onChangeText={setMessage}
          />
          <TouchableOpacity style={styles.submitBtn} activeOpacity={0.8}>
            <Text style={styles.submitBtnText}>Send Message</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.backgroundSecondary },
  scrollContent: { padding: Spacing.xl, paddingBottom: 40 },

  // Actions
  actionsRow: { flexDirection: 'row', gap: Spacing.md, marginBottom: Spacing.xxl },
  actionCard: {
    flex: 1, backgroundColor: Colors.white, borderRadius: BorderRadius.md,
    padding: Spacing.md, alignItems: 'center', ...Shadows.sm,
  },
  iconCircle: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center', marginBottom: Spacing.sm },
  actionLabel: { fontSize: 13, fontWeight: '600', color: Colors.textDark },

  // FAQ
  sectionTitle: { fontSize: 18, fontWeight: '700', color: Colors.dark, marginBottom: Spacing.lg },
  faqCard: { backgroundColor: Colors.white, borderRadius: BorderRadius.md, padding: Spacing.lg, marginBottom: Spacing.md, ...Shadows.sm },
  faqHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  faqQuestion: { fontSize: 15, fontWeight: '600', color: Colors.textDark, flex: 1, paddingRight: Spacing.md },
  faqAnswer: { fontSize: 14, color: Colors.textSecondary, marginTop: Spacing.md, lineHeight: 21 },

  // Form
  contactForm: { marginTop: Spacing.xl, paddingBottom: 20 },
  formTitle: { fontSize: 18, fontWeight: '700', color: Colors.dark, marginBottom: 4 },
  formSubtitle: { fontSize: 13, color: Colors.textMuted, marginBottom: Spacing.lg },
  messageInput: {
    backgroundColor: Colors.white, borderRadius: BorderRadius.md, padding: Spacing.md,
    height: 120, textAlignVertical: 'top', borderWidth: 1, borderColor: Colors.border,
    fontSize: 15, color: Colors.dark, marginBottom: Spacing.lg,
  },
  submitBtn: {
    backgroundColor: Colors.primary, paddingVertical: 14, borderRadius: BorderRadius.md,
    alignItems: 'center', ...Shadows.md,
  },
  submitBtnText: { color: Colors.white, fontSize: 15, fontWeight: '700' },
});
