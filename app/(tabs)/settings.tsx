import { ScreenHeader } from '@/components/screen-header';
import { useToast } from '@/components/toast-provider';
import { BorderRadius, Colors, Shadows, Spacing } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const settingsOptions: {
  id: string;
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  route?: string;
  requiresAuth?: boolean;
}[] = [
  { id: '1', title: 'Profile', icon: 'person-outline', route: '/profile', requiresAuth: true },
  { id: '2', title: 'Wallet', icon: 'wallet-outline', route: '/wallet', requiresAuth: true },
  { id: '3', title: 'Transactions', icon: 'receipt-outline', route: '/transactions', requiresAuth: true },
  { id: '4', title: 'Help', icon: 'help-circle-outline', route: '/help' },
  { id: '5', title: 'Privacy Policy', icon: 'shield-checkmark-outline', route: '/privacy-policy' },
  { id: '6', title: 'Terms & Conditions', icon: 'document-text-outline', route: '/terms-conditions' },
];

export default function SettingsScreen() {

  const { showToast } = useToast();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    checkLogin();
  }, []);

  const checkLogin = async () => {
    const token = await AsyncStorage.getItem("token");
    setIsLoggedIn(!!token);
  };

  const requireLogin = async (route: string) => {

    const token = await AsyncStorage.getItem("token");

    if (token) {
      router.push(route as any);
    } else {
      Alert.alert(
        "Login Required",
        "Please login to continue",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Login", onPress: () => router.push("/login") }
        ]
      );
    }
  };

  const handlePress = (item: any) => {

    if (!item.route) return;

    if (item.requiresAuth) {
      requireLogin(item.route);
    } else {
      router.push(item.route);
    }

  };

  const handleLogout = () => {

    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {

          try {

            await AsyncStorage.removeItem("token");

            showToast({
              message: "Logged out successfully!",
              type: "success"
            });

            setIsLoggedIn(false);

            router.replace("/login");

          } catch (error) {
            console.log("Logout error:", error);
          }

        }
      }
    ]);

  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>

      <ScreenHeader title="Settings" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >

        {/* Profile Card */}

        <TouchableOpacity
          style={styles.profileCard}
          activeOpacity={0.7}
          onPress={() => requireLogin('/profile')}
        >

          <View style={styles.avatarCircle}>
            <Ionicons name="person" size={28} color={Colors.primary} />
          </View>

          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>User</Text>
            <Text style={styles.profilePhone}>+91 98765 43210</Text>
          </View>

          <Ionicons name="chevron-forward" size={20} color={Colors.textLight} />

        </TouchableOpacity>

        {/* Address Section */}

        <View style={styles.sectionCard}>

          <View style={styles.sectionHeaderRow}>

            <View style={styles.sectionIconRow}>
              <Ionicons name="location" size={20} color={Colors.primary} />
              <Text style={styles.sectionLabel}>Saved Addresses</Text>
            </View>

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => requireLogin('/add-address')}
            >
              <Text style={styles.addText}>+ Add</Text>
            </TouchableOpacity>

          </View>

          <View style={styles.addressItem}>

            <View style={styles.addressTag}>
              <Ionicons name="home-outline" size={14} color={Colors.primary} />
              <Text style={styles.addressTagText}>Home</Text>
            </View>

            <Text style={styles.addressText} numberOfLines={2}>
              123, MR 10 Road, Vijay Nagar, Indore, MP - 452010
            </Text>

          </View>

        </View>

        {/* Menu Options */}

        <View style={styles.sectionCard}>

          {settingsOptions.map((item, index) => (

            <TouchableOpacity
              key={item.id}
              style={[
                styles.menuItem,
                index < settingsOptions.length - 1 && styles.menuItemBorder
              ]}
              onPress={() => handlePress(item)}
              activeOpacity={0.6}
            >

              <View style={styles.menuLeft}>

                <View style={styles.menuIconCircle}>
                  <Ionicons name={item.icon} size={20} color={Colors.primary} />
                </View>

                <Text style={styles.menuText}>{item.title}</Text>

              </View>

              <Ionicons name="chevron-forward" size={18} color={Colors.textLight} />

            </TouchableOpacity>

          ))}

        </View>

        {/* Logout Button */}

        {isLoggedIn && (

          <TouchableOpacity
            style={styles.logoutButton}
            activeOpacity={0.7}
            onPress={handleLogout}
          >

            <Ionicons name="log-out-outline" size={20} color={Colors.error} />

            <Text style={styles.logoutText}>Logout</Text>

          </TouchableOpacity>

        )}

        {/* App Version */}

        <Text style={styles.versionText}>SalonTap v1.0.0</Text>

      </ScrollView>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: Colors.backgroundSecondary,
  },

  scrollContent: {
    padding: Spacing.xl,
    paddingBottom: 40,
  },

  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.md,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    ...Shadows.sm,
  },

  avatarCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
  },

  profileInfo: {
    flex: 1,
    marginLeft: Spacing.md,
  },

  profileName: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.dark,
  },

  profilePhone: {
    fontSize: 14,
    color: Colors.textMuted,
    marginTop: 2,
  },

  sectionCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.md,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    ...Shadows.sm,
  },

  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },

  sectionIconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },

  sectionLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.dark,
  },

  addText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary,
  },

  addressItem: {
    paddingVertical: Spacing.sm,
  },

  addressTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },

  addressTagText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.primary,
  },

  addressText: {
    fontSize: 13,
    lineHeight: 19,
    color: Colors.textSecondary,
    paddingLeft: 18,
  },

  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
  },

  menuItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },

  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },

  menuIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.primary + '12',
    alignItems: 'center',
    justifyContent: 'center',
  },

  menuText: {
    fontSize: 15,
    fontWeight: '500',
    color: Colors.textDark,
  },

  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.error + '30',
    paddingVertical: 14,
    marginBottom: Spacing.xl,
    ...Shadows.sm,
  },

  logoutText: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.error,
  },

  versionText: {
    textAlign: 'center',
    fontSize: 12,
    color: Colors.textLight,
  },

});