import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import Colors from '@/constants/Colors';

export default function AlertsScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Alerts</Text>
      </View>
      <View style={styles.content}>
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateTitle}>No Alerts Yet</Text>
          <Text style={styles.emptyStateText}>When you receive emergency alerts, they will appear here.</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray[200],
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.gray[900],
    fontFamily: 'Inter-Bold',
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.gray[900],
    marginBottom: 8,
    fontFamily: 'Inter-SemiBold',
  },
  emptyStateText: {
    fontSize: 16,
    color: Colors.gray[600],
    textAlign: 'center',
    fontFamily: 'Inter-Regular',
  },
});