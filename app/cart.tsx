import { ScreenHeader } from '@/components/screen-header';
import { useToast } from '@/components/toast-provider';
import { Colors, Shadows, Spacing } from '@/constants/theme';
import { useCart } from '@/contexts/cart-context';
import { bookingService } from '@/services/bookingService';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const suggestedItems = [
  { id: 's1', name: 'Scalp Massage', price: 500, image: 'https://res.cloudinary.com/dwa5wruvc/image/upload/v1773822946/salontap/profile/rzkcrxgdvgqa883vdiyt.jpg' },
  { id: 's2', name: 'Deep Conditioning', price: 800, image: 'https://res.cloudinary.com/dwa5wruvc/image/upload/v1773822946/salontap/profile/rzkcrxgdvgqa883vdiyt.jpg' },
];

export default function CartScreen() {
  const { 
    cartItems, 
    totalItems, 
    totalAmount, 
    totalDuration, 
    couponCode,
    discountAmount,
    serverTotal,
    clearCart, 
    addToCart,
    removeFromCart, 
    loading: cartLoading, 
    refreshCart 
  } = useCart();
  const { showToast } = useToast();
  const [loading, setLoading] = React.useState(false);
  const [selectedAddressId, setSelectedAddressId] = React.useState<string | null>(null);

  React.useEffect(() => {
    refreshCart();
    loadSelectedAddress();
  }, []);

  React.useEffect(() => {
    if (!cartLoading && cartItems.length === 0) {
      router.replace('/(tabs)');
    }
  }, [cartItems.length, cartLoading]);

  const loadSelectedAddress = async () => {
    const addrId = await AsyncStorage.getItem('selectedAddressId');
    // Basic validation for MongoDB ObjectId (24 char hex)
    const isValidId = /^[0-9a-fA-F]{24}$/.test(addrId || '');
    
    if (addrId && isValidId) {
      setSelectedAddressId(addrId);
    } else if (addrId) {
      // Clear invalid/dummy ID
      await AsyncStorage.removeItem('selectedAddressId');
      setSelectedAddressId(null);
    }
  };

  const grandTotal = totalAmount;

  const [bookingDate, setBookingDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [notes, setNotes] = useState('');

  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      const newDate = new Date(bookingDate);
      newDate.setFullYear(selectedDate.getFullYear());
      newDate.setMonth(selectedDate.getMonth());
      newDate.setDate(selectedDate.getDate());
      setBookingDate(newDate);
    }
  };

  const onTimeChange = (event: any, selectedTime?: Date) => {
    setShowTimePicker(false);
    if (selectedTime) {
      const newDate = new Date(bookingDate);
      newDate.setHours(selectedTime.getHours());
      newDate.setMinutes(selectedTime.getMinutes());
      setBookingDate(newDate);
    }
  };

  const handleBookService = async () => {
    if (!selectedAddressId) {
      showToast({ message: 'Please select an address first', type: 'warning' });
      router.push('/addresses');
      return;
    }

    try {
      setLoading(true);

      const bookingData = {
        addressId: selectedAddressId,
        bookingDate: bookingDate.toISOString().split('T')[0],
        startTime: bookingDate.toISOString(),
        notes: notes,
        paymentMethod: "COD" as const
      };

      console.log('CHECKOUT REQUEST DATA:', JSON.stringify(bookingData, null, 2));

      const response = await bookingService.checkout(bookingData);

      if (response.success) {
        showToast({ message: 'Booking successful!', type: 'success' });
        await clearCart();
        router.replace('/(tabs)/orders');
      }
    } catch (error: any) {
      console.error('Booking Error:', error);
      if (error.response) {
        console.error('Booking Error Response Data:', JSON.stringify(error.response.data, null, 2));
      }
      showToast({ 
        message: error.response?.data?.message || 'Booking failed. Please check your details and try again.', 
        type: 'error' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScreenHeader title="Cart" showBackButton onBackPress={() => router.back()} />

      {cartLoading && cartItems.length === 0 ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={{ marginTop: 10, color: Colors.textSecondary }}>Checking your cart...</Text>
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {/* Selected Services Section Header */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Selected Services ({totalItems})</Text>
            <View style={styles.totalTimeBadge}>
              <Ionicons name="time" size={14} color={Colors.primary} />
              <Text style={styles.totalTimeText}>{totalDuration} mins total</Text>
            </View>
          </View>

          <View style={styles.unifiedCard}>
            {cartItems.map((item, index) => (
              <React.Fragment key={`${item.id}-${index}`}>
                <View style={styles.unifiedItem}>
                  <Image source={typeof item.image === 'string' ? { uri: item.image } : item.image} style={styles.itemThumbnail} />
                  <View style={styles.itemDetails}>
                    <View style={styles.itemHeader}>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.itemName}>{item.name}</Text>
                        <Text style={styles.itemServiceTag}>Professional Salon Service</Text>
                      </View>
                      <View style={styles.itemPriceBox}>
                         {item.regularPrice && (
                          <Text style={styles.itemRegularPrice}>₹{item.regularPrice}</Text>
                        )}
                        <Text style={styles.itemSalePrice}>₹{item.price}</Text>
                      </View>
                    </View>
                    
                    <View style={styles.itemSubRow}>
                      <View style={styles.itemTimeTag}>
                        <Ionicons name="time-outline" size={14} color={Colors.textSecondary} />
                        <Text style={styles.itemTimeText}>{item.duration || 45} mins session</Text>
                      </View>
                      <View style={styles.itemQtyControl}>
                        <TouchableOpacity onPress={() => removeFromCart(item.id)} style={styles.qtySmallBtn}>
                          <Ionicons name="remove" size={16} color={Colors.primary} />
                        </TouchableOpacity>
                        <Text style={styles.qtySmallText}>{item.quantity}</Text>
                        <TouchableOpacity onPress={() => addToCart(item)} style={styles.qtySmallBtn}>
                          <Ionicons name="add" size={16} color={Colors.primary} />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </View>
                {index < cartItems.length - 1 && <View style={styles.itemDivider} />}
              </React.Fragment>
            ))}
          </View>

          {/* Suggested Section */}
          {/* ... (keep existing suggested logic) ... */}

          {/* Offers Section */}
          <TouchableOpacity style={styles.offerBanner} onPress={() => router.push('/offers')}>
            <View style={styles.offerIconBox}>
              <Ionicons name="pricetag" size={20} color={Colors.primary} />
            </View>
            <View style={styles.offerContent}>
              <Text style={styles.offerTitle}>Coupons & Offers</Text>
              <Text style={styles.offerSub}>Save up to ₹250 on this booking</Text>
            </View>
            <Text style={styles.seeAllText}>SEE ALL</Text>
          </TouchableOpacity>

          {/* Schedule Section */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Select Schedule</Text>
          </View>
          <View style={styles.unifiedCard}>
            <TouchableOpacity 
              style={styles.scheduleRow}
              onPress={() => setShowDatePicker(true)}
            >
              <View style={styles.slotIconBox}>
                <Ionicons name="calendar-outline" size={20} color={Colors.primary} />
              </View>
              <View style={styles.slotInfo}>
                <Text style={styles.slotLabel}>Date</Text>
                <Text style={styles.slotMainText}>
                  {bookingDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={Colors.textLight} />
            </TouchableOpacity>

            <View style={styles.itemDivider} />

            <TouchableOpacity 
              style={styles.scheduleRow}
              onPress={() => setShowTimePicker(true)}
            >
              <View style={styles.slotIconBox}>
                <Ionicons name="time-outline" size={20} color={Colors.primary} />
              </View>
              <View style={styles.slotInfo}>
                <Text style={styles.slotLabel}>Time</Text>
                <Text style={styles.slotMainText}>
                  {bookingDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={Colors.textLight} />
            </TouchableOpacity>
          </View>

          {showDatePicker && (
            <DateTimePicker
              value={bookingDate}
              mode="date"
              display="default"
              onChange={onDateChange}
              minimumDate={new Date()}
            />
          )}

          {showTimePicker && (
            <DateTimePicker
              value={bookingDate}
              mode="time"
              display="default"
              onChange={onTimeChange}
            />
          )}

          {/* Instructions */}
          <View style={styles.section}>
            <Text style={styles.inputLabel}>SPECIAL INSTRUCTIONS OR SUGGESTIONS</Text>
            <TextInput
              style={styles.textInput}
              placeholder="E.g. sensitive scalp, preferred stylist..."
              multiline
              placeholderTextColor={Colors.textLight}
              value={notes}
              onChangeText={setNotes}
            />
          </View>

          {/* Billing Summary */}
          <View style={styles.billingCard}>
            <Text style={styles.billingTitle}>Billing Summary</Text>
            <View style={styles.billingRow}>
              <Text style={styles.billingLabel}>Item total</Text>
              <Text style={styles.billingValue}>₹{totalAmount.toFixed(2)}</Text>
            </View>
            <View style={styles.billingRow}>
              <Text style={styles.billingLabel}>Total Duration</Text>
              <Text style={styles.billingValue}>{totalDuration} mins</Text>
            </View>

            {discountAmount ? (
              <>
                <View style={[styles.billingRow, { marginTop: 4 }]}>
                  <Text style={[styles.billingLabel, { color: Colors.success }]}>
                    Coupon Discount {couponCode ? `(${couponCode})` : ''}
                  </Text>
                  <Text style={[styles.billingValue, { color: Colors.success }]}>
                    -₹{discountAmount.toFixed(2)}
                  </Text>
                </View>
              </>
            ) : null}

            <View style={styles.divider} />
            <View style={styles.billingRow}>
              <Text style={styles.grandTotalLabel}>Grand Total</Text>
              <Text style={styles.grandTotalValue}>
                ₹{(serverTotal || (totalAmount - (discountAmount || 0))).toFixed(2)}
              </Text>
            </View>
          </View>
        </ScrollView>
      )}

      {/* Footer Buttons */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.addressBtn} onPress={() => router.push('/addresses')}>
          <Ionicons name="location-outline" size={20} color={Colors.primary} />
          <Text style={styles.addressBtnText}>
            {selectedAddressId ? 'CHANGE ADDRESS' : 'CHOOSE ADDRESS'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.bookBtn, loading && { opacity: 0.7 }]}
          onPress={handleBookService}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={Colors.white} />
          ) : (
            <>
              <Ionicons name="sparkles-outline" size={20} color={Colors.white} />
              <Text style={styles.bookBtnText}>BOOK SERVICE</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
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
    paddingBottom: 100,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
    paddingHorizontal: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.dark,
  },
  totalTimeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary + '15',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    gap: 4,
  },
  totalTimeText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.primary,
  },
  unifiedCard: {
    backgroundColor: Colors.white,
    borderRadius: 24,
    padding: 20,
    marginBottom: Spacing.xl,
    ...Shadows.md,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.02)',
  },
  unifiedItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  itemThumbnail: {
    width: 80,
    height: 80,
    borderRadius: 18,
    backgroundColor: Colors.backgroundTertiary,
  },
  itemDetails: {
    flex: 1,
    marginLeft: 18,
    justifyContent: 'center',
    height: 80,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  itemName: {
    fontSize: 17,
    fontWeight: '800',
    color: Colors.dark,
    marginBottom: 2,
  },
  itemServiceTag: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  itemPriceBox: {
    alignItems: 'flex-end',
  },
  itemRegularPrice: {
    fontSize: 11,
    color: Colors.textMuted,
    textDecorationLine: 'line-through',
  },
  itemSalePrice: {
    fontSize: 17,
    fontWeight: '900',
    color: Colors.primary,
  },
  itemSubRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 'auto',
  },
  itemTimeTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  itemTimeText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
  itemQtyControl: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.backgroundTertiary,
    borderRadius: 10,
    paddingHorizontal: 6,
    height: 32,
  },
  qtySmallBtn: {
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  qtySmallText: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.dark,
    marginHorizontal: 10,
  },
  itemDivider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: 16,
    opacity: 0.4,
  },
  suggestedList: {
    marginHorizontal: -Spacing.lg,
    paddingHorizontal: Spacing.lg,
  },
  suggestedCard: {
    backgroundColor: Colors.backgroundTertiary,
    width: 140,
    borderRadius: 16,
    padding: 10,
    marginRight: 12,
  },
  suggestedImage: {
    width: '100%',
    height: 90,
    borderRadius: 12,
    marginBottom: 8,
  },
  suggestedName: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.dark,
    marginBottom: 2,
  },
  suggestedPrice: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  smallAddBtn: {
    backgroundColor: Colors.white,
    paddingVertical: 6,
    borderRadius: 8,
    alignItems: 'center',
    ...Shadows.sm,
  },
  smallAddBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.primary,
  },
  offerBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: Spacing.xl,
    ...Shadows.sm,
  },
  offerIconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: Colors.backgroundTertiary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  offerContent: {
    flex: 1,
    marginLeft: 12,
  },
  offerTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.dark,
  },
  offerSub: {
    fontSize: 11,
    color: Colors.textSecondary,
  },
  seeAllText: {
    fontSize: 12,
    fontWeight: '800',
    color: Colors.primary,
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textSecondary,
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  textInput: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    height: 80,
    textAlignVertical: 'top',
    fontSize: 14,
    ...Shadows.sm,
  },
  billingCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    ...Shadows.sm,
  },
  billingTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.dark,
    marginBottom: 16,
  },
  billingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  billingLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  billingValue: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.dark,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: 12,
    borderStyle: 'dashed',
    borderRadius: 1,
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
  savingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.success + '15',
    padding: 10,
    borderRadius: 10,
    marginTop: 16,
    gap: 6,
  },
  savingText: {
    fontSize: 11,
    fontWeight: '800',
    color: Colors.success,
    flex: 1,
  },
  savingValue: {
    fontSize: 13,
    fontWeight: '800',
    color: Colors.success,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    flexDirection: 'row',
    backgroundColor: Colors.white,
    padding: 16,
    paddingBottom: 30,
    gap: 12,
    ...Shadows.lg,
  },
  addressBtn: {
    flex: 1,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  },
  addressBtnText: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.primary,
    marginTop: 2,
  },
  bookBtn: {
    flex: 2,
    backgroundColor: Colors.primary,
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  bookBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.white,
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginBottom: 20,
  },
  browseBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  browseBtnText: {
    color: Colors.white,
    fontWeight: '700',
  },
  subLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textSecondary,
    marginTop: 15,
    marginBottom: 10,
  },
  dayList: {
    marginHorizontal: -Spacing.lg,
    paddingHorizontal: Spacing.lg,
  },
  dayItem: {
    width: 65,
    height: 75,
    backgroundColor: Colors.white,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    ...Shadows.sm,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  selectedDayItem: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  dayText: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 4,
    fontWeight: '600',
  },
  dateText: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.dark,
  },
  selectedDayText: {
    color: Colors.white,
  },
  timeList: {
    marginHorizontal: -Spacing.lg,
    paddingHorizontal: Spacing.lg,
  },
  timeItem: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: Colors.white,
    borderRadius: 12,
    marginRight: 10,
    ...Shadows.sm,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  selectedTimeItem: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  timeSlotText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.dark,
  },
  selectedTimeSlotText: {
    color: Colors.white,
  },
  scheduleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  slotIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: Colors.primary + '10',
    justifyContent: 'center',
    alignItems: 'center',
  },
  slotInfo: {
    flex: 1,
    marginLeft: 16,
  },
  slotLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textLight,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  slotMainText: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.dark,
  },
  slotSubText: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalBlur: {
    flex: 1,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 24,
    maxHeight: '70%',
  },
  modalHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  modalIndicator: {
    width: 40,
    height: 5,
    backgroundColor: Colors.border,
    borderRadius: 3,
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: Colors.dark,
  },
  confirmBtn: {
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 10,
  },
  confirmBtnText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '800',
  },
});
