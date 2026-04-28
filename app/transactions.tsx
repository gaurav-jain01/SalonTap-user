import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, Shadows, BorderRadius } from '@/constants/theme';
import { ScreenHeader } from '@/components/screen-header';

interface Transaction {
  id: string;
  title: string;
  date: string;
  amount: string;
  type: 'credit' | 'debit';
  icon: keyof typeof Ionicons.glyphMap;
  method: string;
}

const TRANSACTIONS: Transaction[] = [];

export default function TransactionsScreen() {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScreenHeader title="Transactions" subtitle="Your complete payment history" />

      {/* Summary */}
      <View style={styles.summaryRow}>
        <View style={[styles.summaryCard, { borderLeftColor: Colors.success }]}>
          <Text style={[styles.summaryAmount, { color: Colors.success }]}>₹0</Text>
          <Text style={styles.summaryLabel}>Total Credited</Text>
        </View>
        <View style={[styles.summaryCard, { borderLeftColor: Colors.error }]}>
          <Text style={[styles.summaryAmount, { color: Colors.error }]}>₹0</Text>
          <Text style={styles.summaryLabel}>Total Debited</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {TRANSACTIONS.length > 0 ? (
          TRANSACTIONS.map((txn, index) => (
            <TouchableOpacity key={txn.id} style={styles.txnCard} activeOpacity={0.7}>
              <View style={[styles.txnIcon, {
                backgroundColor: txn.type === 'credit' ? Colors.success + '12' : Colors.error + '12',
              }]}>
                <Ionicons name={txn.icon} size={20} color={txn.type === 'credit' ? Colors.success : Colors.error} />
              </View>
              <View style={styles.txnInfo}>
                <Text style={styles.txnTitle}>{txn.title}</Text>
                <Text style={styles.txnDate}>{txn.date}</Text>
                <View style={styles.txnMethodBadge}>
                  <Text style={styles.txnMethodText}>{txn.method}</Text>
                </View>
              </View>
              <Text style={[styles.txnAmount, { color: txn.type === 'credit' ? Colors.success : Colors.error }]}>
                {txn.amount}
              </Text>
            </TouchableOpacity>
          ))
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="receipt-outline" size={64} color={Colors.textMuted + '30'} />
            <Text style={styles.emptyTitle}>No Transactions Yet</Text>
            <Text style={styles.emptySubtitle}>When you make a transaction, it will appear here.</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.backgroundSecondary },

  summaryRow: {
    flexDirection: 'row', gap: Spacing.md,
    paddingHorizontal: Spacing.xl, paddingVertical: Spacing.lg,
  },
  summaryCard: {
    flex: 1, backgroundColor: Colors.white, borderRadius: BorderRadius.md,
    padding: Spacing.md, borderLeftWidth: 3, ...Shadows.sm,
  },
  summaryAmount: { fontSize: 18, fontWeight: '800' },
  summaryLabel: { fontSize: 12, color: Colors.textMuted, marginTop: 2 },

  scrollContent: { paddingHorizontal: Spacing.xl, paddingBottom: 40 },
  txnCard: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.white,
    borderRadius: BorderRadius.md, padding: Spacing.md, marginBottom: Spacing.sm, ...Shadows.sm,
  },
  txnIcon: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', marginRight: Spacing.md },
  txnInfo: { flex: 1 },
  txnTitle: { fontSize: 14, fontWeight: '600', color: Colors.dark },
  txnDate: { fontSize: 11, color: Colors.textMuted, marginTop: 2 },
  txnMethodBadge: {
    alignSelf: 'flex-start', backgroundColor: Colors.backgroundTertiary,
    paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10, marginTop: 4,
  },
  txnMethodText: { fontSize: 10, fontWeight: '600', color: Colors.textMuted },
  txnAmount: { fontSize: 15, fontWeight: '700' },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 100,
    paddingHorizontal: Spacing.xl,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.dark,
    marginTop: Spacing.lg,
  },
  emptySubtitle: {
    fontSize: 14,
    color: Colors.textMuted,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 20,
  },
});
