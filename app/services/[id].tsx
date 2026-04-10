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
import { LoadingWrapper } from '@/components/loading/loading-wrapper';

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
    // Using dummy data as requested
    const dummyServices: Service[] = [
      {
        _id: "69ba642b6f2099161f8c91aa",
        name: "Party Hair Style",
        image: "https://res.cloudinary.com/dwa5wruvc/image/upload/v1773822946/salontap/profile/rzkcrxgdvgqa883vdiyt.jpg",
        description: "Elegant hair styles for parties.",
        duration: 45,
        regularPrice: 800,
        salePrice: 599,
      },
      {
        _id: "69ba642b6f2099161f8c91ab",
        name: "Bridal Makeup",
        image: "https://res.cloudinary.com/dwa5wruvc/image/upload/v1773822946/salontap/profile/rzkcrxgdvgqa883vdiyt.jpg",
        description: "Full bridal makeup and styling.",
        duration: 120,
        regularPrice: 5000,
        salePrice: 3999,
      },
      {
        _id: "69ba642b6f2099161f8c91ac",
        name: "Hair Spa",
        image: "https://res.cloudinary.com/dwa5wruvc/image/upload/v1773822946/salontap/profile/rzkcrxgdvgqa883vdiyt.jpg",
        description: "Nourishing treatment for hair.",
        duration: 60,
        regularPrice: 1200,
        salePrice: 899,
      },
      {
        _id: "69ba642b6f2099161f8c91ad",
        name: "Face Glow Facial",
        image: "https://res.cloudinary.com/dwa5wruvc/image/upload/v1773822946/salontap/profile/rzkcrxgdvgqa883vdiyt.jpg",
        description: "Deep cleansing and facial massage.",
        duration: 60,
        regularPrice: 1500,
        salePrice: 999,
      }
    ];

    setServices(dummyServices);
    setLoading(false);
  }, [id]);

  const renderItem = ({ item }: { item: Service }) => {
    const discount = item.regularPrice - item.salePrice;
    return (
      <ServiceCard
        item={{
          id: item._id,
          name: item.name,
          description: item.description,
          regularPrice: `₹${item.regularPrice}`,
          salePrice: `₹${item.salePrice}`,
          duration: `${item.duration} mins`,
          image: item.image,
          tags: [],
          discount: discount > 0 ? `₹${discount} OFF` : undefined,
        }}
      />
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScreenHeader
        title={name || 'Services'}
        showBackButton
        onBackPress={() => router.back()}
      />

      <LoadingWrapper loading={loading} type="skeleton" skeletonType="grid" count={6}>
        {services.length === 0 ? (
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
      </LoadingWrapper>
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
