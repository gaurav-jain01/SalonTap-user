import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { GlobalStyles } from '@/constants/theme';

export default function CategoriesScreen() {
  return (
    <ThemedView style={[GlobalStyles.screenContainer, GlobalStyles.screenPadding, GlobalStyles.center]}>
      <ThemedText type="title">Categories</ThemedText>
      <ThemedText>Browse service categories</ThemedText>
    </ThemedView>
  );
}
