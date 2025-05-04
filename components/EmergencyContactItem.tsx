import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Trash } from 'lucide-react-native';
import Colors from '../constants/Colors';
import { EmergencyContact } from '../types';

interface EmergencyContactItemProps {
  contact: EmergencyContact;
  onDelete: (id: string) => void;
  onEdit: (contact: EmergencyContact) => void;
}

export default function EmergencyContactItem({
  contact,
  onDelete,
  onEdit,
}: EmergencyContactItemProps) {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onEdit(contact)}
      activeOpacity={0.7}
      accessibilityLabel={`Edit contact ${contact.name}`}
    >
      <View style={styles.infoContainer}>
        <Text style={styles.name}>{contact.name}</Text>
        <Text style={styles.phone}>{contact.phoneNumber}</Text>
      </View>
      
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => onDelete(contact.id)}
        accessibilityLabel={`Delete contact ${contact.name}`}
      >
        <Trash size={20} color={Colors.secondary[500]} />
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: Colors.white,
    borderRadius: 8,
    marginBottom: 12,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  infoContainer: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.gray[900],
    marginBottom: 4,
  },
  phone: {
    fontSize: 14,
    color: Colors.gray[600],
  },
  deleteButton: {
    padding: 8,
  },
});