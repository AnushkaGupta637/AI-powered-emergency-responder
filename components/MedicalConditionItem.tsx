import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Check } from 'lucide-react-native';
import Colors from '../constants/Colors';
import { MedicalCondition } from '../types';

interface MedicalConditionItemProps {
  condition: MedicalCondition;
  onToggle: (condition: MedicalCondition) => void;
}

export default function MedicalConditionItem({
  condition,
  onToggle,
}: MedicalConditionItemProps) {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onToggle({...condition, selected: !condition.selected})}
      activeOpacity={0.7}
      accessibilityLabel={`${condition.selected ? 'Deselect' : 'Select'} ${condition.name}`}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: condition.selected }}
    >
      <Text style={styles.name}>{condition.name}</Text>
      
      <View style={[
        styles.checkbox,
        condition.selected && styles.checkboxSelected
      ]}>
        {condition.selected && (
          <Check size={16} color={Colors.white} />
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  name: {
    fontSize: 16,
    color: Colors.gray[900],
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: Colors.gray[400],
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxSelected: {
    backgroundColor: Colors.primary[500],
    borderColor: Colors.primary[500],
  },
});