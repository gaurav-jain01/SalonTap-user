import { ScreenHeader } from '@/components/screen-header';
import { ApiEndpoints } from '@/constants/ApiEndpoints';
import { BorderRadius, Colors, Shadows, Spacing } from '@/constants/theme';
import { apiClient } from '@/services/apiClient';
import { useUserStore } from '@/stores/useUserStore';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { useEffect, useState } from 'react';
import { Image, KeyboardAvoidingView, Modal, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, UIManager, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function ProfileScreen() {

  const { user, setUser } = useUserStore();
  const [loading, setLoading] = useState(false);
  const [tempImage, setTempImage] = useState<string | null>(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  type FormKeys = 'name' | 'email' | 'gender';
  const [form, setForm] = useState<Record<FormKeys, string>>({
    name: '',
    email: '',
    gender: '',
  });
  const [emailError, setEmailError] = useState<string | null>(null);

  const PROFILE_FIELDS: {
    label: string;
    value: string;
    icon: any;
    key?: FormKeys;
    editable?: boolean;
  }[] = [
      { label: 'Full Name', value: user?.name || '-', icon: 'person-outline', key: 'name', editable: true },
      { label: 'Phone', value: user?.mobile || '-', icon: 'call-outline', editable: false },
      { label: 'Email', value: user?.email || '-', icon: 'mail-outline', key: 'email', editable: true },
      { label: 'Gender', value: user?.gender || '-', icon: 'male-outline', key: 'gender', editable: true },
    ];

  const getProfile = async () => {
    try {
      const token = await AsyncStorage.getItem("token");

      if (!token) {
        return;
      }
      setInitialLoading(true);

      const response = await apiClient.get(ApiEndpoints.user.profile);

      const userData = response.data?.user;
      setUser(userData);

      setForm({
        name: userData?.name || '',
        email: userData?.email || '',
        gender: userData?.gender || '',
      });

      console.log("FULL RESPONSE:", response.data);
      console.log("IMAGE FROM RESP:", userData?.profileImage);
      console.log("IMAGE TYPE FROM RESP:", typeof userData?.profileImage);

    } catch (error) {
      console.log("Profile API error:", error);
    } finally {
      setInitialLoading(false);
    }
  };

  useEffect(() => {
    getProfile();
  }, []);

  const handleUpdateProfile = async (imageUrl?: string) => {
    try {
      // Basic Email Validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (form.email && !emailRegex.test(form.email)) {
        setEmailError('Please enter a valid email address');
        return;
      }
      setEmailError(null);

      setLoading(true);

      const finalImage = imageUrl || user?.profileImage;

      const response = await apiClient.put(ApiEndpoints.user.profile, {
        name: form.name,
        email: form.email,
        gender: form.gender,
        profileImage: finalImage,
      });

      const updatedUser = response.data?.user;

      if (updatedUser) {
        setUser(updatedUser);
        setIsEditing(false); // exit edit mode
      }

    } catch (err) {
      console.log("Update error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    await handleUpdateProfile();
  };

  const handleChangePhoto = async () => {
    try {
      // Request permissions
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (result.canceled || !result.assets?.[0]) return;

      const image = result.assets[0];

      // show preview immediately
      setTempImage(image.uri);

      // prepare form data
      const formData = new FormData();
      // @ts-ignore
      formData.append("image", {
        uri: image.uri,
        type: "image/jpeg",
        name: image.fileName || "photo.jpg",
      });

      setLoading(true);

      // call upload API
      const uploadRes = await apiClient.post(ApiEndpoints.user.upload, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const imageUrl = uploadRes.data?.data?.url || uploadRes.data?.url;

      if (!imageUrl) {
        console.log("Upload response details:", uploadRes.data);
        throw new Error("Upload failed - No URL returned");
      }

      // store uploaded URL
      setUploadedImageUrl(imageUrl);

      // Immediately update profile with new photo
      await handleUpdateProfile(imageUrl);

      // Clear temp image after successful update
      setTempImage(null);

    } catch (err) {
      console.log("Change photo error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (key: FormKeys, value: string) => {
    setForm(prev => ({ ...prev, [key]: value }));
    if (key === 'email') setEmailError(null);
  };

  const formatGender = (g?: string) => {
    if (!g) return '-';
    return g.charAt(0).toUpperCase() + g.slice(1);
  };

  const isChanged =
    form.name !== user?.name ||
    form.email !== user?.email ||
    form.gender !== user?.gender;

  if (initialLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <ScreenHeader title="My Profile" />

        <View style={{ padding: 20 }}>
          {/* Avatar skeleton */}
          <View style={{ alignItems: 'center', marginTop: 20 }}>
            <View style={{
              width: 96,
              height: 96,
              borderRadius: 48,
              backgroundColor: '#e0e0e0',
            }} />
            <View style={{
              width: 120,
              height: 14,
              backgroundColor: '#e0e0e0',
              marginTop: 10,
              borderRadius: 6,
            }} />
          </View>

          {/* Card skeleton */}
          <View style={{
            marginTop: 30,
            backgroundColor: '#fff',
            padding: 20,
            borderRadius: 12,
          }}>
            {[1, 2, 3, 4].map((_, i) => (
              <View key={i} style={{ marginBottom: 15 }}>
                <View style={{
                  width: 80,
                  height: 10,
                  backgroundColor: '#e0e0e0',
                  marginBottom: 6,
                  borderRadius: 4,
                }} />
                <View style={{
                  width: '100%',
                  height: 14,
                  backgroundColor: '#e0e0e0',
                  borderRadius: 6,
                }} />
              </View>
            ))}
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (

    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <ScreenHeader title="My Profile" />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Avatar Section */}
        <View style={styles.avatarSection}>
          <View style={styles.avatarCircle}>
            {(tempImage || user?.profileImage) ? (
              <Image
                source={{ uri: tempImage || user?.profileImage }}
                style={styles.avatarImage}
                onLoad={() => console.log("RENDER: Image loaded successfully")}
                onError={(e) => console.log("RENDER: Image failed to load", e.nativeEvent.error)}
              />
            ) : (
              <Ionicons name="person" size={48} color={Colors.primary} />
            )}
          </View>
          <Text style={styles.userName}>
            {user?.name || 'User'}
          </Text>
          <Text style={styles.userPhone}>
            {user?.mobile ? `+91 ${user.mobile}` : ''}
          </Text>
          <TouchableOpacity
            style={[styles.editPhotoButton, loading && { opacity: 0.5 }]}
            activeOpacity={0.7}
            onPress={handleChangePhoto}
            disabled={loading}
          >
            <Ionicons name="camera-outline" size={16} color={Colors.primary} />
            <Text style={styles.editPhotoText}>Change Photo</Text>
          </TouchableOpacity>
        </View>

        {/* Info Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Personal Information</Text>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => setIsEditing(true)}
            >
              <Text style={styles.editText}>Edit</Text>
            </TouchableOpacity>
          </View>

          {PROFILE_FIELDS.map((field, index) => {
            return (
              <View
                key={field.label}
                style={[
                  styles.fieldRow,
                  index < PROFILE_FIELDS.length - 1 && styles.fieldBorder,
                ]}
              >
                <View style={styles.fieldIcon}>
                  <Ionicons name={field.icon} size={18} color={Colors.primary} />
                </View>

                <View style={styles.fieldContent}>
                  <Text style={styles.fieldLabel}>{field.label}</Text>
                  <Text style={styles.fieldValue}>
                    {field.label === 'Gender' ? formatGender(field.value) : field.value}
                  </Text>
                </View>
              </View>
            );
          })}
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

      {/* Edit Profile Modal */}
      <Modal
        visible={isEditing}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsEditing(false)}
      >
        <View style={styles.modalOverlay}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.modalContainer}
          >
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Edit Profile</Text>
                <TouchableOpacity onPress={() => setIsEditing(false)}>
                  <Ionicons name="close" size={24} color={Colors.dark} />
                </TouchableOpacity>
              </View>

              <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.modalForm}>
                  {/* Full Name */}
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Full Name</Text>
                    <TextInput
                      style={styles.modalInput}
                      value={form.name}
                      onChangeText={(text) => handleChange('name', text)}
                      placeholder="Enter your full name"
                    />
                  </View>

                  {/* Email */}
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Email Address</Text>
                    <TextInput
                      style={[styles.modalInput, emailError && styles.inputError]}
                      value={form.email}
                      onChangeText={(text) => handleChange('email', text)}
                      placeholder="Enter your email"
                      keyboardType="email-address"
                      autoCapitalize="none"
                    />
                    {emailError && <Text style={styles.errorText}>{emailError}</Text>}
                  </View>

                  {/* Gender */}
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Gender</Text>
                    <View style={styles.genderRow}>
                      {['male', 'female', 'other'].map((g) => (
                        <TouchableOpacity
                          key={g}
                          style={[
                            styles.genderChip,
                            form.gender === g && styles.genderChipActive,
                          ]}
                          onPress={() => handleChange('gender', g)}
                        >
                          <Text
                            style={[
                              styles.genderChipText,
                              form.gender === g && styles.genderChipTextActive,
                            ]}
                          >
                            {g.charAt(0).toUpperCase() + g.slice(1)}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>

                  <TouchableOpacity
                    style={[styles.updateButton, loading && { opacity: 0.7 }]}
                    onPress={handleSaveProfile}
                    disabled={loading}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.updateButtonText}>
                      {loading ? 'Saving Changes...' : 'Save Changes'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>
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
    overflow: 'hidden',
    backgroundColor: Colors.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
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
    fontSize: 17,
    fontWeight: '700',
    color: Colors.dark,
    letterSpacing: -0.5,
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
    fontWeight: '600',
    color: Colors.dark,
    minHeight: 22, // Keep height stable
  },
  fieldInput: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.dark,
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: Colors.primary + '30',
    marginTop: 2,
  },
  genderRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  genderChip: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.white,
  },
  genderChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  genderChipText: {
    fontSize: 13,
    fontWeight: '500',
    color: Colors.textMuted,
  },
  genderChipTextActive: {
    color: Colors.white,
    fontWeight: '600',
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

  // Update Button
  updateButton: {
    marginTop: Spacing.lg,
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    ...Shadows.md,
  },
  updateButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '700',
  },

  // Delete
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    paddingVertical: 16,
    marginTop: Spacing.md,
    backgroundColor: Colors.error + '10',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.error + '20',
  },
  deleteText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.error,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
  },
  modalContent: {
    padding: Spacing.xl,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.dark,
  },
  modalForm: {
    gap: Spacing.lg,
    paddingBottom: Spacing.xl,
  },
  inputGroup: {
    gap: 6,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textMuted,
  },
  modalInput: {
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: Colors.dark,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  inputError: {
    borderColor: Colors.error,
    backgroundColor: Colors.error + '05',
  },
  errorText: {
    fontSize: 12,
    color: Colors.error,
    fontWeight: '500',
    marginTop: 2,
    marginLeft: 4,
  },
});
