import { useState, useRef } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View, Alert, ActivityIndicator } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors, Spacing, GlobalStyles, Typography, BorderRadius } from '@/constants/theme';
import { useToast } from '@/components/toast-provider';
import { ApiEndpoints } from '@/constants/ApiEndpoints';

export default function VerifyOTPScreen() {
  const { phone } = useLocalSearchParams();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useToast();
  const inputs = useRef<Array<TextInput | null>>([]);

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
      const response = await fetch(ApiEndpoints.auth.verifyOtp, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          mobile: phone,
          otp: enteredOtp 
        }),
      });

      const data = await response.json();

      if (response.ok) {
        showToast({ message: 'Login successful! Welcome back.', type: 'success' });
        router.replace('/(tabs)');
      } else {
        showToast({ message: data.message || 'Invalid OTP. Please try again.', type: 'error' });
      }
    } catch (error) {
      showToast({ message: 'Something went wrong. Please try again.', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(ApiEndpoints.auth.sendOtp, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ mobile: phone }),
      });

      if (response.ok) {
        showToast({ message: 'OTP resent successfully!', type: 'success' });
      } else {
        showToast({ message: 'Failed to resend OTP', type: 'error' });
      }
    } catch (error) {
      showToast({ message: 'Something went wrong', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

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
            <ActivityIndicator color={Colors.white} />
          ) : (
            <ThemedText style={GlobalStyles.primaryButtonText}>Verify</ThemedText>
          )}
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.resendButton} 
          onPress={handleResend}
          disabled={isLoading}
        >
          <ThemedText style={[styles.resendText, isLoading && { opacity: 0.5 }]}>
            {isLoading ? 'Sending...' : "Didn't receive code? Resend"}
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
