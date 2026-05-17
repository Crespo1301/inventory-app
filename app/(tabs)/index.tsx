import { Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

const quickNotes = [
  { item: 'Roma tomatoes', detail: 'Low by prep station', urgency: 'High' },
  { item: 'Heavy cream', detail: 'Need for weekend brunch', urgency: 'Medium' },
  { item: 'Parsley', detail: 'Almost out on garnish rail', urgency: 'Low' },
];

export default function NotesScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText type="title">Kitchen Inventory</ThemedText>
        <ThemedText style={styles.subtle}>
          Capture low-stock notes as soon as the team spots them.
        </ThemedText>
      </ThemedView>

      <ThemedView style={styles.card}>
        <ThemedText type="subtitle">Quick Low-Stock Note</ThemedText>
        <TextInput
          placeholder="Ingredient or product"
          placeholderTextColor="#8b8278"
          style={styles.input}
        />
        <View style={styles.row}>
          <TextInput placeholder="Qty" placeholderTextColor="#8b8278" style={[styles.input, styles.shortInput]} />
          <TextInput placeholder="Unit" placeholderTextColor="#8b8278" style={[styles.input, styles.shortInput]} />
        </View>
        <TextInput
          placeholder="Station, vendor note, or reason"
          placeholderTextColor="#8b8278"
          style={[styles.input, styles.noteInput]}
          multiline
        />
        <Pressable style={styles.primaryButton}>
          <ThemedText style={styles.primaryButtonText}>Add To Order Watchlist</ThemedText>
        </Pressable>
      </ThemedView>

      <ThemedView style={styles.section}>
        <ThemedText type="subtitle">Today&apos;s Notes</ThemedText>
        {quickNotes.map((note) => (
          <ThemedView key={note.item} style={styles.noteCard}>
            <View>
              <ThemedText type="defaultSemiBold">{note.item}</ThemedText>
              <ThemedText style={styles.subtle}>{note.detail}</ThemedText>
            </View>
            <ThemedText style={styles.urgency}>{note.urgency}</ThemedText>
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
  card: {
    gap: 12,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#ece2d8',
    padding: 16,
  },
  section: {
    gap: 12,
  },
  row: {
    flexDirection: 'row',
    gap: 10,
  },
  input: {
    minHeight: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ded2c6',
    backgroundColor: '#fffaf5',
    color: '#221d18',
    paddingHorizontal: 14,
    fontSize: 16,
  },
  shortInput: {
    flex: 1,
  },
  noteInput: {
    minHeight: 82,
    paddingTop: 12,
    textAlignVertical: 'top',
  },
  primaryButton: {
    alignItems: 'center',
    borderRadius: 14,
    backgroundColor: '#2f5d50',
    paddingVertical: 14,
  },
  primaryButtonText: {
    color: '#fffaf5',
    fontWeight: '700',
  },
  noteCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#ece2d8',
    padding: 14,
  },
  urgency: {
    overflow: 'hidden',
    borderRadius: 999,
    backgroundColor: '#f1e6d8',
    paddingHorizontal: 10,
    paddingVertical: 5,
    color: '#5d4032',
    fontSize: 12,
    fontWeight: '700',
  },
});
