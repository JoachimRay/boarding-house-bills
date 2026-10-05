import { router } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Button, FlatList, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AddCustomerModal } from '../../components/add-customer-modal';
import { CustomerRow } from '../../components/customer-row';
import { summarise } from '../../data/summary';
import { useCustomers } from '../../hooks/use-customers';
import { useProfile } from '../../hooks/use-profile';
import { useTheme } from '../../hooks/use-theme';

export default function CustomersScreen() {
  const [query, setQuery] = useState('');
  const [adding, setAdding] = useState(false);
  const { status, customers, problem, retry } = useCustomers();
  const profile = useProfile();
  const theme = useTheme();
  const canAddCustomer = profile?.role === 'admin';
  const shown = customers.filter((customer) =>
    customer.name.toLowerCase().includes(query.toLowerCase()),
  );
  const summary = summarise(shown);

  if (status === 'loading') {
    return (
      <View style={styles.middle}>
        <ActivityIndicator color="#62e6ff" />
      </View>
    );
  }

  if (status === 'error') {
    return (
      <View style={styles.middle}>
        <Text style={{ color: theme.text }}>{problem}</Text>
        <Button title="Try again" onPress={retry} />
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <TextInput
        value={query}
        onChangeText={setQuery}
        placeholder="Search customers"
        placeholderTextColor="#7f8a96"
        style={[styles.textInput, { color: theme.text, borderColor: '#26313d' }]}
      />
      {canAddCustomer && (
        <Button title="Add customer" onPress={() => setAdding(true)} />
      )}
      <Text style={{ color: theme.text }}>
        Total owed: ₱ {summary.total.toFixed(2)}
      </Text>
      <FlatList
        data={shown}
        keyExtractor={(customer) => customer.id}
        renderItem={({ item }) => (
          <CustomerRow
            {...item}
            onPress={() =>
              router.push({ pathname: '/customers/[id]', params: { id: item.id } })
            }
          />
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={{ color: theme.text }}>
              {customers.length === 0 ? 'No customers yet.' : `No customers match "${query}".`}
            </Text>
          </View>
        }
      />
      {canAddCustomer && (
        <AddCustomerModal
          visible={adding}
          onClose={() => setAdding(false)}
          onAdded={retry}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 18,
    gap: 12,
  },
  middle: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    padding: 18,
    backgroundColor: '#000000',
  },
  empty: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  textInput: {
    height: 40,
    borderWidth: 1,
    paddingHorizontal: 8,
    borderRadius: 4,
    backgroundColor: '#111820',
  },
});
