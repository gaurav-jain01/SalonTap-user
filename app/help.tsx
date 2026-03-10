import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { GlobalStyles } from '@/constants/theme';

export default function HelpScreen() {
  return (
    <ThemedView style={[GlobalStyles.screenContainer, GlobalStyles.screenPadding, GlobalStyles.center]}>
      <ThemedText type="title">Help &amp; Support</ThemedText>
      <ThemedText>Get help with your bookings or account.</ThemedText>
    </ThemedView>
  );
}
