import { useState, useRef } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View, Alert } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors, Spacing, GlobalStyles, Typography, BorderRadius } from '@/constants/theme';
import { useToast } from '@/components/toast-provider';

export default function VerifyOTPScreen() {
  const { phone } = useLocalSearchParams();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
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

  const handleVerify = () => {
    const enteredOtp = otp.join('');
    if (enteredOtp === '123456') {
      showToast({ message: 'Login successful! Welcome back.', type: 'success' });
      router.replace('/(tabs)');
    } else {
      showToast({ message: 'Invalid OTP. Please try again.', type: 'error' });
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

        <TouchableOpacity style={GlobalStyles.primaryButton} onPress={handleVerify}>
          <ThemedText style={GlobalStyles.primaryButtonText}>Verify</ThemedText>
        </TouchableOpacity>

        <TouchableOpacity style={styles.resendButton}>
          <ThemedText style={styles.resendText}>Didn't receive code? Resend</ThemedText>
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
