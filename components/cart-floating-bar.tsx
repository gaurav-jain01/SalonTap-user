import { Colors, Shadows, Spacing } from '@/constants/theme';
import { useCart } from '@/contexts/cart-context';
import { Ionicons } from '@expo/vector-icons';
import { router, useSegments, usePathname } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import { Animated, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export const CartFloatingBar = () => {
  const { cartItems, totalItems } = useCart();
  const segments = useSegments();
  const pathname = usePathname();

  // Check if we are in the tabs group
  const isInTabs = segments[0] === '(tabs)';
  const bottomOffset = isInTabs ? 90 : 40;
  
  const animatedBottom = useRef(new Animated.Value(bottomOffset)).current;

  useEffect(() => {
    Animated.spring(animatedBottom, {
      toValue: bottomOffset,
      useNativeDriver: false,
      friction: 8,
      tension: 40,
    }).start();
  }, [bottomOffset]);

  // Hooks must be called before conditional returns
  const isHiddenScreen = pathname === '/cart' || pathname === '/addresses' || pathname === '/offers';
  if (totalItems === 0 || isHiddenScreen) return null;

  // Get first few items for the avatar group
  const displayItems = cartItems.slice(0, 3);

  return (
    <Animated.View style={[styles.container, { bottom: animatedBottom }]}>
      <TouchableOpacity
        style={styles.bar}
        activeOpacity={0.9}
        onPress={() => router.push('/cart' as any)}
      >
        <View style={styles.content}>
          <View style={styles.leftSection}>
            <View style={styles.avatarGroup}>
              {displayItems.map((item: any, index: number) => (
                <View
                  key={item.id}
                  style={[
                    styles.avatarWrapper,
                    { marginLeft: index === 0 ? 0 : -15, zIndex: displayItems.length - index }
                  ]}
                >
                  <Image source={typeof item.image === 'string' ? { uri: item.image } : item.image} style={styles.avatar} />
                </View>
              ))}
              {cartItems.length > 3 && (
                <View style={[styles.avatarWrapper, styles.extraCount, { marginLeft: -15, zIndex: 0 }]}>
                  <Text style={styles.extraCountText}>+{cartItems.length - 3}</Text>
                </View>
              )}
            </View>
          </View>

          <View style={styles.centerSection}>
            <Text style={styles.viewCartText}>View Cart</Text>
            <Text style={styles.itemCountText}>{totalItems} {totalItems === 1 ? 'item' : 'items'}</Text>
          </View>

          <View style={styles.rightSection}>
            <Ionicons name="chevron-forward" size={20} color={Colors.white} />
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: '100%',
    alignItems: 'center',
    zIndex: 1000,
    paddingHorizontal: 20,
  },
  bar: {
    backgroundColor: Colors.primary,
    borderRadius: 35, // Oval shape
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.xl,
    minHeight: 65,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.lg,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    maxWidth: '100%',
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: Spacing.lg,
  },
  avatarGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarWrapper: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
    overflow: 'hidden',
    backgroundColor: Colors.white,
  },
  avatar: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  extraCount: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.accent,
  },
  extraCountText: {
    color: Colors.white,
    fontSize: 11,
    fontWeight: 'bold',
  },
  centerSection: {
    justifyContent: 'center',
    marginHorizontal: Spacing.md,
  },
  viewCartText: {
    color: Colors.white,
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  itemCountText: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 1,
  },
  rightSection: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: Spacing.md,
  },
});
