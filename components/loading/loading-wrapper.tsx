import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withDelay,
} from 'react-native-reanimated';
import { Colors } from '@/constants/theme';
import { AppLoader } from './app-loader';
import { CardSkeleton, ListSkeleton, GridSkeleton, SkeletonBox } from './app-skeleton';

interface LoadingWrapperProps {
  loading: boolean;
  children: React.ReactNode;
  type: 'skeleton' | 'loader';
  skeletonType?: 'card' | 'list' | 'grid' | 'custom';
  count?: number; // How many skeletons to show
  skeletonProps?: any; // For custom skeleton
}

export const LoadingWrapper: React.FC<LoadingWrapperProps> = ({
  loading,
  children,
  type,
  skeletonType = 'card',
  count = 3,
  skeletonProps,
}) => {
  const contentOpacity = useSharedValue(0);

  useEffect(() => {
    if (!loading) {
      contentOpacity.value = withTiming(1, { duration: 500 });
    } else {
      contentOpacity.value = 0;
    }
  }, [loading]);

  const animatedContentStyle = useAnimatedStyle(() => ({
    opacity: contentOpacity.value,
  }));

  if (loading) {
    if (type === 'loader') {
      return (
        <View style={styles.centerContainer}>
          <AppLoader size="large" />
        </View>
      );
    }

    return (
      <View style={[
        styles.skeletonContainer, 
        skeletonType === 'grid' && styles.gridWrapper
      ]}>
        {Array.from({ length: count }).map((_, index) => {
          switch (skeletonType) {
            case 'card':
              return <CardSkeleton key={index} />;
            case 'list':
              return <ListSkeleton key={index} />;
            case 'grid':
              return <GridSkeleton key={index} />;
            case 'custom':
              return <SkeletonBox key={index} {...skeletonProps} />;
            default:
              return null;
          }
        })}
      </View>
    );
  }

  return (
    <Animated.View style={[styles.flex1, animatedContentStyle]}>
      {children}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  flex1: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  skeletonContainer: {
    flex: 1,
    padding: 16,
    backgroundColor: Colors.backgroundSecondary,
  },
  gridWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
});
