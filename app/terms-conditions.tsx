import { ScrollView, StyleSheet } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { GlobalStyles, Spacing } from '@/constants/theme';

export default function TermsConditionsScreen() {
  return (
    <ThemedView style={GlobalStyles.screenContainer}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <ThemedText type="title">Terms &amp; Conditions</ThemedText>
        <ThemedText style={styles.text}>
          Please read these terms and conditions carefully before using the SalonTap service.
        </ThemedText>
        {/* Add terms content here */}
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
