import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Shadows } from '@/constants/theme';

interface CircleIconButtonProps {
  name: keyof typeof Ionicons.glyphMap;
  size?: number;
  color?: string;
  onPress?: () => void;
}

export function CircleIconButton({
  name,
  size = 24,
  color = Colors.textDark,
  onPress,
}: CircleIconButtonProps) {
  return (
    <TouchableOpacity style={styles.button} activeOpacity={0.7} onPress={onPress}>
      <Ionicons name={name} size={size} color={color} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.sm,
  },
});
