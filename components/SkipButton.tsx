import React from 'react';
import { StyleSheet, Text, TouchableOpacity, Platform } from 'react-native';
import Colors from '../constants/Colors';

interface SkipButtonProps {
  onPress: () => void;
  label?: string;
  style?: any;
}

export default function SkipButton({
  onPress,
  label = 'Skip for now',
  style,
}: SkipButtonProps) {
  return (
    <TouchableOpacity
      style={[styles.button, style]}
      onPress={onPress}
      activeOpacity={0.7}
      accessibilityLabel={label}
      accessibilityRole="button"
    >
      <Text style={styles.text}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      web: {
        cursor: 'pointer',
        userSelect: 'none',
      },
    }),
  },
  text: {
    color: Colors.gray[600],
    fontWeight: '500',
    fontSize: 14,
  },
});