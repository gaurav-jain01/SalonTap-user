import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, Shadows, BorderRadius } from '@/constants/theme';
import { ScreenHeader } from '@/components/screen-header';

type OrderStatus = 'all' | 'upcoming' | 'completed' | 'cancelled';

interface Order {
  id: string;
  serviceName: string;
  salonName: string;
  date: string;
  time: string;
  price: string;
  status: 'upcoming' | 'completed' | 'cancelled';
  image: any;
}

const STATUS_TABS: { key: OrderStatus; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'upcoming', label: 'Upcoming' },
  { key: 'completed', label: 'Completed' },
  { key: 'cancelled', label: 'Cancelled' },
];

const ORDERS: Order[] = [
  {
    id: '1', serviceName: 'Premium Haircut', salonName: 'Style Studio',
    date: '12 Mar 2026', time: '10:30 AM', price: '₹499', status: 'upcoming',
    image: require('@/assets/images/service_haircut.png'),
  },
  {
    id: '2', serviceName: 'Deep Tissue Massage', salonName: 'Zen Wellness Spa',
    date: '14 Mar 2026', time: '02:00 PM', price: '₹1,299', status: 'upcoming',
    image: require('@/assets/images/service_massage.png'),
  },
  {
    id: '3', serviceName: 'Gold Facial', salonName: 'Glamour Salon',
    date: '05 Mar 2026', time: '11:00 AM', price: '₹899', status: 'completed',
    image: require('@/assets/images/service_facial.png'),
  },
  {
    id: '4', serviceName: 'Nail Art', salonName: 'Pretty Nails Lounge',
    date: '01 Mar 2026', time: '04:30 PM', price: '₹699', status: 'completed',
    image: require('@/assets/images/service_nails.png'),
  },
  {
    id: '5', serviceName: 'Beard Styling', salonName: 'The Gentleman Barber',
    date: '25 Feb 2026', time: '12:00 PM', price: '₹349', status: 'cancelled',
    image: require('@/assets/images/service_haircut.png'),
  },
  {
    id: '6', serviceName: 'Bridal Makeup', salonName: 'Glamour Salon',
    date: '28 Feb 2026', time: '09:00 AM', price: '₹4,499', status: 'completed',
    image: require('@/assets/images/service_facial.png'),
  },
];

const statusConfig: Record<Order['status'], { color: string; bg: string; label: string; icon: keyof typeof Ionicons.glyphMap }> = {
  upcoming: { color: '#2196F3', bg: '#E3F2FD', label: 'Upcoming', icon: 'time-outline' },
  completed: { color: '#4CAF50', bg: '#E8F5E9', label: 'Completed', icon: 'checkmark-circle-outline' },
  cancelled: { color: '#F44336', bg: '#FFEBEE', label: 'Cancelled', icon: 'close-circle-outline' },
};

export default function OrdersScreen() {
  const [activeTab, setActiveTab] = useState<OrderStatus>('all');

  const filteredOrders = activeTab === 'all'
    ? ORDERS
    : ORDERS.filter((o) => o.status === activeTab);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <ScreenHeader title="My Orders" subtitle={`${ORDERS.length} total bookings`} />

      {/* Status Tabs */}
      <View style={styles.tabsWrapper}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsContent}>
          {STATUS_TABS.map((tab) => (
            <TouchableOpacity
              key={tab.key}
              style={[styles.tab, activeTab === tab.key && styles.activeTab]}
              onPress={() => setActiveTab(tab.key)}
              activeOpacity={0.7}
            >
              <Text style={[styles.tabText, activeTab === tab.key && styles.activeTabText]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Orders List */}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {filteredOrders.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="receipt-outline" size={64} color={Colors.borderMedium} />
            <Text style={styles.emptyTitle}>No orders found</Text>
            <Text style={styles.emptySubtitle}>Your {activeTab} bookings will appear here</Text>
          </View>
        ) : (
          filteredOrders.map((order) => {
            const config = statusConfig[order.status];
            return (
              <TouchableOpacity key={order.id} style={styles.orderCard} activeOpacity={0.7}>
                {/* Image */}
                <Image source={order.image} style={styles.orderImage} resizeMode="cover" />

                {/* Info */}
                <View style={styles.orderInfo}>
                  <Text style={styles.orderService} numberOfLines={1}>{order.serviceName}</Text>
                  <View style={styles.orderRow}>
                    <Ionicons name="storefront-outline" size={13} color={Colors.textMuted} />
                    <Text style={styles.orderSalon} numberOfLines={1}>{order.salonName}</Text>
                  </View>
                  <View style={styles.orderRow}>
                    <Ionicons name="calendar-outline" size={13} color={Colors.textMuted} />
                    <Text style={styles.orderDetail}>{order.date}</Text>
                    <Ionicons name="time-outline" size={13} color={Colors.textMuted} style={{ marginLeft: 8 }} />
                    <Text style={styles.orderDetail}>{order.time}</Text>
                  </View>

                  <View style={styles.orderBottom}>
                    <Text style={styles.orderPrice}>{order.price}</Text>
                    <View style={[styles.statusBadge, { backgroundColor: config.bg }]}>
                      <Ionicons name={config.icon} size={12} color={config.color} />
                      <Text style={[styles.statusText, { color: config.color }]}>{config.label}</Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundSecondary,
  },
  // Tabs
  tabsWrapper: {
    backgroundColor: Colors.white,
    paddingBottom: Spacing.md,
    ...Shadows.md,
  },
  tabsContent: {
    paddingHorizontal: Spacing.xl,
    gap: Spacing.sm,
  },
  tab: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.backgroundTertiary,
  },
  activeTab: {
    backgroundColor: Colors.primary,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textMuted,
  },
  activeTabText: {
    color: Colors.white,
  },

  // Content
  scrollContent: {
    padding: Spacing.xl,
    paddingBottom: 40,
  },

  // Empty State
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textDark,
    marginTop: Spacing.lg,
  },
  emptySubtitle: {
    fontSize: 14,
    color: Colors.textMuted,
    marginTop: Spacing.xs,
  },

  // Order Card
  orderCard: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.md,
    overflow: 'hidden',
    marginBottom: Spacing.md,
    ...Shadows.sm,
  },
  orderImage: {
    width: 100,
    height: '100%',
    minHeight: 120,
  },
  orderInfo: {
    flex: 1,
    padding: Spacing.md,
    justifyContent: 'space-between',
  },
  orderService: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.dark,
    marginBottom: 4,
  },
  orderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 3,
  },
  orderSalon: {
    fontSize: 13,
    color: Colors.textSecondary,
    flex: 1,
  },
  orderDetail: {
    fontSize: 12,
    color: Colors.textMuted,
  },
  orderBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
  },
  orderPrice: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.primary,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
  },
});
