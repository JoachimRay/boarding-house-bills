import { StyleSheet, View, type ViewProps } from 'react-native';

import { useTheme } from '@/hooks/use-theme';

type ThemedViewProps = ViewProps & {
  type?: 'background' | 'backgroundElement';
};

export function ThemedView({ style, type = 'background', ...rest }: ThemedViewProps) {
  const theme = useTheme();

  return (
    <View
      style={[
        { backgroundColor: type === 'backgroundElement' ? theme.backgroundElement : theme.background },
        type === 'backgroundElement' && styles.element,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  element: {
    overflow: 'hidden',
  },
});
