import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { ApiEndpoints } from '@/constants/ApiEndpoints';
import { Colors, Spacing } from '@/constants/theme';
import { ScreenHeader } from '@/components/screen-header';
import { ServiceCard } from '@/components/service-card';

interface Service {
  _id: string;
  name: string;
  description: string;
  duration: number;
  regularPrice: number;
  salePrice: number;
  image: string;
}

export default function ServicesScreen() {
  const { id, name } = useLocalSearchParams<{ id: string; name: string }>();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const url = ApiEndpoints.home.services(id);
        const response = await fetch(url);
        const json = await response.json();

        if (json.success) {
          setServices(json.data);
        }
      } catch (error) {
        console.error('Services API Error:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchServices();
    }
  }, [id]);

  const renderItem = ({ item }: { item: Service }) => (
    <ServiceCard
      item={{
        id: item._id,
        name: item.name,
        description: item.description || 'Professional grooming service',
        regularPrice: `₹${item.regularPrice}`,
        salePrice: `₹${item.salePrice}`,
        duration: `${item.duration} mins`,
        image: require('@/assets/images/service_haircut.png'),
        tags: [],
      }}
      onAddToCart={() => {
        // Handle cart logic
        console.log('Added to cart:', item._id);
      }}
    />
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScreenHeader
        title={name || 'Services'}
        showBackButton
        onBackPress={() => router.back()}
      />

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      ) : services.length === 0 ? (
        <View style={styles.centered}>
          <Ionicons name="cut-outline" size={64} color={Colors.textMuted} />
          <Text style={styles.noDataText}>No services found in this category</Text>
        </View>
      ) : (
        <FlatList
          key="services-grid"
          data={services}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundSecondary,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    padding: Spacing.xl,
    paddingBottom: 40,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  noDataText: {
    marginTop: 10,
    fontSize: 16,
    color: Colors.textMuted,
  },
});
