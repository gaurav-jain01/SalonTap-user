import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Alert, FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors, Spacing, GlobalStyles } from '@/constants/theme';

const settingsOptions: { id: string; title: string; icon: keyof typeof Ionicons.glyphMap; route?: string; action?: string }[] = [
  { id: '1', title: 'Profile', icon: 'person-outline', route: '/profile' },
  { id: '2', title: 'Wallet', icon: 'wallet-outline', route: '/wallet' },
  { id: '3', title: 'Transactions', icon: 'receipt-outline', route: '/transactions' },
  { id: '4', title: 'Help', icon: 'help-circle-outline', route: '/help' },
  { id: '5', title: 'Privacy Policy', icon: 'shield-checkmark-outline', route: '/privacy-policy' },
  { id: '6', title: 'Terms & Conditions', icon: 'document-text-outline', route: '/terms-conditions' },
  { id: '7', title: 'Logout', icon: 'log-out-outline', action: 'logout' },
];

export default function SettingsScreen() {

  const handlePress = (item: any) => {
    if (item.action === 'logout') {
      Alert.alert("Logout", "Are you sure you want to logout?", [
        { text: "Cancel", style: "cancel" },
        { text: "Logout", style: "destructive", onPress: () => console.log("Logout pressed") }
      ]);
      return;
    }
    
    if (item.route) {
      router.push(item.route);
    }
  };

  return (
    <ThemedView style={[GlobalStyles.screenContainer, GlobalStyles.screenPadding]}>
      <ThemedText type="title" style={styles.title}>
        Settings
      </ThemedText>

      <FlatList
        data={settingsOptions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.item}
            onPress={() => handlePress(item)}
          >
            <View style={GlobalStyles.row}>
              <Ionicons name={item.icon} size={22} color={Colors.textDark} />
              <ThemedText style={styles.text}>{item.title}</ThemedText>
            </View>

            <Ionicons name="chevron-forward" size={20} color={Colors.textLight} />
          </TouchableOpacity>
        )}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  title: {
    marginBottom: Spacing.xl,
  },

  item: {
    paddingVertical: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  text: {
    fontSize: 16,
    marginLeft: Spacing.md,
  },
});