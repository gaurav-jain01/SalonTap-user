import { ScreenHeader } from '@/components/screen-header';
import { BorderRadius, Colors, Shadows, Spacing } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

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
    id: '1',
    serviceName: 'Premium Haircut',
    salonName: 'Style Studio',
    date: '12 Mar 2026',
    time: '10:30 AM',
    price: '₹499',
    status: 'upcoming',
    image: require('@/assets/images/service_haircut.png'),
  },
  {
    id: '2',
    serviceName: 'Deep Tissue Massage',
    salonName: 'Zen Wellness Spa',
    date: '14 Mar 2026',
    time: '02:00 PM',
    price: '₹1,299',
    status: 'upcoming',
    image: require('@/assets/images/service_massage.png'),
  },
];

const statusConfig: Record<
  Order['status'],
  { color: string; bg: string; label: string; icon: keyof typeof Ionicons.glyphMap }
> = {
  upcoming: { color: '#2196F3', bg: '#E3F2FD', label: 'Upcoming', icon: 'time-outline' },
  completed: { color: '#4CAF50', bg: '#E8F5E9', label: 'Completed', icon: 'checkmark-circle-outline' },
  cancelled: { color: '#F44336', bg: '#FFEBEE', label: 'Cancelled', icon: 'close-circle-outline' },
};

export default function OrdersScreen() {

  const [activeTab, setActiveTab] = useState<OrderStatus>('all');
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    const checkLogin = async () => {
      const token = await AsyncStorage.getItem('token');
      setIsLoggedIn(!!token);
    };

    checkLogin();
  }, []);

  const filteredOrders =
    activeTab === 'all'
      ? ORDERS
      : ORDERS.filter((o) => o.status === activeTab);

  if (isLoggedIn === null) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerLoader}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>

      <ScreenHeader title="My Orders" subtitle={`${ORDERS.length} total bookings`} />

      {/* If user NOT logged in */}
      {!isLoggedIn ? (

        <View style={styles.emptyState}>
          <Ionicons name="person-circle-outline" size={70} color={Colors.borderMedium} />

          <Text style={styles.emptyTitle}>Login Required</Text>

          <Text style={styles.emptySubtitle}>
            Login to view your booking history
          </Text>

          <TouchableOpacity
            style={styles.loginButton}
            onPress={() => router.push('/login')}
          >
            <Text style={styles.loginButtonText}>Login</Text>
          </TouchableOpacity>
        </View>

      ) : (

        <>
          {/* Status Tabs */}

          <View style={styles.tabsWrapper}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.tabsContent}
            >
              {STATUS_TABS.map((tab) => (
                <TouchableOpacity
                  key={tab.key}
                  style={[styles.tab, activeTab === tab.key && styles.activeTab]}
                  onPress={() => setActiveTab(tab.key)}
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

                <Text style={styles.emptyTitle}>No orders yet</Text>

                <Text style={styles.emptySubtitle}>
                  Your bookings will appear here
                </Text>
              </View>

            ) : (

              filteredOrders.map((order) => {

                const config = statusConfig[order.status];

                return (

                  <TouchableOpacity key={order.id} style={styles.orderCard}>

                    <Image source={order.image} style={styles.orderImage} />

                    <View style={styles.orderInfo}>

                      <Text style={styles.orderService}>{order.serviceName}</Text>

                      <View style={styles.orderRow}>
                        <Ionicons name="storefront-outline" size={13} color={Colors.textMuted} />
                        <Text style={styles.orderSalon}>{order.salonName}</Text>
                      </View>

                      <View style={styles.orderRow}>
                        <Ionicons name="calendar-outline" size={13} color={Colors.textMuted} />
                        <Text style={styles.orderDetail}>{order.date}</Text>

                        <Ionicons
                          name="time-outline"
                          size={13}
                          color={Colors.textMuted}
                          style={{ marginLeft: 8 }}
                        />
                        <Text style={styles.orderDetail}>{order.time}</Text>
                      </View>

                      <View style={styles.orderBottom}>

                        <Text style={styles.orderPrice}>{order.price}</Text>

                        <View style={[styles.statusBadge, { backgroundColor: config.bg }]}>
                          <Ionicons name={config.icon} size={12} color={config.color} />
                          <Text style={[styles.statusText, { color: config.color }]}>
                            {config.label}
                          </Text>
                        </View>

                      </View>

                    </View>

                  </TouchableOpacity>

                );

              })

            )}

          </ScrollView>

        </>

      )}

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: Colors.backgroundSecondary,
  },

  centerLoader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

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

  scrollContent: {
    padding: Spacing.xl,
    paddingBottom: 40,
  },

  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 100,
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
    textAlign: 'center',
  },

  loginButton: {
    marginTop: 20,
    backgroundColor: Colors.primary,
    paddingHorizontal: 30,
    paddingVertical: 10,
    borderRadius: 25,
  },

  loginButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },

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
  },

  orderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },

  orderSalon: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginLeft: 4,
  },

  orderDetail: {
    fontSize: 12,
    color: Colors.textMuted,
    marginLeft: 4,
  },

  orderBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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