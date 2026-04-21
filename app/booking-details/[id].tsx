import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, Shadows } from '@/constants/theme';
import { ScreenHeader } from '@/components/screen-header';
import { bookingService } from '@/services/bookingService';

interface ServiceItem {
  name: string;
  price: number;
  duration: number;
  image: string;
}

interface BookingDetails {
  _id: string;
  status: string;
  bookingDate: string;
  startTime: string;
  endTime: string;
  services: ServiceItem[];
  provider: {
    name: string;
  };
  address: {
    main: string;
    secondary: string;
    houseNumber: string;
    landmark: string;
  };
  priceDetails: {
    subtotal: number;
    discount: number;
    couponDiscount: number;
    extraDiscount: number;
    finalAmount: number;
  };
  coupon?: {
    code: string;
    type: string;
    value: number;
  };
  payment: {
    method: string;
    status: string;
  };
  notes?: string;
  createdAt: string;
}

export default function BookingDetailsScreen() {
  const { id } = useLocalSearchParams();
  const [booking, setBooking] = useState<BookingDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookingDetails();
  }, [id]);

  const fetchBookingDetails = async () => {
    try {
      setLoading(true);
      const response = await bookingService.getBookingById(id as string);
      console.log('BOOKING DETAIL FETCHED:', JSON.stringify(response.data, null, 2));
      if (response.success) {
        setBooking(response.data);
      }
    } catch (error) {
      console.error('Error fetching booking details:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerLoader}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (!booking) {
    return (
      <SafeAreaView style={styles.container}>
        <ScreenHeader title="Order Details" showBackButton onBackPress={() => router.back()} />
        <View style={styles.emptyState}>
          <Ionicons name="alert-circle-outline" size={64} color={Colors.border} />
          <Text style={styles.emptyText}>Booking details not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'PENDING': return { color: '#FF9800', bg: '#FFF3E0', label: 'Pending' };
      case 'CONFIRMED': return { color: '#2196F3', bg: '#E3F2FD', label: 'Confirmed' };
      case 'COMPLETED': return { color: '#4CAF50', bg: '#E8F5E9', label: 'Completed' };
      case 'CANCELLED': return { color: '#F44336', bg: '#FFEBEE', label: 'Cancelled' };
      default: return { color: Colors.textMuted, bg: Colors.backgroundTertiary, label: status };
    }
  };

  const status = getStatusConfig(booking.status);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Stack.Screen options={{ headerShown: false }} />
      <ScreenHeader title="Booking Details" showBackButton onBackPress={() => router.back()} />
      
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Status Banner */}
        <View style={[styles.statusBanner, { backgroundColor: status.bg }]}>
          <View>
            <Text style={[styles.statusLabel, { color: status.color }]}>{status.label}</Text>
            <Text style={styles.bookingIdText}>Order ID: #{booking._id.slice(-6).toUpperCase()}</Text>
          </View>
          <Ionicons name="receipt-outline" size={32} color={status.color} />
        </View>

        {/* Schedule & Provider */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Schedule & Specialist</Text>
          <View style={styles.infoRow}>
            <Ionicons name="calendar-outline" size={20} color={Colors.primary} />
            <View style={styles.infoTextGroup}>
              <Text style={styles.infoLabel}>Date & Time</Text>
              <Text style={styles.infoValue}>{booking.bookingDate} • {booking.startTime} - {booking.endTime || '--:--'}</Text>
            </View>
          </View>
          
          <View style={[styles.infoRow, { marginTop: 16 }]}>
            <Ionicons name="person-outline" size={20} color={Colors.primary} />
            <View style={styles.infoTextGroup}>
              <Text style={styles.infoLabel}>Assigned Specialist</Text>
              <Text style={styles.infoValue}>{booking.provider?.name || 'Awaiting Assignment'}</Text>
            </View>
          </View>
        </View>

        {/* Services List */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Services ({booking.services?.length || 0})</Text>
          {booking.services?.map((service, index) => (
            <View key={index} style={styles.serviceItem}>
              <Image 
                source={service.image ? { uri: service.image } : require('@/assets/images/service_haircut.png')} 
                style={styles.serviceImage} 
              />
              <View style={styles.serviceInfo}>
                <Text style={styles.serviceName}>{service.name}</Text>
                <Text style={styles.serviceMeta}>{service.duration} mins • ₹{service.price}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Address */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Service Location</Text>
          <View style={styles.infoRow}>
            <Ionicons name="location-outline" size={20} color={Colors.primary} />
            <View style={styles.infoTextGroup}>
              <Text style={styles.infoValue}>
                {booking.address?.houseNumber ? `${booking.address.houseNumber}, ` : ''}{booking.address?.main}
              </Text>
              <Text style={styles.infoSubValue}>{booking.address?.secondary}</Text>
              {booking.address?.landmark && (
                <Text style={styles.landmarkText}>Landmark: {booking.address.landmark}</Text>
              )}
            </View>
          </View>
        </View>

        {/* Payment Summary */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Price Summary</Text>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Items Total</Text>
            <Text style={styles.priceValue}>₹{booking.priceDetails?.subtotal || 0}</Text>
          </View>
          
          {(booking.priceDetails?.couponDiscount || 0) > 0 && (
            <View style={styles.priceRow}>
              <Text style={[styles.priceLabel, { color: Colors.success }]}>Coupon ({booking.coupon?.code})</Text>
              <Text style={[styles.priceValue, { color: Colors.success }]}>-₹{booking.priceDetails?.couponDiscount}</Text>
            </View>
          )}

          <View style={styles.divider} />
          
          <View style={[styles.priceRow, styles.grandTotalContainer]}>
            <Text style={styles.grandTotalLabel}>Grand Total</Text>
            <Text style={styles.grandTotalValue}>₹{booking.priceDetails?.finalAmount || 0}</Text>
          </View>

          <View style={styles.paymentInfo}>
            <Text style={styles.paymentLabel}>Payment Method</Text>
            <View style={styles.paymentBadge}>
              <Text style={styles.paymentValue}>{booking.payment?.method || 'N/A'}</Text>
            </View>
          </View>
        </View>

        {booking.notes ? (
           <View style={styles.card}>
             <Text style={styles.cardTitle}>Notes for Provider</Text>
             <Text style={styles.notesText}>"{booking.notes}"</Text>
           </View>
        ) : null}

        <TouchableOpacity 
          style={styles.customerSupportBtn}
          onPress={() => router.push('/support')}
        >
          <Ionicons name="chatbubble-ellipses-outline" size={20} color={Colors.primary} />
          <Text style={styles.customerSupportText}>Need help with this booking?</Text>
        </TouchableOpacity>
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
    padding: Spacing.lg,
    paddingBottom: 40,
  },
  centerLoader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
    borderRadius: 24,
    marginBottom: Spacing.lg,
    ...Shadows.sm,
  },
  statusLabel: {
    fontSize: 24,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  bookingIdText: {
    fontSize: 12,
    color: Colors.textMuted,
    fontWeight: '700',
    marginTop: 4,
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: 24,
    padding: 20,
    marginBottom: Spacing.lg,
    ...Shadows.sm,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.dark,
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  infoTextGroup: {
    marginLeft: 12,
    flex: 1,
  },
  infoLabel: {
    fontSize: 11,
    color: Colors.textMuted,
    fontWeight: '700',
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.dark,
  },
  infoSubValue: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  landmarkText: {
    fontSize: 12,
    color: Colors.primary,
    fontWeight: '600',
    marginTop: 4,
  },
  serviceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    backgroundColor: Colors.backgroundTertiary,
    padding: 10,
    borderRadius: 16,
  },
  serviceImage: {
    width: 60,
    height: 60,
    borderRadius: 12,
  },
  serviceInfo: {
    marginLeft: 12,
    flex: 1,
  },
  serviceName: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.dark,
  },
  serviceMeta: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 2,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  grandTotalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  priceLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  priceValue: {
    fontSize: 14,
    color: Colors.dark,
    fontWeight: '700',
  },
  divider: {
    height: 1,
    backgroundColor: Colors.backgroundTertiary,
    marginVertical: 12,
  },
  grandTotalLabel: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.dark,
  },
  grandTotalValue: {
    fontSize: 18,
    fontWeight: '900',
    color: Colors.primary,
  },
  paymentInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.backgroundTertiary,
  },
  paymentLabel: {
    fontSize: 12,
    color: Colors.textMuted,
    fontWeight: '700',
  },
  paymentBadge: {
    backgroundColor: Colors.backgroundTertiary,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  paymentValue: {
    fontSize: 12,
    fontWeight: '800',
    color: Colors.dark,
  },
  notesText: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 22,
    fontStyle: 'italic',
  },
  customerSupportBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    gap: 8,
  },
  customerSupportText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.primary,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
    color: Colors.textMuted,
    marginTop: 16,
    fontWeight: '600',
  }
});
