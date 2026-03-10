import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { GlobalStyles } from '@/constants/theme';

export default function WalletScreen() {
  return (
    <ThemedView style={[GlobalStyles.screenContainer, GlobalStyles.screenPadding, GlobalStyles.center]}>
      <ThemedText type="title">Wallet</ThemedText>
      <ThemedText>View your balance and top up your account.</ThemedText>
    </ThemedView>
  );
}
