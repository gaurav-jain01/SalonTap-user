import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { GlobalStyles } from '@/constants/theme';

export default function TransactionsScreen() {
  return (
    <ThemedView style={[GlobalStyles.screenContainer, GlobalStyles.screenPadding, GlobalStyles.center]}>
      <ThemedText type="title">Transactions</ThemedText>
      <ThemedText>View your transaction history.</ThemedText>
    </ThemedView>
  );
}
