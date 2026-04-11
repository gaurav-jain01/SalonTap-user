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
          
          {/* Duration Badge */}
          <View style={styles.durationBadge}>
            <Text style={styles.durationText}>{item.duration}</Text>
          </View>

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
          {/* Prices Row */}
          <View style={styles.priceContainer}>
             <Text style={styles.salePriceText}>{item.salePrice}</Text>
             <Text style={styles.regularPriceText}>{item.regularPrice}</Text>
             {item.discount && (
               <Text style={styles.discountBadgeText}>{item.discount}</Text>
             )}
          </View>

          {/* Minimal Dashed Separator */}
          <View style={styles.dashedLine} />

          {/* Name & Details */}
          <Text style={styles.name} numberOfLines={2}>{item.name}</Text>
          <Text style={styles.description} numberOfLines={1}>{item.description}</Text>

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
    borderRadius: 20, // More rounded as requested
    marginBottom: Spacing.md,
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
  durationBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    ...Shadows.sm,
  },
  durationText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.dark,
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
    borderWidth: 1.5,
    borderColor: '#007084', // Specific teal color from reference
    minWidth: 70,
    alignItems: 'center',
    ...Shadows.sm,
  },
  addText: {
    color: '#007084',
    fontWeight: '800',
    fontSize: 13,
  },
  quantityBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007084',
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
    padding: 12,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4, // Reduced space
  },
  salePriceText: {
    color: Colors.dark,
    fontWeight: '800',
    fontSize: 16,
  },
  regularPriceText: {
    color: Colors.textLight,
    textDecorationLine: 'line-through',
    fontSize: 13,
    fontWeight: '500',
  },
  discountBadgeText: {
    color: Colors.success,
    fontWeight: '700',
    fontSize: 12,
    marginLeft: 'auto', // Pushes to the right
  },
  dashedLine: {
    height: 1,
    borderWidth: 0.5,
    borderColor: Colors.borderLight,
    borderStyle: 'dotted', // Dotted looks cleaner for minimal style
    marginVertical: 6, // Reduced space
  },
  name: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.dark,
    lineHeight: 18,
    marginBottom: 2,
  },
  description: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginBottom: 6,
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
