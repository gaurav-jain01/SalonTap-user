import { Gender, GenderToggle } from '@/components/gender-toggle';
import { BorderRadius, Colors, Shadows, Spacing } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScreenHeader } from '@/components/screen-header';
import { ApiEndpoints } from '@/constants/ApiEndpoints';
import { Image } from 'expo-image';

import { router } from 'expo-router';
import { LoadingWrapper } from '@/components/loading/loading-wrapper';

export default function CategoriesScreen() {
  const [selectedGender, setSelectedGender] = useState<Gender>('women');
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(ApiEndpoints.home.home);
        const json = await response.json();
        if (json.success) {
          setCategories(json.data.categories);
        }
      } catch (error) {
        console.error('API Error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const filteredCategories = categories.filter((cat) => {
    // Currently API categories don't have gender filtering, but we keep the logic structure.
    // If Men is selected, we might want to show nothing or a message.
    const matchesSearch = cat.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <ScreenHeader title="Categories" subtitle="Browse all services" />

      <LoadingWrapper loading={loading} type="skeleton" skeletonType="grid" count={9}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Gender Toggle */}
        <GenderToggle selected={selectedGender} onChange={setSelectedGender} />

        {selectedGender === 'men' ? (
          <View style={styles.comingSoonContainer}>
            <Ionicons name="time-outline" size={60} color={Colors.textMuted} />
            <Text style={styles.comingSoonHeader}>Coming Soon!</Text>
            <Text style={styles.comingSoonSub}>
              We are working hard to bring men's services to your area. Stay tuned!
            </Text>
          </View>
        ) : (
          <>
            {/* Search Bar */}
            <View style={styles.searchBar}>
              <Ionicons name="search" size={20} color={Colors.textMuted} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search categories..."
                placeholderTextColor={Colors.textLight}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => setSearchQuery('')}>
                  <Ionicons name="close-circle" size={20} color={Colors.textMuted} />
                </TouchableOpacity>
              )}
            </View>

            {/* Results Count */}
            <Text style={styles.resultCount}>
              {filteredCategories.length} categories found
            </Text>

            {/* Categories Grid */}
            <View style={styles.grid}>
              {filteredCategories.map((cat) => (
                <TouchableOpacity
                  key={cat._id}
                  style={styles.card}
                  activeOpacity={0.7}
                  onPress={() =>
                    router.push({
                      pathname: '/sub-categories/[id]',
                      params: { id: cat._id, name: cat.name },
                    })
                  }
                >
                  <View style={styles.iconCircle}>
                    <Image
                      source={{ uri: cat.image }}
                      style={styles.categoryImage}
                      contentFit="contain"
                    />
                  </View>
                  <Text style={styles.cardName} numberOfLines={1}>
                    {cat.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}
        </ScrollView>
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
  scrollContent: {
    paddingBottom: 30,
  },
  // Search
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    marginHorizontal: Spacing.xl,
    marginTop: Spacing.lg,
    paddingHorizontal: Spacing.md,
    height: 48,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: Spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: Colors.dark,
  },
  // Result count
  resultCount: {
    fontSize: 13,
    color: Colors.textMuted,
    paddingHorizontal: Spacing.xl,
    marginTop: Spacing.md,
    marginBottom: Spacing.sm,
  },
  // Grid
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: Spacing.xl,
    gap: Spacing.md,
  },
  card: {
    width: '30%',
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.sm,
    alignItems: 'center',
    ...Shadows.sm,
    marginBottom: 10,
  },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  categoryImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  cardName: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.dark,
    textAlign: 'center',
  },
  // Coming Soon
  comingSoonContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
    paddingHorizontal: 40,
  },
  comingSoonHeader: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.dark,
    marginTop: 20,
    marginBottom: 10,
  },
  comingSoonSub: {
    fontSize: 14,
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: 20,
  },
});
