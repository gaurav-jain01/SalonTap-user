import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, Shadows } from '@/constants/theme';

export type Gender = 'men' | 'women';

interface GenderToggleProps {
  selected: Gender;
  onChange: (gender: Gender) => void;
  lockMen?: boolean;
}

export function GenderToggle({ selected, onChange, lockMen }: GenderToggleProps) {
  return (
    <View style={styles.container}>
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

      <TouchableOpacity
        style={[
          styles.tab, 
          selected === 'men' && styles.activeTab,
          lockMen && styles.lockedTab
        ]}
        activeOpacity={lockMen ? 1 : 0.7}
        onPress={() => !lockMen && onChange('men')}
      >
        <Ionicons
          name="male"
          size={18}
          color={selected === 'men' ? Colors.white : Colors.textMuted}
        />
        <View style={styles.menLabelContainer}>
          <Text style={[styles.label, selected === 'men' && styles.activeLabel]}>Men</Text>
          <Text style={[styles.comingSoonText, selected === 'men' && styles.activeLabel]}>
            (Coming Soon)
          </Text>
        </View>
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
  lockedTab: {
    opacity: 0.5,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.textMuted,
  },
  activeLabel: {
    color: Colors.white,
  },
  menLabelContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  comingSoonText: {
    fontSize: 8,
    fontWeight: '500',
    color: Colors.textMuted,
    marginTop: -2,
  },
});
