import { BorderRadius, Colors, Shadows, Spacing } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const cardWidth = (Dimensions.get('window').width - Spacing.xl * 2 - Spacing.md) / 2;

export interface ServiceItem {
  id: string;
  name: string;
  description: string;
  regularPrice: string;
  salePrice: string;
  duration: string;
  image: any;
  tags: string[];
}

interface ServiceCardProps {
  item: ServiceItem;
  onPress?: () => void;
  onAddToCart?: (isAdded: boolean) => void;
}

export function ServiceCard({ item, onPress, onAddToCart }: ServiceCardProps) {
  const [isAdded, setIsAdded] = React.useState(false);

  const handleToggle = () => {
    const newState = !isAdded;
    setIsAdded(newState);
    onAddToCart?.(newState);
  };

  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.85} onPress={onPress}>
      {/* Image */}
      <View style={styles.imageWrapper}>
        <Image source={item.image} style={styles.image} resizeMode="cover" />
        {/* Time badge */}
        <View style={styles.timeBadge}>
          <Ionicons name="time-outline" size={10} color="#fff" />
          <Text style={styles.timeText}>{item.duration}</Text>
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
        <Text style={styles.description} numberOfLines={1}>{item.description}</Text>

        {/* Price row */}
        <View style={styles.priceRow}>
          <Text style={styles.salePrice}>{item.salePrice}</Text>
          <Text style={styles.regularPrice}>{item.regularPrice}</Text>
        </View>

        {/* Action Button */}
        {!isAdded ? (
          <TouchableOpacity 
            style={styles.addButton} 
            activeOpacity={0.7} 
            onPress={handleToggle}
          >
            <Text style={styles.addButtonText}>ADD</Text>
            <Ionicons name="add" size={14} color={Colors.primary} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity 
            style={styles.removeButton} 
            activeOpacity={0.7} 
            onPress={handleToggle}
          >
            <Text style={styles.removeButtonText}>REMOVE</Text>
            <Ionicons name="close-circle" size={14} color={Colors.white} />
          </TouchableOpacity>
        )}
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
  timeBadge: {
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
  timeText: {
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
  addButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: BorderRadius.sm,
    paddingVertical: 7,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  addButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.primary,
  },
  removeButton: {
    backgroundColor: '#333', // Darker color for remove/added state
    borderRadius: BorderRadius.sm,
    paddingVertical: 7,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  removeButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.white,
  },
});
