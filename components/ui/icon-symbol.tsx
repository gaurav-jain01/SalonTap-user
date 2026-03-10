import Ionicons from '@expo/vector-icons/Ionicons';
import { type ComponentProps } from 'react';
import { type StyleProp, type TextStyle } from 'react-native';

export type IconSymbolName = ComponentProps<typeof Ionicons>['name'];

/**
 * An icon component that uses Ionicons from @expo/vector-icons.
 */
export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: IconSymbolName;
  size?: number;
  color: string;
  style?: StyleProp<TextStyle>;
}) {
  return <Ionicons color={color} size={size} name={name} style={style} />;
}
