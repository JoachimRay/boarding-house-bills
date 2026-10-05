import { Button, StyleSheet, View } from 'react-native';

import { StorePhoto } from '../components/store-photo';
import { ThemedText } from '../components/themed-text';
import { Spacing } from '../constants/theme';
import { useProfile } from '../hooks/use-profile';
import { supabase } from '../lib/supabase';

export default function AccountScreen() {
  const profile = useProfile();

  return (
    <View style={styles.container}>
      <ThemedText type="title">{profile?.email ?? 'Account'}</ThemedText>
      <ThemedText themeColor="textSecondary">
        Role: {profile?.role ?? 'user'}
      </ThemedText>
      <Button title="Sign out" onPress={() => void supabase.auth.signOut()} />
      <StorePhoto />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Spacing.four,
    gap: Spacing.three,
  },
});
