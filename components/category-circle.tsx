import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors } from '@/constants/theme';

export interface CategoryItem {
  id: string;
  name: string;
  icon: string;
  color: string;
  bgColor: string;
}

interface CategoryCircleProps {
  item: CategoryItem;
  onPress?: () => void;
}

export function CategoryCircle({ item, onPress }: CategoryCircleProps) {
  return (
    <TouchableOpacity style={styles.container} activeOpacity={0.7} onPress={onPress}>
      <View style={[styles.circle, { backgroundColor: item.bgColor }]}>
        <MaterialCommunityIcons name={item.icon as any} size={26} color={item.color} />
      </View>
      <Text style={styles.label}>{item.name}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  circle: {
    width: 65,
    height: 65,
    borderRadius: 32.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    marginTop: 8,
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textBody,
  },
});
