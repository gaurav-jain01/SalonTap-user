import { ScreenHeader } from '@/components/screen-header';
import { Colors, Shadows, Spacing } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState } from 'react';
import { ApiEndpoints } from '@/constants/ApiEndpoints';
import {
  ActivityIndicator,
  Alert,
  LayoutAnimation,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  UIManager,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const savedAddressesData = [
  {
    id: '1',
    tag: 'Home',
    icon: 'home-outline',
    address: 'H-201, Royal Heights, Near City Mall',
    fullAddress: 'Vijay Nagar, Indore, Madhya Pradesh 452010',
  },
  {
    id: '2',
    tag: 'Work',
    icon: 'briefcase-outline',
    address: 'Flat 402, Crystal IT Park',
    fullAddress: 'Bhawarkua, Indore, Madhya Pradesh 452001',
  },
];

export default function AddressesScreen() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [addresses, setAddresses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    fetchAddresses();
    loadSelectedId();
  }, []);

  const loadSelectedId = async () => {
    const id = await AsyncStorage.getItem('selectedAddressId');
    if (id) setSelectedId(id);
  };

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('token');
      if (!token) return;

      const response = await fetch(ApiEndpoints.address.list, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await response.json();
      
      if (result.success) {
        setAddresses(result.data);
      }
    } catch (error) {
      console.error('Error fetching addresses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = async (id: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setSelectedId(id);
    await AsyncStorage.getItem('selectedAddressId'); // Just checking if it works, actually we should set it
    await AsyncStorage.setItem('selectedAddressId', id);
  };

  const handleDelete = (id: string) => {
    Alert.alert(
      "Delete Address",
      "Are you sure you want to remove this address?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
            setAddresses(addresses.filter(a => a.id !== id));
            if (selectedId === id) setSelectedId('');
          }
        }
      ]
    );
  };

  const handleEdit = (id: string) => {
    router.push('/add-address');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScreenHeader title="Select Address" showBackButton onBackPress={() => router.back()} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionLabel}>SAVED ADDRESSES</Text>
            <TouchableOpacity
              style={styles.inlineAddBtn}
              onPress={() => router.push('/add-address')}
            >
              <Ionicons name="add" size={16} color={Colors.primary} />
              <Text style={styles.inlineAddText}>ADD NEW</Text>
            </TouchableOpacity>
          </View>

          {loading ? (
            <ActivityIndicator color={Colors.primary} style={{ marginTop: 20 }} />
          ) : addresses.length === 0 ? (
            <Text style={{ textAlign: 'center', color: Colors.textMuted, marginTop: 20 }}>No saved addresses found.</Text>
          ) : (
            addresses.map((item) => (
              <TouchableOpacity
                key={item._id}
                style={[styles.addressCard, selectedId === item._id && styles.selectedCard]}
                onPress={() => handleSelect(item._id)}
                activeOpacity={0.8}
              >
                {/* Left Icon based on addressType */}
                <View style={[styles.iconBox, selectedId === item._id && styles.selectedIconBox]}>
                  <Ionicons
                    name={item.label?.toLowerCase() === 'work' ? 'briefcase-outline' : 'home-outline'}
                    size={20}
                    color={selectedId === item._id ? Colors.white : Colors.primary}
                  />
                </View>

                {/* Middle Info */}
                <View style={styles.addressInfo}>
                  <View style={styles.tagRow}>
                    <Text style={styles.tagText}>{item.label || 'Other'}</Text>
                    {selectedId === item._id && (
                      <View style={styles.selectedBadge}>
                        <Ionicons name="checkmark-circle" size={10} color={Colors.white} />
                        <Text style={styles.selectedBadgeText}>SELECTED</Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.mainAddrText} numberOfLines={1}>
                    {item.houseNumber ? `${item.houseNumber}, ` : ''}{item.main_text}
                  </Text>
                  <Text style={styles.fullAddrText} numberOfLines={2}>
                    {item.secondary_text}
                  </Text>
                </View>

                {/* Right Column: Radio Button + Actions */}
                <View style={styles.actionColumn}>
                  <View style={styles.selectArea}>
                    {selectedId === item._id ? (
                      <Ionicons name="radio-button-on" size={22} color={Colors.primary} />
                    ) : (
                      <Ionicons name="radio-button-off" size={22} color={Colors.border} />
                    )}
                  </View>

                  <View style={styles.editDeleteRow}>
                    <TouchableOpacity onPress={() => handleEdit(item._id)} style={styles.actionBtn}>
                      <Ionicons name="pencil-outline" size={14} color={Colors.textSecondary} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleDelete(item._id)} style={styles.actionBtn}>
                      <Ionicons name="trash-outline" size={14} color={Colors.error} />
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.confirmBtn}
          onPress={() => router.back()}
        >
          <Text style={styles.confirmBtnText}>Confirm Selection</Text>
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
    marginBottom: 30,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: Colors.textMuted,
    letterSpacing: 1,
    marginBottom: 15,
    marginLeft: 4,
  },
  addressCard: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center', // This is key for vertical centering
    marginBottom: 16,
    borderWidth: 1.5,
    borderColor: 'transparent',
    minHeight: 110,
    ...Shadows.sm,
  },
  selectedCard: {
    borderColor: Colors.primary,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: Colors.backgroundTertiary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  selectedIconBox: {
    backgroundColor: Colors.primary,
  },
  addressInfo: {
    flex: 1,
    marginRight: 8,
    justifyContent: 'center',
  },
  tagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  tagText: {
    fontSize: 11,
    fontWeight: '800',
    color: Colors.textSecondary,
    textTransform: 'uppercase',
  },
  selectedBadge: {
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    gap: 3,
  },
  selectedBadgeText: {
    color: Colors.white,
    fontSize: 8,
    fontWeight: '900',
  },
  mainAddrText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.dark,
    marginBottom: 2,
  },
  fullAddrText: {
    fontSize: 12,
    color: Colors.textSecondary,
    lineHeight: 16,
  },
  actionColumn: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 80, // Slightly less than minHeight to stay centered
  },
  selectArea: {
    padding: 2,
  },
  editDeleteRow: {
    flexDirection: 'row',
    gap: 6,
  },
  actionBtn: {
    width: 30,
    height: 30,
    borderRadius: 8,
    backgroundColor: Colors.backgroundTertiary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addNewBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 16,
    ...Shadows.sm,
  },
  addIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: Colors.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  addNewText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '700',
    color: Colors.dark,
  },
  mapTipBox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginTop: 20,
    backgroundColor: Colors.white,
    borderRadius: 16,
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 12,
  },
  mapTipText: {
    flex: 1,
    fontSize: 11,
    color: Colors.textSecondary,
    lineHeight: 16,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: Colors.white,
    padding: 20,
    paddingBottom: 40,
    ...Shadows.lg,
  },
  confirmBtn: {
    backgroundColor: Colors.primary,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.md,
  },
  confirmBtnText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '800',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    paddingRight: 4,
  },
  inlineAddBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary + '15',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 4,
  },
  inlineAddText: {
    fontSize: 11,
    fontWeight: '800',
    color: Colors.primary,
  },
});
