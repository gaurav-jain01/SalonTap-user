import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, View, FlatList, Image, Dimensions } from 'react-native';
import { Colors, Spacing, BorderRadius } from '@/constants/theme';

const { width } = Dimensions.get('window');

export interface BannerItem {
  id: string;
  image: any; // require() returns a number
}

interface AutoScrollBannerProps {
  banners: BannerItem[];
  autoPlayInterval?: number;
}

export function AutoScrollBanner({ banners, autoPlayInterval = 3000 }: AutoScrollBannerProps) {
  const flatListRef = useRef<FlatList>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      let nextIndex = currentIndex + 1;
      if (nextIndex >= banners.length) {
        nextIndex = 0;
      }
      setCurrentIndex(nextIndex);
      flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [currentIndex, banners.length, autoPlayInterval]);

  const renderBanner = ({ item }: { item: BannerItem }) => (
    <View style={styles.bannerContainer}>
      <Image source={item.image} style={styles.bannerImage} resizeMode="cover" />
    </View>
  );

  return (
    <View style={styles.wrapper}>
      <FlatList
        ref={flatListRef}
        data={banners}
        renderItem={renderBanner}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(e) => {
          const newIndex = Math.round(e.nativeEvent.contentOffset.x / width);
          setCurrentIndex(newIndex);
        }}
      />
      {/* Pagination Dots */}
      <View style={styles.paginationContainer}>
        {banners.map((_, index) => (
          <View
            key={index}
            style={[
              styles.paginationDot,
              currentIndex === index && styles.paginationDotActive,
            ]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    height: 200,
    marginTop: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  bannerContainer: {
    width: width,
    paddingHorizontal: Spacing.lg,
    alignItems: 'center',
  },
  bannerImage: {
    width: '100%',
    height: '100%',
    borderRadius: BorderRadius.lg,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    gap: 6,
  },
  paginationDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.paginationInactive,
  },
  paginationDotActive: {
    width: 16,
    height: 6,
    backgroundColor: Colors.primary,
  },
});
