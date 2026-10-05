import { StyleSheet, Text, type TextProps } from 'react-native';

import { Colors, type ThemeColor } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type ThemedTextProps = TextProps & {
  themeColor?: ThemeColor;
  type?: 'default' | 'title' | 'small';
};

export function ThemedText({
  style,
  themeColor = 'text',
  type = 'default',
  ...rest
}: ThemedTextProps) {
  const theme = useTheme();

  return (
    <Text
      style={[
        { color: theme[themeColor] },
        type === 'title' && styles.title,
        type === 'small' && styles.small,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 32,
    fontWeight: '700',
  },
  small: {
    fontSize: 14,
  },
});
