import { ScreenHeader } from '@/components/screen-header';
import { BorderRadius, Colors, Shadows, Spacing } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { bookingService } from '@/services/bookingService';

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

const statusConfig: Record<
  string,
  { color: string; bg: string; label: string; icon: keyof typeof Ionicons.glyphMap }
> = {
  PENDING: { color: '#FF9800', bg: '#FFF3E0', label: 'Pending', icon: 'time-outline' },
  CONFIRMED: { color: '#2196F3', bg: '#E3F2FD', label: 'Confirmed', icon: 'checkmark-circle-outline' },
  COMPLETED: { color: '#4CAF50', bg: '#E8F5E9', label: 'Completed', icon: 'checkmark-circle-outline' },
  CANCELLED: { color: '#F44336', bg: '#FFEBEE', label: 'Cancelled', icon: 'close-circle-outline' },
  REJECTED: { color: '#F44336', bg: '#FFEBEE', label: 'Rejected', icon: 'close-circle-outline' },
};

const STATUS_TABS: { key: OrderStatus; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'upcoming', label: 'Upcoming' },
  { key: 'completed', label: 'Completed' },
  { key: 'cancelled', label: 'Cancelled' },
];

export default function OrdersScreen() {
  const [activeTab, setActiveTab] = useState<OrderStatus>('all');
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkLogin = async () => {
      const token = await AsyncStorage.getItem('token');
      setIsLoggedIn(!!token);
      if (token) {
        fetchBookings();
      } else {
        setLoading(false);
      }
    };

    checkLogin();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await bookingService.getMyBookings();
      if (response.success) {
        console.log('BOOKINGS DATA FETCHED:', JSON.stringify(response.data, null, 2));
        setBookings(response.data);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = bookings.filter((booking) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'upcoming') return ['PENDING', 'CONFIRMED'].includes(booking.status);
    if (activeTab === 'completed') return booking.status === 'COMPLETED';
    if (activeTab === 'cancelled') return ['CANCELLED', 'REJECTED'].includes(booking.status);
    return true;
  });

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

      <ScreenHeader title="My Orders" subtitle={`${bookings.length} total bookings`} />

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
      ) : loading ? (
        <View style={styles.centerLoader}>
          <ActivityIndicator size="large" color={Colors.primary} />
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
              filteredOrders.map((booking) => {
                const config = statusConfig[booking.status] || statusConfig.PENDING;
                const price = `₹${booking.finalAmount || 0}`;

                return (
                  <TouchableOpacity 
                    key={booking._id} 
                    style={styles.orderCard}
                    onPress={() => router.push(`/booking-details/${booking._id}`)}
                  >
                    <Image 
                      source={booking.image ? { uri: booking.image } : require('@/assets/images/service_haircut.png')} 
                      style={styles.orderImage} 
                    />

                    <View style={styles.orderInfo}>
                      <View style={styles.orderHeader}>
                        <Text style={styles.orderService} numberOfLines={1}>{booking.title}</Text>
                        <View style={[styles.statusBadge, { backgroundColor: config.bg }]}>
                          <Text style={[styles.statusText, { color: config.color }]}>
                            {config.label}
                          </Text>
                        </View>
                      </View>

                      <View style={styles.orderMid}>
                        <View style={styles.orderRow}>
                          <Ionicons name="person-outline" size={13} color={Colors.textMuted} />
                          <Text style={styles.orderSalon}>{booking.providerName || 'Specialist'}</Text>
                        </View>

                        <View style={styles.orderRow}>
                          <Ionicons name="calendar-outline" size={13} color={Colors.textMuted} />
                          <Text style={styles.orderDetail}>{booking.bookingDate}</Text>
                          <Ionicons
                            name="time-outline"
                            size={13}
                            color={Colors.textMuted}
                            style={{ marginLeft: 8 }}
                          />
                          <Text style={styles.orderDetail}>{booking.startTime}</Text>
                        </View>
                      </View>

                      <View style={styles.orderFooter}>
                        <Text style={styles.orderPrice}>{price}</Text>
                        <TouchableOpacity 
                          style={styles.detailsBtn}
                          onPress={() => router.push(`/booking-details/${booking._id}`)}
                        >
                          <Text style={styles.detailsBtnText}>View Details</Text>
                          <Ionicons name="chevron-forward" size={14} color={Colors.primary} />
                        </TouchableOpacity>
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
    borderRadius: 24,
    overflow: 'hidden',
    marginBottom: Spacing.lg,
    ...Shadows.md,
    height: 140,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.02)',
  },

  orderImage: {
    width: 110,
    height: '100%',
    backgroundColor: Colors.backgroundTertiary,
  },

  orderInfo: {
    flex: 1,
    padding: 14,
    justifyContent: 'space-between',
  },

  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 8,
  },

  orderService: {
    flex: 1,
    fontSize: 15,
    fontWeight: '800',
    color: Colors.dark,
  },

  orderMid: {
    gap: 4,
  },

  orderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },

  orderSalon: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontWeight: '600',
  },

  orderDetail: {
    fontSize: 12,
    color: Colors.textMuted,
    fontWeight: '500',
  },

  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },

  orderPrice: {
    fontSize: 16,
    fontWeight: '900',
    color: Colors.primary,
  },

  detailsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    backgroundColor: Colors.primary + '10',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
  },

  detailsBtnText: {
    fontSize: 11,
    fontWeight: '800',
    color: Colors.primary,
  },

  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },

  statusText: {
    fontSize: 10,
    fontWeight: '800',
    textTransform: 'uppercase',
  },

});