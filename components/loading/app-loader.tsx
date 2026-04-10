import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/theme';

interface AppLoaderProps {
  size?: 'small' | 'medium' | 'large';
  color?: string;
}

const SIZES = {
  small: 20,
  medium: 32,
  large: 48,
};

export const AppLoader: React.FC<AppLoaderProps> = ({ 
  size = 'medium', 
  color = Colors.primary 
}) => {
  const iconSize = SIZES[size];
  const scale = useSharedValue(0.9);
  const rotate = useSharedValue(0);
  const opacity = useSharedValue(0.6);

  useEffect(() => {
    // Scale loop
    scale.value = withRepeat(
      withSequence(
        withTiming(1.1, { duration: 600, easing: Easing.bezier(0.4, 0, 0.2, 1) }),
        withTiming(0.9, { duration: 600, easing: Easing.bezier(0.4, 0, 0.2, 1) })
      ),
      -1,
      true
    );

    // Rotation loop (subtle left-right)
    rotate.value = withRepeat(
      withSequence(
        withTiming(10, { duration: 300 }),
        withTiming(-10, { duration: 600 }),
        withTiming(0, { duration: 300 })
      ),
      -1,
      true
    );

    // Opacity fade
    opacity.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 600 }),
        withTiming(0.6, { duration: 600 })
      ),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { rotate: `${rotate.value}deg` }
    ],
    opacity: opacity.value,
  }));

  return (
    <View style={styles.container}>
      <Animated.View style={[animatedStyle, { width: iconSize, height: iconSize, alignItems: 'center', justifyContent: 'center' }]}>
        <Ionicons name="cut-outline" size={iconSize} color={color} />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
