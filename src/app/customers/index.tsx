
    import { router } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Button, FlatList, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AddCustomerModal } from '../../components/add-customer-modal';
import { CustomerRow } from '../../components/customer-row';
import { summarise } from '../../data/summary';
import { useCustomers } from '../../hooks/use-customers';
import { useTheme } from '../../hooks/use-theme';



    export default function CustomersScreen() {

        const [query, setQuery] = useState("");
        const [adding, setAdding] = useState(false);
        const { status, customers, problem, retry } = useCustomers();
        const theme = useTheme();


        const shown = customers.filter((customer) => customer.name.toLowerCase().includes(query.toLowerCase()));

        const summary = summarise(shown);


            if (status === "loading") return (
            <View style={styles.middle}><ActivityIndicator /></View>
            );
            if (status === "error") return (
            <View style={styles.middle}>
            <Text style={{ color: theme.text }}>{problem}</Text>
            <Button title="Try again" onPress={retry} />
            </View>
            );
            if (status === "empty") return (
            <View style={styles.middle}>
                <Text style={{ color: theme.text }}>No customers yet.</Text>
                <Button title="Add customer" onPress={() => setAdding(true)} />
                <AddCustomerModal
                    visible={adding}
                    onClose={() => setAdding(false)}
                    onAdded={retry}
                />
            </View>
            );

            return (
            <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
            <TextInput value={query} onChangeText={setQuery} placeholder="Search customers"
            placeholderTextColor="#7f8a96"
            style={[styles.TextInput, { color: theme.text, borderColor: '#26313d' }]} />
            <Button title="Add customer" onPress={() => setAdding(true)} />
            <Text style={{ color: theme.text }}>Total owed: ₱ {summary.total.toFixed(2)}</Text>
            <FlatList data={shown} keyExtractor={(c) => c.id}
            renderItem={({ item }) => (
                <CustomerRow
                    {...item}
                    onPress={() => router.push({ pathname: '/customers/[id]', params: { id: item.id } })}
                />
            )}
            ListEmptyComponent={<Text style={{ color: theme.text }}>No customers match "{query}".</Text>} />
            <AddCustomerModal
                visible={adding}
                onClose={() => setAdding(false)}
                onAdded={retry}
            />
            </SafeAreaView>
            );



    }



    const styles = StyleSheet.create({ 
        container: {
            flex: 1,
            padding: 18,
            gap: 12
        },

        middle: {
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            gap: 12,
            padding: 18,
            backgroundColor: '#000000',
        },

        TextInput: {
            height: 40,
            borderWidth: 1,
            paddingHorizontal: 8,
            borderRadius: 4,
            backgroundColor: '#111820',
        }
    })
