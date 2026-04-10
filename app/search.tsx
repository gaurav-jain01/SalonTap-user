import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, Shadows, BorderRadius, Typography } from '@/constants/theme';
import { ScreenHeader } from '@/components/screen-header';

const suggestedServices = [
  { id: '1', name: 'Bridal Makeup', category: 'Makeup', price: '₹2500' },
  { id: '2', name: 'Keratin Treatment', category: 'Hair', price: '₹4000' },
  { id: '3', name: 'Gel Manicure', category: 'Nails', price: '₹1200' },
  { id: '4', name: 'Face Cleanup', category: 'Skin', price: '₹800' },
  { id: '5', name: 'Hair Coloring', category: 'Hair', price: '₹3000' },
];

const trendingSearches = ['Pedicure', 'Massage', 'Waxing', 'Facial', 'Hair Cut'];

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.searchHeader}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={Colors.dark} />
        </TouchableOpacity>
        <View style={styles.searchWrapper}>
          <Ionicons name="search-outline" size={20} color={Colors.textSecondary} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search for services or categories"
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoFocus
            placeholderTextColor={Colors.textLight}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={18} color={Colors.textLight} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {searchQuery.length === 0 ? (
          <>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Trending Searches</Text>
              <View style={styles.trendingRow}>
                {trendingSearches.map((item, index) => (
                  <TouchableOpacity key={index} style={styles.trendingChip}>
                    <Text style={styles.trendingText}>{item}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Suggested Services</Text>
              {suggestedServices.map((service) => (
                <TouchableOpacity key={service.id} style={styles.serviceItem}>
                  <View style={styles.iconBox}>
                    <Ionicons name="sparkles-outline" size={20} color={Colors.primary} />
                  </View>
                  <View style={styles.serviceInfo}>
                    <Text style={styles.serviceName}>{service.name}</Text>
                    <Text style={styles.serviceCat}>{service.category}</Text>
                  </View>
                  <Text style={styles.servicePrice}>{service.price}</Text>
                  <Ionicons name="chevron-forward" size={16} color={Colors.textLight} />
                </TouchableOpacity>
              ))}
            </View>
          </>
        ) : (
          <View style={styles.emptyResults}>
             <Ionicons name="search-outline" size={60} color={Colors.backgroundTertiary} />
             <Text style={styles.emptyResultsTitle}>Searching for "{searchQuery}"</Text>
             <Text style={styles.emptyResultsSub}>We couldn't find exactly that, but try exploring our categories.</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  searchHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backBtn: {
    marginRight: 12,
  },
  searchWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: Colors.dark,
  },
  scrollContent: {
    padding: 20,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.dark,
    marginBottom: 16,
  },
  trendingRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  trendingChip: {
    backgroundColor: Colors.backgroundTertiary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  trendingText: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  serviceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: Colors.primary + '10',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  serviceInfo: {
    flex: 1,
  },
  serviceName: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.dark,
  },
  serviceCat: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  servicePrice: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.primary,
    marginRight: 8,
  },
  emptyResults: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 60,
  },
  emptyResultsTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.dark,
    marginTop: 20,
  },
  emptyResultsSub: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 20,
    paddingHorizontal: 30,
  }
});
