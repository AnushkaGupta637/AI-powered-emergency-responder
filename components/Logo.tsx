import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Heart } from 'lucide-react-native';
import Colors from '../constants/Colors';

interface LogoProps {
  size?: 'small' | 'medium' | 'large';
}

export default function Logo({ size = 'medium' }: LogoProps) {
  const logoSize = size === 'small' ? 24 : size === 'medium' ? 40 : 64;
  const fontSize = size === 'small' ? 16 : size === 'medium' ? 24 : 32;

  return (
    <View style={styles.container}>
      <View style={[
        styles.iconContainer, 
        { width: logoSize, height: logoSize }
      ]}>
        <Heart 
          size={logoSize * 0.6} 
          color={Colors.white} 
          strokeWidth={2.5} 
        />
      </View>
      <Text style={[styles.text, { fontSize }]}>
        AI First Responder
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    backgroundColor: Colors.secondary[500],
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  text: {
    fontWeight: '700',
    color: Colors.gray[900],
  },
});