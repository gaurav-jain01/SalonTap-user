import React, { useEffect } from 'react';
import { StyleSheet, View, ViewStyle, DimensionValue } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  Easing,
  interpolate,
} from 'react-native-reanimated';
import { Colors } from '@/constants/theme';

interface AppSkeletonProps {
  width?: DimensionValue;
  height?: DimensionValue;
  borderRadius?: number;
  style?: ViewStyle;
  marginBottom?: number;
  marginRight?: number;
}

export const SkeletonBox: React.FC<AppSkeletonProps> = ({
  width = '100%',
  height = 20,
  borderRadius = 8,
  marginBottom,
  marginRight,
  style,
}) => {
  const shimmer = useSharedValue(0);

  useEffect(() => {
    shimmer.value = withRepeat(
      withTiming(1, {
        duration: 1500,
        easing: Easing.bezier(0.4, 0, 0.2, 1),
      }),
      -1,
      false
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      shimmer.value,
      [0, 0.5, 1],
      [0.3, 0.7, 0.3]
    );
    return {
      opacity,
    };
  });

  return (
    <Animated.View
      style={[
        styles.skeleton,
        { width, height, borderRadius, marginBottom, marginRight },
        style,
        animatedStyle,
      ]}
    />
  );
};

export const CardSkeleton = () => (
  <View style={styles.cardContainer}>
    <SkeletonBox height={120} borderRadius={16} />
    <View style={styles.cardContent}>
      <SkeletonBox width="60%" height={18} marginBottom={8} />
      <SkeletonBox width="40%" height={14} />
    </View>
  </View>
);

export const ListSkeleton = () => (
  <View style={styles.listItem}>
    <SkeletonBox width={60} height={60} borderRadius={12} marginRight={12} />
    <View style={styles.flex1}>
      <SkeletonBox width="80%" height={16} marginBottom={8} />
      <SkeletonBox width="50%" height={12} />
    </View>
  </View>
);

export const GridSkeleton = () => (
  <View style={styles.gridItem}>
    <SkeletonBox height={100} borderRadius={12} marginBottom={8} />
    <SkeletonBox width="100%" height={14} />
  </View>
);

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: '#F0F2F5',
  },
  cardContainer: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 12,
    marginBottom: 16,
  },
  cardContent: {
    marginTop: 12,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  flex1: {
    flex: 1,
  },
  gridItem: {
    width: '48%',
    marginBottom: 20,
  },
});
