import { StyleSheet, Text, type TextProps } from 'react-native';
import { Colors, Typography } from '@/constants/theme';

export type ThemedTextProps = TextProps & {
  type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link';
};

export function ThemedText({ style, type = 'default', ...rest }: ThemedTextProps) {
  const color = Colors.text;

  return (
    <Text
      style={[
        { color },
        type === 'default' ? styles.default : undefined,
        type === 'title' ? styles.title : undefined,
        type === 'defaultSemiBold' ? styles.defaultSemiBold : undefined,
        type === 'subtitle' ? styles.subtitle : undefined,
        type === 'link' ? styles.link : undefined,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  default: {
    fontSize: Typography.body.fontSize,
    lineHeight: Typography.body.lineHeight,
  },
  defaultSemiBold: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '600',
  },
  title: {
    fontSize: Typography.title.fontSize,
    fontWeight: Typography.title.fontWeight,
    lineHeight: 32,
  },
  subtitle: {
    fontSize: Typography.sectionTitle.fontSize,
    fontWeight: 'bold',
  },
  link: {
    lineHeight: 30,
    fontSize: Typography.link.fontSize,
    color: Colors.primary,
  },
});
