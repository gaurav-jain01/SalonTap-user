import { ScreenHeader } from '@/components/screen-header';
import { ApiEndpoints } from '@/constants/ApiEndpoints';
import { BorderRadius, Colors, Shadows, Spacing } from '@/constants/theme';
import { apiClient } from '@/services/apiClient';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ProfileScreen() {
  
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const PROFILE_FIELDS = [
  { label: 'Full Name', value: profile?.name || '-', icon: 'person-outline' as const },
  { label: 'Phone', value: profile?.mobile || '-', icon: 'call-outline' as const },
  { label: 'Email', value: profile?.email || '-', icon: 'mail-outline' as const },
  { label: 'Gender', value: profile?.gender || '-', icon: 'male-outline' as const },
];

  const getProfile = async () => {
  try {
    const token = await AsyncStorage.getItem("token");

    if (!token) {
      return;
    }

    setLoading(true);

    const response = await apiClient.get(ApiEndpoints.user.profile);

    setProfile(response.data?.data);

  } catch (error) {
    console.log("Profile API error:", error);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    getProfile();
  }, []);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <ScreenHeader title="My Profile" />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Avatar Section */}
        <View style={styles.avatarSection}>
          <View style={styles.avatarCircle}>
            <Ionicons name="person" size={48} color={Colors.primary} />
          </View>
          <Text style={styles.userName}>
            {profile?.name || 'User'}
          </Text>
         <Text style={styles.userPhone}>
            {profile?.mobile ? `+91 ${profile.mobile}` : ''}
          </Text>
          <TouchableOpacity style={styles.editPhotoButton} activeOpacity={0.7}>
            <Ionicons name="camera-outline" size={16} color={Colors.primary} />
            <Text style={styles.editPhotoText}>Change Photo</Text>
          </TouchableOpacity>
        </View>

        {/* Info Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Personal Information</Text>
            <TouchableOpacity activeOpacity={0.7}>
              <Text style={styles.editText}>Edit</Text>
            </TouchableOpacity>
          </View>

          {PROFILE_FIELDS.map((field, index) => (
            <View
              key={field.label}
              style={[styles.fieldRow, index < PROFILE_FIELDS.length - 1 && styles.fieldBorder]}
            >
              <View style={styles.fieldIcon}>
                <Ionicons name={field.icon} size={18} color={Colors.primary} />
              </View>
              <View style={styles.fieldContent}>
                <Text style={styles.fieldLabel}>{field.label}</Text>
                <Text style={styles.fieldValue}>{field.value}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Preferences Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Preferences</Text>

          <TouchableOpacity style={[styles.prefRow, styles.fieldBorder]} activeOpacity={0.6}>
            <View style={styles.prefLeft}>
              <View style={styles.fieldIcon}>
                <Ionicons name="notifications-outline" size={18} color={Colors.primary} />
              </View>
              <Text style={styles.prefText}>Notifications</Text>
            </View>
            <View style={styles.toggleOn}>
              <Text style={styles.toggleText}>ON</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.prefRow, styles.fieldBorder]} activeOpacity={0.6}>
            <View style={styles.prefLeft}>
              <View style={styles.fieldIcon}>
                <Ionicons name="language-outline" size={18} color={Colors.primary} />
              </View>
              <Text style={styles.prefText}>Language</Text>
            </View>
            <View style={styles.prefRight}>
              <Text style={styles.prefValue}>English</Text>
              <Ionicons name="chevron-forward" size={16} color={Colors.textLight} />
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.prefRow} activeOpacity={0.6}>
            <View style={styles.prefLeft}>
              <View style={styles.fieldIcon}>
                <Ionicons name="location-outline" size={18} color={Colors.primary} />
              </View>
              <Text style={styles.prefText}>Default Location</Text>
            </View>
            <View style={styles.prefRight}>
              <Text style={styles.prefValue}>Indore</Text>
              <Ionicons name="chevron-forward" size={16} color={Colors.textLight} />
            </View>
          </TouchableOpacity>
        </View>

        {/* Delete Account */}
        <TouchableOpacity style={styles.deleteButton} activeOpacity={0.7}>
          <Ionicons name="trash-outline" size={18} color={Colors.error} />
          <Text style={styles.deleteText}>Delete Account</Text>
        </TouchableOpacity>
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

  // Avatar
  avatarSection: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  avatarCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: Colors.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
    borderWidth: 3,
    borderColor: Colors.primary + '30',
  },
  userName: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.dark,
  },
  userPhone: {
    fontSize: 14,
    color: Colors.textMuted,
    marginTop: 2,
  },
  editPhotoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: Spacing.sm,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: Colors.primary + '12',
  },
  editPhotoText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.primary,
  },

  // Cards
  card: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.md,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    ...Shadows.sm,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.dark,
  },
  editText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary,
  },

  // Fields
  fieldRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  fieldBorder: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  fieldIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: Colors.primary + '10',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  fieldContent: {
    flex: 1,
  },
  fieldLabel: {
    fontSize: 12,
    color: Colors.textMuted,
    marginBottom: 1,
  },
  fieldValue: {
    fontSize: 15,
    fontWeight: '500',
    color: Colors.dark,
  },

  // Preferences
  prefRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  prefLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  prefText: {
    fontSize: 15,
    fontWeight: '500',
    color: Colors.dark,
  },
  prefRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  prefValue: {
    fontSize: 14,
    color: Colors.textMuted,
  },
  toggleOn: {
    backgroundColor: Colors.success + '20',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  toggleText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.success,
  },

  // Delete
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    paddingVertical: 14,
  },
  deleteText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.error,
  },
});
