import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Colors, Spacing, Shadows } from '@/constants/theme';

import { useCart } from '@/contexts/cart-context';

interface ScreenHeaderProps {
  title: string;
  subtitle?: string;
  showBackButton?: boolean;
  onBackPress?: () => void;
  showCartButton?: boolean;
}

export function ScreenHeader({ 
  title, 
  subtitle, 
  showBackButton = true,
  onBackPress,
  showCartButton = false
}: ScreenHeaderProps) {
  const { totalItems } = useCart();
  const handleBack = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      if (router.canGoBack()) {
        router.back();
      }
    }
  };

  return (
    <View style={styles.header}>
      {showBackButton && (
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={Colors.dark} />
        </TouchableOpacity>
      )}
      <View style={styles.titleContainer}>
        <Text style={styles.headerTitle}>{title}</Text>
        {subtitle && <Text style={styles.headerSubtitle}>{subtitle}</Text>}
      </View>
      {showCartButton && totalItems > 0 && (
        <TouchableOpacity 
          onPress={() => router.push('/cart')} 
          style={styles.cartButton}
        >
          <Ionicons name="cart-outline" size={24} color={Colors.dark} />
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{totalItems}</Text>
          </View>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.md,
    backgroundColor: Colors.white,
    ...Shadows.md,
    gap: Spacing.md,
    zIndex: 10,
  },
  backButton: {
    padding: 4,
    marginLeft: -4,
  },
  titleContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 20, // Normalized size (reduced from 24/22)
    fontWeight: '700',
    color: Colors.dark,
  },
  headerSubtitle: {
    fontSize: 13,
    color: Colors.textMuted,
    marginTop: 2,
  },
  cartButton: {
    padding: 8,
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: Colors.primary,
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 2,
    borderWidth: 1.5,
    borderColor: Colors.white,
  },
  badgeText: {
    color: Colors.white,
    fontSize: 8,
    fontWeight: '900',
  },
});
