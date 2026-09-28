import { ActivityIndicator, Button, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ShareBar } from '../components/share-bar';
import { Stat } from '../components/stat';
import { summarise } from '../data/summary';
import { useCustomers } from '../hooks/use-customers';
import { useTheme } from '../hooks/use-theme';

export default function Index() {
  const theme = useTheme();
  const { status, customers, problem, retry } = useCustomers();

  if (status === 'loading') {
    return <View style={styles.middle}><ActivityIndicator color="#62e6ff" /></View>;
  }

  if (status === 'error') {
    return (
      <View style={styles.middle}>
        <Text style={styles.text}>{problem}</Text>
        <Button title="Try again" onPress={retry} />
      </View>
    );
  }

  if (status === 'empty') {
    return <View style={styles.middle}><Text style={styles.text}>No customers yet.</Text></View>;
  }

  const summary = summarise(customers);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Overview</Text>
        <View style={styles.statRow}>
          <Stat label="Total owed" value={`₱ ${summary.total.toFixed(2)}`} />
          <Stat label="Average owed" value={`₱ ${summary.average.toFixed(2)}`} />
        </View>
        <View style={styles.statRow}>
          <Stat label="Still owing" value={`${summary.owing} of ${summary.count}`} />
          <Stat label="Settled" value={String(summary.settled)} />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Largest balances</Text>
          {summary.ranked.map((customer) => (
            <ShareBar
              key={customer.id}
              name={customer.name}
              balance={customer.balance}
              share={customer.share}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 18,
    gap: 24,
  },
  middle: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    padding: 18,
    backgroundColor: '#000000',
  },
  text: {
    color: '#ffffff',
  },
  title: {
    color: '#ffffff',
    fontSize: 28,
    fontWeight: '700',
  },
  statRow: {
    flexDirection: 'row',
    gap: 20,
    flexWrap: 'wrap',
  },
  section: {
    gap: 16,
    paddingTop: 8,
  },
  sectionTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
});
