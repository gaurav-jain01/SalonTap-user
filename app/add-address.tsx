import { BorderRadius, Colors, Shadows, Spacing, Typography } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { router } from 'expo-router';
import React, { useEffect, useState, useCallback, useRef } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import MapView, { PROVIDER_GOOGLE, Region } from 'react-native-maps';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useToast } from '@/components/toast-provider';
import { ScreenHeader } from '@/components/screen-header';

type AddressTag = 'home' | 'work' | 'other';

export default function AddAddressScreen() {
  const { showToast } = useToast();
  const mapRef = useRef<MapView>(null);
  const [loading, setLoading] = useState(true);
  const [fetchingAddress, setFetchingAddress] = useState(false);
  const [region, setRegion] = useState<Region>({
    latitude: 22.7196,
    longitude: 75.8577,
    latitudeDelta: 0.005,
    longitudeDelta: 0.005,
  });
  
  const [addressData, setAddressData] = useState({
    houseNo: '',
    buildingName: '',
    fullAddress: 'Fetching address...',
    mainLocation: 'Searching...',
    landmark: '',
    tag: 'home' as AddressTag,
  });

  const reverseGeocode = useCallback(async (lat: number, lon: number) => {
    setFetchingAddress(true);
    try {
      const result = await Location.reverseGeocodeAsync({
        latitude: lat,
        longitude: lon,
      });

      if (result && result.length > 0) {
        const addr = result[0];
        const mainLoc = addr.name || addr.street || addr.district || 'Unknown Location';
        const formatted = [
          addr.streetNumber,
          addr.street,
          addr.district,
          addr.city,
          addr.region,
          addr.postalCode
        ].filter(Boolean).join(', ');

        setAddressData(prev => ({
          ...prev,
          mainLocation: mainLoc,
          fullAddress: formatted || 'Address not found'
        }));
      }
    } catch (error) {
      console.error(error);
    } finally {
      setFetchingAddress(false);
    }
  }, []);

  const getCurrentLocation = useCallback(async () => {
    setLoading(true);
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        showToast({ message: 'Location permission denied', type: 'error' });
        setLoading(false);
        return;
      }

      let location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      
      const newRegion = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      };
      
      setRegion(newRegion);
      mapRef.current?.animateToRegion(newRegion, 1000);
      await reverseGeocode(location.coords.latitude, location.coords.longitude);
    } catch (error) {
      showToast({ message: 'Error getting current location', type: 'error' });
    } finally {
      setLoading(false);
    }
  }, [reverseGeocode, showToast]);

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const handleRegionChangeComplete = (newRegion: Region) => {
    setRegion(newRegion);
    reverseGeocode(newRegion.latitude, newRegion.longitude);
  };

  const handleSave = () => {
    if (!addressData.houseNo || !addressData.buildingName) {
      showToast({ message: 'Please enter building/house details', type: 'warning' });
      return;
    }
    showToast({ message: 'Address saved successfully!', type: 'success' });
    router.back();
  };

  if (loading && !region) {
    return (
      <View style={[styles.loadingContainer, { flex: 1, backgroundColor: Colors.white }]}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={{ marginTop: 10, color: Colors.textSecondary }}>Initializing Map...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScreenHeader title="Confirm Location" />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          
          {/* Map Preview */}
          <View style={styles.mapWrapper}>
            <MapView
              ref={mapRef}
              provider={PROVIDER_GOOGLE}
              style={styles.map}
              initialRegion={region}
              onRegionChangeComplete={handleRegionChangeComplete}
              showsUserLocation={true}
              showsMyLocationButton={false}
            />
            {/* Center Pin Overlay */}
            <View style={styles.pinOverlay} pointerEvents="none">
              <View style={styles.pinBox}>
                <Ionicons name="location" size={40} color={Colors.primary} />
                <View style={styles.pinShadow} />
              </View>
            </View>
            
            {/* Locate Me Button */}
            <TouchableOpacity 
              style={styles.locateBtn} 
              activeOpacity={0.8}
              onPress={getCurrentLocation}
            >
              <Ionicons name="locate" size={24} color={Colors.primary} />
            </TouchableOpacity>
          </View>

          {/* Form Content */}
          <View style={styles.formCard}>
            <View style={styles.locationHeaderRow}>
               <Text style={styles.sectionLabel}>Select Address Location</Text>
               {fetchingAddress && <ActivityIndicator size="small" color={Colors.primary} />}
            </View>
            
            <View style={styles.selectedLocationBox}>
              <View style={styles.locIconBg}>
                <Ionicons name="location-sharp" size={20} color={Colors.primary} />
              </View>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={styles.locationMainText} numberOfLines={1}>
                  {addressData.mainLocation}
                </Text>
                <Text style={styles.locationSubText} numberOfLines={2}>
                  {addressData.fullAddress}
                </Text>
              </View>
              <TouchableOpacity 
                style={styles.currentBtn} 
                onPress={getCurrentLocation}
                activeOpacity={0.7}
              >
                <Ionicons name="navigate-outline" size={14} color={Colors.primary} />
                <Text style={styles.currentBtnText}>Current</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.divider} />

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>House / Flat / Floor No.*</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. 101, 1st Floor"
                value={addressData.houseNo}
                onChangeText={(text) => setAddressData({ ...addressData, houseNo: text })}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Apartment / Building / Area*</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. Royal Heights"
                value={addressData.buildingName}
                onChangeText={(text) => setAddressData({ ...addressData, buildingName: text })}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Landmark (Optional)</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. Near City Mall"
                value={addressData.landmark}
                onChangeText={(text) => setAddressData({ ...addressData, landmark: text })}
              />
            </View>

            <Text style={[styles.inputLabel, { marginTop: Spacing.sm }]}>Save as</Text>
            <View style={styles.tagRow}>
              {(['home', 'work', 'other'] as AddressTag[]).map((tag) => (
                <TouchableOpacity
                  key={tag}
                  style={[
                    styles.tagBtn,
                    addressData.tag === tag && styles.tagBtnActive
                  ]}
                  onPress={() => setAddressData({ ...addressData, tag: tag })}
                  activeOpacity={0.7}
                >
                  <Ionicons 
                    name={tag === 'home' ? 'home-outline' : tag === 'work' ? 'briefcase-outline' : 'location-outline'} 
                    size={16} 
                    color={addressData.tag === tag ? Colors.white : Colors.textSecondary} 
                  />
                  <Text style={[
                    styles.tagText,
                    addressData.tag === tag && styles.tagTextActive
                  ]}>
                    {tag.charAt(0).toUpperCase() + tag.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity 
              style={styles.saveButton} 
              activeOpacity={0.8}
              onPress={handleSave}
            >
              <Text style={styles.saveButtonText}>Save & Confirm Location</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white },
  loadingContainer: { alignItems: 'center', justifyContent: 'center' },
  scrollContent: { flexGrow: 1, backgroundColor: Colors.backgroundSecondary },
  
  // Map
  mapWrapper: { height: 320, width: '100%', position: 'relative' },
  map: { ...StyleSheet.absoluteFillObject },
  pinOverlay: { ...StyleSheet.absoluteFillObject, alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' },
  pinBox: { alignItems: 'center', marginTop: -40 },
  pinShadow: { 
    width: 6, height: 3, borderRadius: 3, 
    backgroundColor: 'rgba(0,0,0,0.2)', marginTop: -2 
  },
  locateBtn: {
    position: 'absolute', bottom: 40, right: 20, width: 44, height: 44, borderRadius: 22,
    backgroundColor: Colors.white, alignItems: 'center', justifyContent: 'center', ...Shadows.md,
  },

  // Form
  formCard: {
    backgroundColor: Colors.white, borderTopLeftRadius: BorderRadius.xl, borderTopRightRadius: BorderRadius.xl,
    marginTop: -30, padding: Spacing.xl, ...Shadows.lg,
  },
  locationHeaderRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.sm
  },
  sectionLabel: { fontSize: 13, fontWeight: '700', color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: 0.5 },
  selectedLocationBox: { flexDirection: 'row', alignItems: 'center', paddingVertical: Spacing.xs },
  locIconBg: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.primary + '10',
    alignItems: 'center', justifyContent: 'center'
  },
  locationMainText: { fontSize: 17, fontWeight: '700', color: Colors.dark },
  locationSubText: { fontSize: 13, color: Colors.textSecondary, marginTop: 2, lineHeight: 18 },
  currentBtn: { 
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, 
    borderWidth: 1, borderColor: Colors.primary + '30', backgroundColor: Colors.white
  },
  currentBtnText: { fontSize: 12, fontWeight: '700', color: Colors.primary },
  
  divider: { height: 1, backgroundColor: Colors.border, marginVertical: Spacing.lg },
  inputGroup: { marginBottom: Spacing.lg },
  inputLabel: { fontSize: 14, fontWeight: '600', color: Colors.textDark, marginBottom: Spacing.xs },
  input: { 
    height: 48, borderWidth: 1, borderColor: Colors.border, borderRadius: BorderRadius.md, 
    paddingHorizontal: Spacing.md, fontSize: 15, color: Colors.dark, backgroundColor: Colors.backgroundTertiary 
  },

  tagRow: { flexDirection: 'row', gap: Spacing.sm, marginTop: Spacing.md, marginBottom: Spacing.xxl },
  tagBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', height: 40, borderRadius: 20, borderWidth: 1, borderColor: Colors.border, backgroundColor: Colors.white, gap: 6 },
  tagBtnActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  tagText: { fontSize: 14, fontWeight: '600', color: Colors.textSecondary },
  tagTextActive: { color: Colors.white },

  saveButton: { backgroundColor: Colors.primary, height: 56, borderRadius: BorderRadius.md, alignItems: 'center', justifyContent: 'center', ...Shadows.lg, marginBottom: Spacing.xl },
  saveButtonText: { fontSize: 16, fontWeight: '700', color: Colors.white },
});
