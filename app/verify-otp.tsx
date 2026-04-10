import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useToast } from '@/components/toast-provider';
import { ApiEndpoints } from '@/constants/ApiEndpoints';
import { BorderRadius, Colors, GlobalStyles, Spacing, Typography } from '@/constants/theme';
import { apiClient } from '@/services/apiClient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { AppLoader } from '@/components/loading/app-loader';

export default function VerifyOTPScreen() {
  const { phone } = useLocalSearchParams();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const { showToast } = useToast();
  const inputs = useRef<Array<TextInput | null>>([]);

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

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timerId = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timerId);
  }, [timeLeft]);

  const handleChange = (text: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    if (text.length !== 0 && index < 5) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && otp[index] === '' && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const enteredOtp = otp.join('');
    if (enteredOtp.length < 6) {
      showToast({ message: 'Please enter the complete 6-digit OTP', type: 'error' });
      return;
    }

    try {
      setIsLoading(true);
      const response = await apiClient.post(ApiEndpoints.auth.verifyOtp, {
        mobile: phone,
        otp: enteredOtp 
      });

      const token = response.data?.token;
      
      if (token) {
        await AsyncStorage.setItem("token", token);
      }
      showToast({ message: 'Login successful! Welcome back.', type: 'success' });
      router.replace('/(tabs)');

    } catch (error: any) {
      const message = error?.response?.data?.message || 'Invalid OTP. Please try again.';
      showToast({ message, type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (timeLeft > 0) return;

    try {
      setIsLoading(true);
      await apiClient.post(ApiEndpoints.auth.sendOtp, { mobile: phone });

      showToast({ message: 'OTP resent successfully!', type: 'success' });
      setTimeLeft(30);
    } catch (error: any) {
      const message = error?.response?.data?.message || 'Failed to resend OTP';
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
        <ThemedText type="title" style={styles.title}>Verify OTP</ThemedText>
        <ThemedText style={styles.subtitle}>
          Enter the 6-digit code sent to +91 {phone}
        </ThemedText>

        <View style={styles.otpContainer}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={(ref) => { inputs.current[index] = ref; }}
              style={styles.otpInput}
              keyboardType="number-pad"
              maxLength={1}
              value={digit}
              onChangeText={(text) => handleChange(text, index)}
              onKeyPress={(e) => handleKeyPress(e, index)}
              placeholderTextColor={Colors.textLight}
            />
          ))}
        </View>

        <TouchableOpacity 
          style={[GlobalStyles.primaryButton, isLoading && { opacity: 0.7 }]} 
          onPress={handleVerify}
          disabled={isLoading}
        >
          {isLoading ? (
            <AppLoader size="small" color={Colors.white} />
          ) : (
            <ThemedText style={GlobalStyles.primaryButtonText}>Verify</ThemedText>
          )}
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.resendButton} 
          onPress={handleResend}
          disabled={isLoading || timeLeft > 0}
        >
          <ThemedText style={[styles.resendText, (isLoading || timeLeft > 0) && { opacity: 0.5 }]}>
            {isLoading 
              ? 'Sending...' 
              : timeLeft > 0 
                ? `Didn't receive code? Resend in ${timeLeft}s` 
                : "Didn't receive code? Resend"}
          </ThemedText>
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
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 40,
  },
  otpInput: {
    width: 45,
    height: 56,
    borderWidth: 1,
    borderColor: Colors.borderMedium,
    borderRadius: BorderRadius.md,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    backgroundColor: Colors.white,
    color: Colors.black,
  },
  resendButton: {
    marginTop: Spacing.xxl,
    alignItems: 'center',
  },
  resendText: {
    ...Typography.link,
  },
});
