import { ScrollView, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

const suggestedLines = [
  { item: 'Roma tomatoes', current: '1 case', par: '4 cases', order: '3 cases' },
  { item: 'Heavy cream', current: '2 qt', par: '8 qt', order: '6 qt' },
  { item: 'Parsley', current: '1 bunch', par: '5 bunches', order: '4 bunches' },
];

export default function OrderScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText type="title">Order Planner</ThemedText>
        <ThemedText style={styles.subtle}>
          Suggestions should be simple, editable, and explain why the app chose that quantity.
        </ThemedText>
      </ThemedView>

      <ThemedView style={styles.summaryCard}>
        <ThemedText type="subtitle">This Week&apos;s Draft</ThemedText>
        <View style={styles.summaryGrid}>
          <View>
            <ThemedText style={styles.metric}>12</ThemedText>
            <ThemedText style={styles.subtle}>Items watched</ThemedText>
          </View>
          <View>
            <ThemedText style={styles.metric}>3</ThemedText>
            <ThemedText style={styles.subtle}>High urgency</ThemedText>
          </View>
          <View>
            <ThemedText style={styles.metric}>2</ThemedText>
            <ThemedText style={styles.subtle}>Vendors</ThemedText>
          </View>
        </View>
      </ThemedView>

      <ThemedView style={styles.section}>
        <ThemedText type="subtitle">Suggested Lines</ThemedText>
        {suggestedLines.map((line) => (
          <ThemedView key={line.item} style={styles.lineCard}>
            <View style={styles.lineHeader}>
              <ThemedText type="defaultSemiBold">{line.item}</ThemedText>
              <ThemedText style={styles.orderQty}>{line.order}</ThemedText>
            </View>
            <ThemedText style={styles.subtle}>
              Current {line.current} • Par {line.par}
            </ThemedText>
            <ThemedText style={styles.reason}>
              Reason: order enough to return to par, then round to the kitchen&apos;s chosen unit.
            </ThemedText>
          </ThemedView>
        ))}
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 18,
    padding: 20,
    paddingTop: 64,
  },
  header: {
    gap: 8,
  },
  subtle: {
    color: '#6f665e',
    lineHeight: 22,
  },
  summaryCard: {
    gap: 16,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#ece2d8',
    padding: 16,
  },
  summaryGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  metric: {
    color: '#2f5d50',
    fontSize: 28,
    fontWeight: '800',
  },
  section: {
    gap: 12,
  },
  lineCard: {
    gap: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#ece2d8',
    padding: 14,
  },
  lineHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  orderQty: {
    color: '#2f5d50',
    fontWeight: '800',
  },
  reason: {
    color: '#4d453d',
    fontSize: 13,
    lineHeight: 20,
  },
});
