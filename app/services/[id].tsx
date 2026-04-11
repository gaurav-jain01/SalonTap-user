import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useCart } from '@/contexts/cart-context';

import { ApiEndpoints } from '@/constants/ApiEndpoints';
import { Colors, Spacing, BorderRadius, Shadows } from '@/constants/theme';
import { ScreenHeader } from '@/components/screen-header';
import { ServiceCard } from '@/components/service-card';
import { LoadingWrapper } from '@/components/loading/loading-wrapper';
import { apiClient } from '@/services/apiClient';

interface Service {
  _id: string;
  name: string;
  description: string;
  duration: number;
  regularPrice: number | string;
  salePrice: number | string;
  images: string[];
}

export default function ServicesScreen() {
  const { id, name } = useLocalSearchParams<{ id: string; name: string }>();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const { updateSuggestions } = useCart();

  const fetchServices = async (page: number) => {
    try {
      setLoading(true);
      const url = ApiEndpoints.home.servicesBySubCategory(id || '', page);
      const response = await apiClient.get(url);
      const json = response.data;

      if (json.success) {
        setServices(json.data);
        setTotalPages(json.totalPages || 1);
        setTotalCount(json.total || json.data.length);
        
        // Update globally suggested services for the cart
        if (json.suggestedService) {
           updateSuggestions(json.suggestedService);
        }
      }
    } catch (error) {
      console.error('Services API Error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchServices(currentPage);
    }
  }, [id, currentPage]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const renderItem = ({ item }: { item: Service }) => {
    const reg = typeof item.regularPrice === 'string' 
      ? parseFloat(item.regularPrice.replace(/[^0-9.]/g, '')) 
      : item.regularPrice;
    const sale = typeof item.salePrice === 'string' 
      ? parseFloat(item.salePrice.replace(/[^0-9.]/g, '')) 
      : item.salePrice;
    
    const discountAmount = reg - sale;
    
    return (
      <ServiceCard
        item={{
          id: item._id,
          name: item.name,
          description: item.description,
          regularPrice: `₹${reg}`,
          salePrice: `₹${sale}`,
          duration: `${item.duration} mins`,
          image: item.images && item.images.length > 0 ? item.images[0] : 'https://via.placeholder.com/150',
          tags: [],
          discount: discountAmount > 0 ? `₹${discountAmount} OFF` : undefined,
        }}
      />
    );
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }

    return (
      <View style={styles.paginationContainer}>
        <Text style={styles.totalInfo}>{totalCount} services in total</Text>
        <View style={styles.pageButtons}>
          <TouchableOpacity
            style={[styles.pageButton, currentPage === 1 && styles.disabledButton]}
            onPress={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <Ionicons name="chevron-back" size={20} color={currentPage === 1 ? Colors.textMuted : Colors.primary} />
          </TouchableOpacity>

          {pages.map((p) => (
            <TouchableOpacity
              key={p}
              style={[styles.pageButton, currentPage === p && styles.activePageButton]}
              onPress={() => handlePageChange(p)}
            >
              <Text style={[styles.pageButtonText, currentPage === p && styles.activePageButtonText]}>
                {p}
              </Text>
            </TouchableOpacity>
          ))}

          <TouchableOpacity
            style={[styles.pageButton, currentPage === totalPages && styles.disabledButton]}
            onPress={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <Ionicons name="chevron-forward" size={20} color={currentPage === totalPages ? Colors.textMuted : Colors.primary} />
          </TouchableOpacity>
        </View>
      </View>
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
          <View style={{ flex: 1 }}>
            <FlatList
              key="services-grid"
              data={services}
              keyExtractor={(item) => item._id}
              renderItem={renderItem}
              numColumns={2}
              columnWrapperStyle={styles.columnWrapper}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
              ListFooterComponent={renderPagination}
            />
          </View>
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
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  totalInfo: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  pageButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  pageButton: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.borderMedium,
    ...Shadows.sm,
  },
  pageButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.dark,
  },
  activePageButton: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  activePageButtonText: {
    color: Colors.white,
  },
  disabledButton: {
    opacity: 0.5,
  },
});
