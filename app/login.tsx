import { useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors, Spacing, GlobalStyles, Typography, Shadows, BorderRadius } from '@/constants/theme';
import { useToast } from '@/components/toast-provider';
import { ApiEndpoints } from '@/constants/ApiEndpoints';

export default function LoginScreen() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useToast();

  const handleSendOTP = async () => {
    if (phoneNumber.length < 10) {
      showToast({ message: 'Please enter a valid phone number', type: 'error' });
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch(ApiEndpoints.auth.sendOtp, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ mobile: phoneNumber }),
      });

      const data = await response.json();

      if (response.ok) {
        showToast({ message: 'OTP sent successfully!', type: 'success' });
        router.push({
          pathname: '/verify-otp',
          params: { phone: phoneNumber }
        });
      } else {
        showToast({ message: data.message || 'Failed to send OTP', type: 'error' });
      }
    } catch (error) {
      showToast({ message: 'Something went wrong. Please try again.', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

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
            <ActivityIndicator color={Colors.white} />
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
