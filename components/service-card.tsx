import { BorderRadius, Colors, Shadows, Spacing, Typography } from '@/constants/theme';
import { useCart } from '@/contexts/cart-context';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Animated } from 'react-native';

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
  rating?: string;
  reviewCount?: string;
  discount?: string;
}

interface ServiceCardProps {
  item: ServiceItem;
  onPress?: () => void;
  onAddToCart?: (isAdded: boolean) => void;
  onRemoveFromCart?: () => void;
}

export function ServiceCard({ item, onPress, onAddToCart, onRemoveFromCart }: ServiceCardProps) {
  const { addToCart, removeFromCart, cartItems } = useCart();
  const currentItem = cartItems.find(i => i.id === item.id);
  const isAdded = !!currentItem;
  
  const scaleAnim = React.useRef(new Animated.Value(1)).current;

  const handleAdd = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 0.95, duration: 100, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, friction: 3, useNativeDriver: true }),
    ]).start();

    addToCart({
      id: item.id,
      name: item.name,
      price: parseFloat(item.salePrice.replace(/[^0-9.]/g, '')),
      image: item.image,
    });
    onAddToCart?.(true);
  };

  const handleRemove = () => {
    removeFromCart(item.id);
    onRemoveFromCart?.();
  };

  return (
    <View style={styles.card}>
      <TouchableOpacity activeOpacity={0.9} onPress={onPress}>
        {/* Image Section */}
        <View style={styles.imageContainer}>
          <Image 
            source={typeof item.image === 'string' ? { uri: item.image } : item.image} 
            style={styles.image} 
            resizeMode="cover" 
          />
          
          {/* Action Button - Absolute Positioned */}
          <View style={styles.actionButtonContainer}>
            {!isAdded ? (
              <TouchableOpacity 
                style={styles.addButton} 
                onPress={handleAdd}
                activeOpacity={0.8}
              >
                <Text style={styles.addText}>ADD</Text>
              </TouchableOpacity>
            ) : (
              <View style={styles.quantityBar}>
                <TouchableOpacity onPress={handleRemove} style={styles.qtyBtn}>
                  <Ionicons name="remove" size={18} color={Colors.white} />
                </TouchableOpacity>
                <Text style={styles.qtyText}>1</Text>
                <TouchableOpacity disabled style={[styles.qtyBtn, { opacity: 0.5 }]}>
                  <Ionicons name="add" size={18} color={Colors.white} />
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>

        {/* Content Section */}
        <View style={styles.info}>
          {/* Discount Label - Minimal style from reference */}
          {item.discount && (
            <Text style={styles.discountText}>{item.discount}</Text>
          )}

          {/* Dashed Separator */}
          <View style={styles.dashedLine} />

          {/* Name & Details */}
          <Text style={styles.name} numberOfLines={2}>{item.name}</Text>
          <Text style={styles.description} numberOfLines={1}>{item.duration} • {item.description}</Text>

          {/* Price Row */}
          <View style={styles.priceContainer}>
             <Text style={styles.salePriceText}>{item.salePrice}</Text>
             <Text style={styles.regularPriceText}>{item.regularPrice}</Text>
          </View>

          {/* Rating */}
          <View style={styles.ratingRow}>
            <Ionicons name="star" size={12} color={Colors.success} />
            <Text style={styles.ratingText}>4.9 (15.5k)</Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: cardWidth,
    backgroundColor: Colors.white,
    borderRadius: 16,
    marginBottom: Spacing.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.sm,
  },
  imageContainer: {
    width: '100%',
    height: cardWidth,
    position: 'relative',
    backgroundColor: Colors.backgroundTertiary,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  actionButtonContainer: {
    position: 'absolute',
    bottom: 10,
    right: 10,
  },
  addButton: {
    backgroundColor: Colors.white,
    paddingHorizontal: 18,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.primary,
    minWidth: 70,
    alignItems: 'center',
    ...Shadows.sm,
  },
  addText: {
    color: Colors.primary,
    fontWeight: '800',
    fontSize: 13,
  },
  quantityBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    borderRadius: 8,
    height: 36,
    minWidth: 80,
    justifyContent: 'space-between',
    paddingHorizontal: 4,
    ...Shadows.sm,
  },
  qtyBtn: {
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  qtyText: {
    color: Colors.white,
    fontWeight: 'bold',
    fontSize: 14,
  },
  info: {
    padding: 10,
  },
  discountText: {
    color: Colors.success,
    fontWeight: '700',
    fontSize: 13,
    marginBottom: 4,
  },
  dashedLine: {
    height: 1,
    borderWidth: 0.5,
    borderColor: Colors.borderMedium,
    borderStyle: 'dashed',
    marginVertical: 8,
  },
  name: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.dark,
    lineHeight: 18,
    marginBottom: 4,
  },
  description: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginBottom: 6,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  salePriceText: {
    color: Colors.dark,
    fontWeight: '800',
    fontSize: 15,
  },
  regularPriceText: {
    color: Colors.textLight,
    textDecorationLine: 'line-through',
    fontSize: 13,
    fontWeight: '500',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  ratingText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
});
