import { Stack, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Button, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { addCustomerEntry, fetchCustomer, fetchCustomerEntries, type Customer, type CustomerEntry } from '../../data/customer';
import { problemFor, type Status } from '../../data/problem';
import { useProfile } from '../../hooks/use-profile';

export default function CustomerScreen() {
const { id } = useLocalSearchParams<{ id: string }>();
const [status, setStatus] = useState<Status>("loading");
const [customer, setCustomer] = useState<Customer | null>(null);
const [entries, setEntries] = useState<CustomerEntry[]>([]);
const [problem, setProblem] = useState("");
const [attempt, setAttempt] = useState(0);
const [amount, setAmount] = useState('');
const [saving, setSaving] = useState(false);
const [saveProblem, setSaveProblem] = useState('');
const profile = useProfile();
const isAdmin = profile?.role === 'admin';
useEffect(() => {
let live = true;
setStatus('loading');
Promise.all([fetchCustomer(id), fetchCustomerEntries(id)])
.then(([row, history]) => { if (live) { setCustomer(row); setEntries(history); setStatus("content"); } })
.catch((error) => { if (live) { setProblem(problemFor(error)); setStatus("error"); } });
return () => { live = false; };
}, [id, attempt]);

async function record(kind: CustomerEntry['kind']) {
const value = Number(amount);
if (!customer || !Number.isFinite(value) || value <= 0 || saving) return;
if (kind === 'payment' && value > customer.balance) {
setSaveProblem('Payment cannot be more than the current balance.');
return;
}
setSaving(true);
setSaveProblem('');
try {
await addCustomerEntry(id, kind, value);
setAmount('');
setAttempt((current) => current + 1);
} catch (error) {
setSaveProblem(problemFor(error));
} finally {
setSaving(false);
}
}

if (status === "loading") return (
<View style={styles.middle}><ActivityIndicator /></View>
);

if (status === "error") return (
<View style={styles.middle}>
<Text>{problem}</Text>
<Button title="Try again" onPress={() => setAttempt((value) => value + 1)} />
</View>
);

if (!customer) return null;

return (
<SafeAreaView style={styles.container}>
<ScrollView contentContainerStyle={styles.content}>
<Stack.Screen options={{ title: customer.name }} />
<Text style={styles.name}>{customer.name}</Text>
<Text style={styles.text}>Balance: ₱ {customer.balance.toFixed(2)}</Text>
<Text style={styles.text}>Last Paid: {customer.lastPaid}</Text>
{isAdmin && (
<View style={styles.form}>
<Text style={styles.sectionTitle}>Record a due or payment</Text>
<TextInput
value={amount}
onChangeText={setAmount}
placeholder="Amount"
placeholderTextColor="#7f8a96"
keyboardType="decimal-pad"
editable={!saving}
style={styles.input}
/>
{saveProblem !== '' && <Text style={styles.error}>{saveProblem}</Text>}
<View style={styles.actions}>
<Button title={saving ? 'Saving…' : 'Add due'} onPress={() => void record('due')} disabled={saving || !amount} />
<Button title={saving ? 'Saving…' : 'Record payment'} onPress={() => void record('payment')} disabled={saving || !amount} />
</View>
</View>
)}
<View style={styles.history}>
<Text style={styles.sectionTitle}>Ledger history</Text>
{entries.length === 0 ? <Text style={styles.text}>No dues or payments recorded yet.</Text> : entries.map((entry) => (
<View key={entry.id} style={styles.entry}>
<View>
<Text style={styles.text}>{entry.kind === 'due' ? 'Due' : 'Payment'}</Text>
<Text style={styles.muted}>{new Date(entry.createdAt).toLocaleString()}</Text>
</View>
<Text style={styles.text}>{entry.kind === 'due' ? '+' : '−'} ₱ {entry.amount.toFixed(2)}</Text>
</View>
))}
</View>
</ScrollView>
</SafeAreaView>
);
}

const styles = StyleSheet.create({
container: {
flex: 1,
backgroundColor: '#000000',
},
content: { padding: 18, gap: 16 },
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
form: { gap: 12, padding: 14, borderRadius: 10, backgroundColor: '#0b0f14', borderWidth: 1, borderColor: '#26313d' },
history: { gap: 12, paddingTop: 8 },
sectionTitle: { fontSize: 18, fontWeight: '600', color: '#ffffff' },
input: { height: 44, paddingHorizontal: 12, borderRadius: 6, borderWidth: 1, borderColor: '#3a4a5a', backgroundColor: '#111820', color: '#ffffff' },
actions: { gap: 8 },
entry: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#26313d' },
muted: { color: '#9aa7b4', fontSize: 13 },
error: { color: '#ff8f8f' },
});
