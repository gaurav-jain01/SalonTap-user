import { ScrollView, StyleSheet } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { GlobalStyles, Spacing } from '@/constants/theme';

export default function PrivacyPolicyScreen() {
  return (
    <ThemedView style={GlobalStyles.screenContainer}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <ThemedText type="title">Privacy Policy</ThemedText>
        <ThemedText style={styles.text}>
          Your privacy is important to us. This policy explains how we collect and use your data.
        </ThemedText>
        {/* Add policy content here */}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    padding: Spacing.xl,
  },
  text: {
    marginTop: 10,
    lineHeight: 22,
  },
});
