import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, Shadows } from '@/constants/theme';

export type Gender = 'men' | 'women';

interface GenderToggleProps {
  selected: Gender;
  onChange: (gender: Gender) => void;
}

export function GenderToggle({ selected, onChange }: GenderToggleProps) {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.tab, selected === 'men' && styles.activeTab]}
        activeOpacity={0.7}
        onPress={() => onChange('men')}
      >
        <Ionicons
          name="male"
          size={18}
          color={selected === 'men' ? Colors.white : Colors.textMuted}
        />
        <Text style={[styles.label, selected === 'men' && styles.activeLabel]}>Men</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.tab, selected === 'women' && styles.activeTab]}
        activeOpacity={0.7}
        onPress={() => onChange('women')}
      >
        <Ionicons
          name="female"
          size={18}
          color={selected === 'women' ? Colors.white : Colors.textMuted}
        />
        <Text style={[styles.label, selected === 'women' && styles.activeLabel]}>Women</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginHorizontal: Spacing.xl,
    marginTop: Spacing.xl,
    marginBottom: Spacing.md,
    backgroundColor: Colors.backgroundTertiary,
    borderRadius: 30,
    padding: 4,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 26,
    gap: 6,
  },
  activeTab: {
    backgroundColor: Colors.primary,
    ...Shadows.sm,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.textMuted,
  },
  activeLabel: {
    color: Colors.white,
  },
});
