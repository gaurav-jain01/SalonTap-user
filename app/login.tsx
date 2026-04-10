import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useToast } from '@/components/toast-provider';
import { ApiEndpoints } from '@/constants/ApiEndpoints';
import { Colors, GlobalStyles, Spacing, Typography } from '@/constants/theme';
import { apiClient } from '@/services/apiClient';
import { router } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect } from 'react';
import { AppLoader } from '@/components/loading/app-loader';

export default function LoginScreen() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (token) {
          router.replace('/(tabs)');
        } else {
          setIsCheckingAuth(false);
        }
      } catch (error) {
        setIsCheckingAuth(false);
      }
    };
    checkAuth();
  }, []);

  const handleSendOTP = async () => {
 if (!/^[6-9]\d{9}$/.test(phoneNumber)) {
    showToast({ message: 'Please enter a valid phone number', type: 'error' });
    return;
  }

  try {
    setIsLoading(true);

    const response = await apiClient.post(ApiEndpoints.auth.sendOtp, {
      mobile: phoneNumber,
    });

    showToast({ message: 'OTP sent successfully!', type: 'success' });

    router.push({
      pathname: '/verify-otp',
      params: { phone: phoneNumber }
    });

  } catch (error: any) {
    const message =
      error?.response?.data?.message || "Failed to send OTP";

    showToast({ message, type: 'error' });

  } finally {
    setIsLoading(false);
  }
};

  if (isCheckingAuth) {
    return (
      <ThemedView style={[GlobalStyles.screenContainer, { justifyContent: 'center', alignItems: 'center' }]}>
        <AppLoader size="large" />
      </ThemedView>
    );
  }

  return (
    <ThemedView style={GlobalStyles.screenContainer}>
      <View style={styles.content}>
        <ThemedText type="title" style={styles.title}>Welcome to SalonTap</ThemedText>
        <ThemedText style={styles.subtitle}>Enter your phone number to continue</ThemedText>

        <View style={[GlobalStyles.inputContainer, styles.inputSpacing]}>
          <ThemedText style={styles.prefix}>+91</ThemedText>
          <TextInput
            style={styles.input}
            placeholder="Phone Number"
            keyboardType="phone-pad"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            maxLength={10}
            placeholderTextColor={Colors.textLight}
          />
        </View>

        <TouchableOpacity 
          style={[GlobalStyles.primaryButton, isLoading && { opacity: 0.7 }]} 
          onPress={handleSendOTP}
          disabled={isLoading}
        >
          {isLoading ? (
            <AppLoader size="small" color={Colors.white} />
          ) : (
            <ThemedText style={GlobalStyles.primaryButtonText}>Send OTP</ThemedText>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.skipButton}
          onPress={() => {
            showToast({ message: 'Welcome! You are exploring as a guest.', type: 'info' });
            router.replace('/(tabs)');
          }}
          activeOpacity={0.7}
        >
          <ThemedText style={styles.skipText}>Skip for now</ThemedText>
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    padding: Spacing.xxl,
    justifyContent: 'center',
  },
  title: {
    marginBottom: Spacing.sm,
  },
  subtitle: {
    fontSize: Typography.body.fontSize,
    color: Colors.textSecondary,
    marginBottom: Spacing.xxxl,
  },
  inputSpacing: {
    marginBottom: Spacing.xxl,
  },
  prefix: {
    fontSize: 16,
    fontWeight: '600',
    marginRight: 10,
    color: Colors.textDark,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: Colors.black,
  },
  skipButton: {
    marginTop: Spacing.lg,
    alignItems: 'center',
    paddingVertical: Spacing.md,
  },
  skipText: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.textMuted,
  },
});
