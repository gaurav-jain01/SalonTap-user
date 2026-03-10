import { Gender, GenderToggle } from '@/components/gender-toggle';
import { BorderRadius, Colors, Shadows, Spacing } from '@/constants/theme';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScreenHeader } from '@/components/screen-header';

interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  bgColor: string;
  count: number;
  gender: Gender | 'unisex';
}

const ALL_CATEGORIES: Category[] = [
  { id: '1', name: 'Haircut', icon: 'content-cut', color: '#FF6B6B', bgColor: '#FFE5E5', count: 24, gender: 'men' },
  { id: '2', name: 'Shaving', icon: 'content-cut', color: '#607D8B', bgColor: '#ECEFF1', count: 12, gender: 'men' },
  { id: '3', name: 'Beard', icon: 'face-man', color: '#795548', bgColor: '#EFEBE9', count: 8, gender: 'men' },
  { id: '4', name: 'Hair Color', icon: 'spray', color: '#FF9800', bgColor: '#FFF3E0', count: 15, gender: 'men' },
  { id: '5', name: 'Massage', icon: 'spa', color: '#4CAF50', bgColor: '#E8F5E9', count: 18, gender: 'unisex' },
  { id: '6', name: 'Facial', icon: 'face-woman-outline', color: '#9C27B0', bgColor: '#F3E5F5', count: 20, gender: 'women' },
  { id: '7', name: 'Makeup', icon: 'lipstick', color: '#E91E63', bgColor: '#FCE4EC', count: 30, gender: 'women' },
  { id: '8', name: 'Nails', icon: 'hand-wash-outline', color: '#00BCD4', bgColor: '#E0F7FA', count: 16, gender: 'women' },
  { id: '9', name: 'Hair Spa', icon: 'hair-dryer', color: '#3F51B5', bgColor: '#E8EAF6', count: 10, gender: 'women' },
  { id: '10', name: 'Waxing', icon: 'candle', color: '#FF5722', bgColor: '#FBE9E7', count: 14, gender: 'women' },
  { id: '11', name: 'Threading', icon: 'needle', color: '#009688', bgColor: '#E0F2F1', count: 8, gender: 'women' },
  { id: '12', name: 'Skin Care', icon: 'water-outline', color: '#2196F3', bgColor: '#E3F2FD', count: 22, gender: 'unisex' },
  { id: '13', name: 'Body Spa', icon: 'spa-outline', color: '#8BC34A', bgColor: '#F1F8E9', count: 12, gender: 'unisex' },
  { id: '14', name: 'Head Massage', icon: 'head-outline', color: '#673AB7', bgColor: '#EDE7F6', count: 9, gender: 'men' },
  { id: '15', name: 'Bridal', icon: 'diamond-stone', color: '#D4AF37', bgColor: '#FFF8E1', count: 6, gender: 'women' },
  { id: '16', name: 'Pedicure', icon: 'foot-print', color: '#F06292', bgColor: '#FCE4EC', count: 11, gender: 'unisex' },
];

export default function CategoriesScreen() {
  const [selectedGender, setSelectedGender] = useState<Gender>('men');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCategories = ALL_CATEGORIES.filter((cat) => {
    const matchesGender = cat.gender === selectedGender || cat.gender === 'unisex';
    const matchesSearch = cat.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesGender && matchesSearch;
  });

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <ScreenHeader title="Categories" subtitle="Browse all services" />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Gender Toggle */}
        <GenderToggle selected={selectedGender} onChange={setSelectedGender} />

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
            <TouchableOpacity key={cat.id} style={styles.card} activeOpacity={0.7}>
              <View style={[styles.iconCircle, { backgroundColor: cat.bgColor }]}>
                <MaterialCommunityIcons name={cat.icon as any} size={28} color={cat.color} />
              </View>
              <Text style={styles.cardName} numberOfLines={1}>{cat.name}</Text>
              <Text style={styles.cardCount}>{cat.count} services</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundSecondary,
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
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  cardName: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.dark,
    textAlign: 'center',
  },
  cardCount: {
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 2,
  },
});
