import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
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

import { ScreenHeader } from '@/components/screen-header';
import { ApiEndpoints } from '@/constants/ApiEndpoints';
import { BorderRadius, Colors, Shadows, Spacing } from '@/constants/theme';
import { LoadingWrapper } from '@/components/loading/loading-wrapper';

interface SubCategory {
  _id: string;
  name: string;
  image: string;
  description: string;
  category: string;
}

export default function SubCategoriesScreen() {
  const { id, name } = useLocalSearchParams<{ id: string; name: string }>();
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const fetchSubCategories = async (page: number) => {
    try {
      setLoading(true);
      // Assuming subcategories endpoint also supports page/limit
      const url = `${ApiEndpoints.home.subCategories(id)}?page=${page}&limit=10`;
      const response = await fetch(url);
      const json = await response.json();

      if (json.success) {
        setSubCategories(json.data);
        setTotalPages(json.totalPages || 1);
        setTotalCount(json.total || json.data.length);
      }
    } catch (error) {
      console.error('Subcategories API Error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchSubCategories(currentPage);
    }
  }, [id, currentPage]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const renderItem = ({ item }: { item: SubCategory }) => (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.85}
      onPress={() =>
        router.push({
          pathname: '/services/[id]',
          params: { id: item._id, name: item.name },
        })
      }
    >
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: item.image }}
          style={styles.image}
          contentFit="cover"
        />
      </View>
      <View style={styles.info}>
        <Text style={styles.subName} numberOfLines={1}>
          {item.name}
        </Text>
        {item.description && (
          <Text style={styles.subDescription} numberOfLines={2}>
            {item.description}
          </Text>
        )}
        
        <TouchableOpacity 
          style={styles.exploreButton}
          activeOpacity={0.7}
          onPress={() =>
            router.push({
              pathname: '/services/[id]',
              params: { id: item._id, name: item.name },
            })
          }
        >
          <Text style={styles.exploreButtonText}>Explore Services</Text>
          <Ionicons name="arrow-forward" size={14} color={Colors.white} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }

    return (
      <View style={styles.paginationContainer}>
        <Text style={styles.totalInfo}>{totalCount} sub-categories in total</Text>
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
        title={name || 'Sub Categories'}
        showBackButton
        onBackPress={() => router.back()}
      />

      <LoadingWrapper loading={loading} type="skeleton" skeletonType="grid" count={6}>
        {subCategories.length === 0 ? (
          <View style={styles.centered}>
            <Ionicons name="search-outline" size={64} color={Colors.textMuted} />
            <Text style={styles.noDataText}>No subcategories found</Text>
          </View>
        ) : (
          <View style={{ flex: 1 }}>
            <FlatList
              key="subcategory-grid"
              data={subCategories}
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
    padding: Spacing.md,
    paddingBottom: 40,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  card: {
    width: '48%',
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.md,
    overflow: 'hidden',
    ...Shadows.sm,
  },
  imageContainer: {
    width: '100%',
    height: 120,
    backgroundColor: '#f5f5f5',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  info: {
    padding: Spacing.sm,
  },
  subName: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.dark,
    marginBottom: 4,
  },
  subDescription: {
    fontSize: 11,
    color: Colors.textMuted,
    lineHeight: 14,
    marginBottom: 8,
  },
  exploreButton: {
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    borderRadius: BorderRadius.sm,
    gap: 4,
    marginTop: 'auto',
  },
  exploreButtonText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.white,
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
