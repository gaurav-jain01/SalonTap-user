import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, BorderRadius, Shadows } from '@/constants/theme';

const cardWidth = (Dimensions.get('window').width - Spacing.xl * 2 - Spacing.md) / 2;

export interface ServiceItem {
  id: string;
  name: string;
  description: string;
  regularPrice: string;
  salePrice: string;
  rating: number;
  image: any;
  tags: string[];
}

interface ServiceCardProps {
  item: ServiceItem;
  onPress?: () => void;
  onBook?: () => void;
}

export function ServiceCard({ item, onPress, onBook }: ServiceCardProps) {
  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.85} onPress={onPress}>
      {/* Image */}
      <View style={styles.imageWrapper}>
        <Image source={item.image} style={styles.image} resizeMode="cover" />
        {/* Rating badge */}
        <View style={styles.ratingBadge}>
          <Ionicons name="star" size={10} color="#fff" />
          <Text style={styles.ratingText}>{item.rating}</Text>
        </View>
      </View>

      {/* Tags */}
      <View style={styles.tagsRow}>
        {item.tags.map((tag, i) => (
          <View key={i} style={styles.tag}>
            <Text style={styles.tagText}>{tag}</Text>
          </View>
        ))}
      </View>

      {/* Info */}
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
        <Text style={styles.description} numberOfLines={2}>{item.description}</Text>

        {/* Price row */}
        <View style={styles.priceRow}>
          <Text style={styles.salePrice}>{item.salePrice}</Text>
          <Text style={styles.regularPrice}>{item.regularPrice}</Text>
        </View>

        {/* Book button */}
        <TouchableOpacity style={styles.bookButton} activeOpacity={0.7} onPress={onBook}>
          <Text style={styles.bookButtonText}>Book Now</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: cardWidth,
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.md,
    overflow: 'hidden',
    ...Shadows.sm,
    marginBottom: Spacing.md,
  },
  imageWrapper: {
    position: 'relative',
  },
  image: {
    width: '100%',
    height: cardWidth * 0.7,
  },
  ratingBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    gap: 3,
  },
  ratingText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#fff',
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: Spacing.sm,
    paddingTop: Spacing.sm,
    gap: 4,
  },
  tag: {
    backgroundColor: Colors.primaryLight + '1A', // 10% opacity
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 20,
  },
  tagText: {
    fontSize: 9,
    fontWeight: '600',
    color: Colors.primary,
  },
  info: {
    padding: Spacing.sm,
    paddingTop: 6,
  },
  name: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.dark,
    marginBottom: 2,
  },
  description: {
    fontSize: 10,
    lineHeight: 14,
    color: Colors.textMuted,
    marginBottom: 6,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  salePrice: {
    fontSize: 15,
    fontWeight: '800',
    color: Colors.primary,
  },
  regularPrice: {
    fontSize: 11,
    color: Colors.textLight,
    textDecorationLine: 'line-through',
  },
  bookButton: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.sm,
    paddingVertical: 7,
    alignItems: 'center',
  },
  bookButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.white,
  },
});
