import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import Logo from '@/components/Logo';
import Colors from '@/constants/Colors';

export default function Index() {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (isLoading) return;

    if (!user) {
      // User is not logged in, redirect to login
      router.replace('/onboarding/auth');
    } else if (!user.hasCompletedOnboarding) {
      // User is logged in but hasn't completed onboarding
      router.replace('/onboarding/welcome');
    } else {
      // User is logged in and has completed onboarding
      router.replace('/(tabs)');
    }
  }, [user, isLoading, router]);

  return (
    <View style={styles.container}>
      <Logo size="large" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
});