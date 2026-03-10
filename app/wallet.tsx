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
}

const TRANSACTIONS: Transaction[] = [
  { id: '1', title: 'Wallet Top-up', date: '10 Mar 2026', amount: '+ ₹1,000', type: 'credit', icon: 'add-circle-outline' },
  { id: '2', title: 'Premium Haircut', date: '08 Mar 2026', amount: '- ₹499', type: 'debit', icon: 'cut-outline' },
  { id: '3', title: 'Cashback Reward', date: '05 Mar 2026', amount: '+ ₹50', type: 'credit', icon: 'gift-outline' },
  { id: '4', title: 'Gold Facial', date: '02 Mar 2026', amount: '- ₹899', type: 'debit', icon: 'sparkles-outline' },
  { id: '5', title: 'Referral Bonus', date: '28 Feb 2026', amount: '+ ₹200', type: 'credit', icon: 'people-outline' },
  { id: '6', title: 'Deep Tissue Massage', date: '25 Feb 2026', amount: '- ₹1,299', type: 'debit', icon: 'fitness-outline' },
];

export default function WalletScreen() {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <ScreenHeader title="My Wallet" />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

        {/* Balance Card */}
        <View style={styles.balanceCard}>
          <View style={styles.balanceTop}>
            <View>
              <Text style={styles.balanceLabel}>Available Balance</Text>
              <Text style={styles.balanceAmount}>₹2,553</Text>
            </View>
            <View style={styles.walletIcon}>
              <Ionicons name="wallet" size={32} color={Colors.white} />
            </View>
          </View>

          <View style={styles.balanceActions}>
            <TouchableOpacity style={styles.balanceBtn} activeOpacity={0.8}>
              <Ionicons name="add" size={20} color={Colors.white} />
              <Text style={styles.balanceBtnText}>Add Money</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.balanceBtnOutline} activeOpacity={0.8}>
              <Ionicons name="send" size={18} color={Colors.white} />
              <Text style={styles.balanceBtnText}>Transfer</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Quick Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: Colors.success + '15' }]}>
              <Ionicons name="trending-up" size={20} color={Colors.success} />
            </View>
            <Text style={styles.statAmount}>₹1,250</Text>
            <Text style={styles.statLabel}>Total Earned</Text>
          </View>
          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: Colors.error + '15' }]}>
              <Ionicons name="trending-down" size={20} color={Colors.error} />
            </View>
            <Text style={styles.statAmount}>₹2,697</Text>
            <Text style={styles.statLabel}>Total Spent</Text>
          </View>
          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: Colors.warning + '15' }]}>
              <Ionicons name="gift" size={20} color={Colors.warning} />
            </View>
            <Text style={styles.statAmount}>₹250</Text>
            <Text style={styles.statLabel}>Rewards</Text>
          </View>
        </View>

        {/* Transactions */}
        <View style={styles.transactionCard}>
          <View style={styles.transactionHeader}>
            <Text style={styles.transactionTitle}>Recent Transactions</Text>
            <TouchableOpacity activeOpacity={0.7} onPress={() => router.push('/transactions')}>
              <Text style={styles.seeAllText}>See All →</Text>
            </TouchableOpacity>
          </View>

          {TRANSACTIONS.map((txn, index) => (
            <View
              key={txn.id}
              style={[styles.txnRow, index < TRANSACTIONS.length - 1 && styles.txnBorder]}
            >
              <View style={[styles.txnIcon, {
                backgroundColor: txn.type === 'credit' ? Colors.success + '12' : Colors.error + '12',
              }]}>
                <Ionicons
                  name={txn.icon}
                  size={18}
                  color={txn.type === 'credit' ? Colors.success : Colors.error}
                />
              </View>
              <View style={styles.txnInfo}>
                <Text style={styles.txnTitle}>{txn.title}</Text>
                <Text style={styles.txnDate}>{txn.date}</Text>
              </View>
              <Text style={[
                styles.txnAmount,
                { color: txn.type === 'credit' ? Colors.success : Colors.error }
              ]}>
                {txn.amount}
              </Text>
            </View>
          ))}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundSecondary,
  },
  scrollContent: {
    padding: Spacing.xl,
    paddingBottom: 40,
  },

  // Balance Card
  balanceCard: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
    marginBottom: Spacing.lg,
    ...Shadows.lg,
  },
  balanceTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.xl,
  },
  balanceLabel: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 4,
  },
  balanceAmount: {
    fontSize: 36,
    fontWeight: '800',
    color: Colors.white,
  },
  walletIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  balanceActions: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  balanceBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.25)',
    paddingVertical: 12,
    borderRadius: BorderRadius.sm,
  },
  balanceBtnOutline: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
    paddingVertical: 12,
    borderRadius: BorderRadius.sm,
  },
  balanceBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.white,
  },

  // Stats
  statsRow: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    alignItems: 'center',
    ...Shadows.sm,
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  statAmount: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.dark,
  },
  statLabel: {
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 2,
  },

  // Transactions
  transactionCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.md,
    padding: Spacing.lg,
    ...Shadows.sm,
  },
  transactionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  transactionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.dark,
  },
  seeAllText: {
    fontSize: 13,
    fontWeight: '500',
    color: Colors.textMuted,
  },
  txnRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  txnBorder: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  txnIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  txnInfo: {
    flex: 1,
  },
  txnTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.dark,
  },
  txnDate: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 2,
  },
  txnAmount: {
    fontSize: 15,
    fontWeight: '700',
  },
});
