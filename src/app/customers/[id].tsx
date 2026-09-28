import { Stack, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Button, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { fetchCustomer, type Customer } from '../../data/customer';
import { problemFor, type Status } from '../../data/problem';

export default function CustomerScreen() {
const { id } = useLocalSearchParams<{ id: string }>();
const [status, setStatus] = useState<Status>("loading");
const [customer, setCustomer] = useState<Customer | null>(null);
const [problem, setProblem] = useState("");
const [attempt, setAttempt] = useState(0);
useEffect(() => {
let live = true;
fetchCustomer(id)
.then((row) => { if (live) { setCustomer(row); setStatus("content"); } })
.catch((error) => { if (live) { setProblem(problemFor(error)); setStatus("error"); } });
return () => { live = false; };
}, [id, attempt]);

if (status === "loading") return (
<View style={styles.middle}><ActivityIndicator /></View>
);

if (status === "error") return (
<View style={styles.middle}>
<Text>{problem}</Text>
<Button title="Try again" onPress={() => setAttempt(attempt + 1)} />
</View>
);

if (!customer) return null;

return (
<SafeAreaView style={styles.container}>
<Stack.Screen options={{ title: customer.name }} />
<Text style={styles.name}>{customer.name}</Text>
<Text style={styles.text}>Balance: ₱ {customer.balance.toFixed(2)}</Text>
<Text style={styles.text}>Last Paid: {customer.lastPaid}</Text>
</SafeAreaView>
);
}

const styles = StyleSheet.create({
container: {
flex: 1,
padding: 18,
gap: 12,
backgroundColor: '#000000',
},
middle: {
flex: 1,
alignItems: 'center',
justifyContent: 'center',
gap: 12,
padding: 18,
backgroundColor: '#000000',
},
name: {
fontSize: 24,
fontWeight: '600',
color: '#ffffff',
},
text: {
color: '#ffffff',
},
});