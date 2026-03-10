import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { GlobalStyles } from '@/constants/theme';

export default function OrdersScreen() {
  return (
    <ThemedView style={[GlobalStyles.screenContainer, GlobalStyles.screenPadding, GlobalStyles.center]}>
      <ThemedText type="title">Orders</ThemedText>
      <ThemedText>Browse service Orders</ThemedText>
    </ThemedView>
  );
}
