import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useCart } from '@/contexts/cart-context';
import { Colors, Spacing, Shadows, BorderRadius, Typography } from '@/constants/theme';
import { ScreenHeader } from '@/components/screen-header';
import { Modal } from 'react-native';

const suggestedItems = [
  { id: 's1', name: 'Scalp Massage', price: 500, image: 'https://res.cloudinary.com/dwa5wruvc/image/upload/v1773822946/salontap/profile/rzkcrxgdvgqa883vdiyt.jpg' },
  { id: 's2', name: 'Deep Conditioning', price: 800, image: 'https://res.cloudinary.com/dwa5wruvc/image/upload/v1773822946/salontap/profile/rzkcrxgdvgqa883vdiyt.jpg' },
];

export default function CartScreen() {
  const { cartItems, totalItems, totalAmount, addToCart, removeFromCart } = useCart();

  React.useEffect(() => {
    if (cartItems.length === 0) {
      router.replace('/(tabs)');
    }
  }, [cartItems.length]);

  const deliveryCharge = 50;
  const handlingFee = 20;
  const grandTotal = totalAmount + deliveryCharge + handlingFee;

  const [selectedDay, setSelectedDay] = React.useState(0);
  const [selectedTime, setSelectedTime] = React.useState('09:00 AM');
  const [showScheduleModal, setShowScheduleModal] = React.useState(false);

  const days = [
    { day: 'Mon', date: '11' },
    { day: 'Tue', date: '12' },
    { day: 'Wed', date: '13' },
    { day: 'Thu', date: '14' },
    { day: 'Fri', date: '15' },
    { day: 'Sat', date: '16' },
    { day: 'Sun', date: '17' },
  ];

  const times = ['09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM', '06:00 PM'];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScreenHeader title="Cart" showBackButton onBackPress={() => router.back()} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Selected Services Section */}
        <View style={styles.section}>
          {cartItems.map((item) => (
            <View key={item.id} style={styles.serviceItemCard}>
              <Image source={typeof item.image === 'string' ? { uri: item.image } : item.image} style={styles.serviceIcon} />
              <View style={styles.serviceInfo}>
                <View style={styles.serviceMainInfo}>
                  <Text style={styles.serviceName}>{item.name}</Text>
                  <View style={styles.priceContainer}>
                    {item.regularPrice && (
                      <Text style={styles.regularPrice}>₹{item.regularPrice}</Text>
                    )}
                    <Text style={styles.servicePrice}>₹{item.price}</Text>
                  </View>
                </View>
                <Text style={styles.serviceDesc} numberOfLines={2}>Professional service tailored for you.</Text>
                <View style={styles.serviceFooter}>
                  <View style={styles.timeTag}>
                    <Ionicons name="time-outline" size={14} color={Colors.textSecondary} />
                    <Text style={styles.timeText}>45 MIN SESSION</Text>
                  </View>
                  <View style={styles.quantityBar}>
                    <TouchableOpacity onPress={() => removeFromCart(item.id)} style={styles.qtyBtn}>
                      <Ionicons name="remove" size={14} color={Colors.white} />
                    </TouchableOpacity>
                    <Text style={styles.qtyText}>1</Text>
                    <TouchableOpacity disabled style={[styles.qtyBtn, { opacity: 0.5 }]}>
                      <Ionicons name="add" size={14} color={Colors.white} />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          ))}
          {cartItems.length === 0 && (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Your cart is empty</Text>
              <TouchableOpacity onPress={() => router.back()} style={styles.browseBtn}>
                <Text style={styles.browseBtnText}>Browse Services</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Suggested Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Suggested for you</Text>
            <TouchableOpacity><Text style={styles.seeAllText}>ADD ALL</Text></TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.suggestedList}>
            {suggestedItems.map((item) => (
              <View key={item.id} style={styles.suggestedCard}>
                <Image source={{ uri: item.image }} style={styles.suggestedImage} />
                <Text style={styles.suggestedName}>{item.name}</Text>
                <Text style={styles.suggestedPrice}>₹{item.price}</Text>
                <TouchableOpacity 
                   style={styles.smallAddBtn}
                   onPress={() => addToCart({ id: item.id, name: item.name, price: item.price, image: item.image })}
                >
                  <Text style={styles.smallAddBtnText}>Add</Text>
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        </View>

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

        {/* Schedule Section - Compact Classy Way */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Schedule</Text>
          <TouchableOpacity 
            style={styles.scheduleSlot}
            onPress={() => setShowScheduleModal(true)}
            activeOpacity={0.7}
          >
            <View style={styles.slotIconBox}>
              <Ionicons name="calendar-outline" size={20} color={Colors.primary} />
            </View>
            <View style={styles.slotInfo}>
              <Text style={styles.slotMainText}>
                {days[selectedDay].day}, {days[selectedDay].date} • {selectedTime || 'Select Time'}
              </Text>
              <Text style={styles.slotSubText}>Tap to change appointment slot</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={Colors.textLight} />
          </TouchableOpacity>
        </View>

        {/* Schedule Modal (Bottom Sheet style) */}
        <Modal
          visible={showScheduleModal}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setShowScheduleModal(false)}
        >
          <View style={styles.modalOverlay}>
            <TouchableOpacity 
              style={styles.modalBlur} 
              activeOpacity={1} 
              onPress={() => setShowScheduleModal(false)} 
            />
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <View style={styles.modalIndicator} />
                <Text style={styles.modalTitle}>Select Schedule</Text>
              </View>

              <ScrollView showsVerticalScrollIndicator={false}>
                <Text style={styles.subLabel}>Choose Day</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.dayList}>
                  {days.map((item, index) => (
                    <TouchableOpacity 
                      key={index} 
                      style={[styles.dayItem, selectedDay === index && styles.selectedDayItem]}
                      onPress={() => setSelectedDay(index)}
                    >
                      <Text style={[styles.dayText, selectedDay === index && styles.selectedDayText]}>{item.day}</Text>
                      <Text style={[styles.dateText, selectedDay === index && styles.selectedDayText]}>{item.date}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>

                <Text style={styles.subLabel}>Choose Time</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.timeList}>
                  {times.map((time, index) => (
                    <TouchableOpacity 
                      key={index} 
                      style={[styles.timeItem, selectedTime === time && styles.selectedTimeItem]}
                      onPress={() => setSelectedTime(time)}
                    >
                      <Text style={[styles.timeSlotText, selectedTime === time && styles.selectedTimeSlotText]}>{time}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>

                <TouchableOpacity 
                  style={styles.confirmBtn} 
                  onPress={() => setShowScheduleModal(false)}
                >
                  <Text style={styles.confirmBtnText}>Confirm Slot</Text>
                </TouchableOpacity>
              </ScrollView>
            </View>
          </View>
        </Modal>

        {/* Instructions */}
        <View style={styles.section}>
          <Text style={styles.inputLabel}>SPECIAL INSTRUCTIONS OR SUGGESTIONS</Text>
          <TextInput 
            style={styles.textInput}
            placeholder="E.g. sensitive scalp, preferred stylist..."
            multiline
            placeholderTextColor={Colors.textLight}
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
            <Text style={styles.billingLabel}>Delivery charge</Text>
            <Text style={styles.billingValue}>₹{deliveryCharge.toFixed(2)}</Text>
          </View>
          <View style={styles.billingRow}>
            <Text style={styles.billingLabel}>Handling fee</Text>
            <Text style={styles.billingValue}>₹{handlingFee.toFixed(2)}</Text>
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.billingRow}>
            <Text style={styles.grandTotalLabel}>Grand Total</Text>
            <Text style={styles.grandTotalValue}>₹{grandTotal.toFixed(2)}</Text>
          </View>

          <View style={styles.savingBadge}>
            <Ionicons name="leaf-outline" size={16} color={Colors.success} />
            <Text style={styles.savingText}>TOTAL SAVING</Text>
            <Text style={styles.savingValue}>₹150.00</Text>
          </View>
        </View>
      </ScrollView>

      {/* Footer Buttons */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.addressBtn} onPress={() => router.push('/addresses')}>
          <Ionicons name="location-outline" size={20} color={Colors.primary} />
          <Text style={styles.addressBtnText}>CHOOSE ADDRESS</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.bookBtn}>
          <Ionicons name="sparkles-outline" size={20} color={Colors.white} />
          <Text style={styles.bookBtnText}>BOOK SERVICE</Text>
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
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.dark,
  },
  serviceItemCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
    ...Shadows.sm,
  },
  serviceIcon: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: Colors.backgroundTertiary,
  },
  serviceInfo: {
    flex: 1,
    marginLeft: 12,
    height: 80, // Ensure enough height for top-to-bottom layout
    justifyContent: 'space-between',
  },
  serviceMainInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  serviceFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: 4,
  },
  serviceName: {
    fontSize: 15,
    fontWeight: '800',
    color: Colors.dark,
    flex: 1,
    marginRight: 8,
  },
  servicePrice: {
    fontSize: 15,
    fontWeight: '900',
    color: Colors.primary,
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  regularPrice: {
    fontSize: 11,
    color: Colors.textLight,
    textDecorationLine: 'line-through',
    marginBottom: 2,
  },
  serviceDesc: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  timeTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  timeText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.textSecondary,
    letterSpacing: 0.5,
  },
  quantityBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    borderRadius: 8,
    height: 30,
    minWidth: 70,
    justifyContent: 'space-between',
    paddingHorizontal: 2,
    ...Shadows.sm,
  },
  qtyBtn: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  qtyText: {
    color: Colors.white,
    fontWeight: 'bold',
    fontSize: 12,
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
  scheduleSlot: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    padding: 16,
    borderRadius: 16,
    ...Shadows.sm,
  },
  slotIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: Colors.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  slotInfo: {
    flex: 1,
  },
  slotMainText: {
    fontSize: 15,
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
