import React from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';
import { useRouter } from 'expo-router';
import Button from '@/components/Button';
import Colors from '@/constants/Colors';
import Logo from '@/components/Logo';

export default function WelcomeScreen() {
  const router = useRouter();

  const handleContinue = () => {
    router.push('/onboarding/emergency-contacts');
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Logo size="medium" />
        
        <Text style={styles.title}>Welcome to AI First Responder</Text>
        
        <Text style={styles.description}>
          In moments when every second counts, we're here with you. Our AI-powered
          assistant helps you stay calm, make informed decisions, and get the help
          you need—instantly.
        </Text>
        
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: 'https://images.pexels.com/photos/4386464/pexels-photo-4386464.jpeg' }}
            style={styles.image}
            resizeMode="cover"
          />
        </View>
        
        <View style={styles.trustSection}>
          <Text style={styles.trustTitle}>Your Safety Companion</Text>
          <Text style={styles.trustText}>
            Let's take a few moments to set up your emergency profile. This ensures
            you'll always have immediate access to help when you need it most.
          </Text>
        </View>
        
        {/* <View style={styles.readinessSection}> */}
          {/* <View style={styles.readinessItem}>
            <View style={styles.readinessDot} />
            <Text style={styles.readinessText}>
              24/7 AI-guided emergency assistance
            </Text>
          </View> */}
          
          {/* <View style={styles.readinessItem}>
            <View style={styles.readinessDot} />
            <Text style={styles.readinessText}>
              Instant alerts to your trusted contacts
            </Text>
          </View> */}
          
        {/* </View> */}
      </View>
      
      <View style={styles.footer}>
        <Button
          title="Begin Setup"
          onPress={handleContinue}
          size="large"
        />
        <Text style={styles.footerText}>
          Just a few quick steps to ensure your safety
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  content: {
    flex: 1,
    padding: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.gray[900],
    textAlign: 'center',
    marginTop: 24,
    marginBottom: 16,
    fontFamily: 'Inter-Bold',
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: Colors.gray[700],
    textAlign: 'center',
    marginBottom: 32,
    fontFamily: 'Inter-Regular',
  },
  imageContainer: {
    width: '100%',
    height: 200,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 32,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  trustSection: {
    width: '100%',
    marginBottom: 32,
  },
  trustTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.gray[900],
    marginBottom: 8,
    fontFamily: 'Inter-SemiBold',
  },
  trustText: {
    fontSize: 16,
    lineHeight: 24,
    color: Colors.gray[700],
    fontFamily: 'Inter-Regular',
  },
  readinessSection: {
    width: '100%',
  },
  readinessItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  readinessDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary[500],
    marginRight: 12,
  },
  readinessText: {
    fontSize: 16,
    color: Colors.gray[800],
    fontFamily: 'Inter-Regular',
  },
  footer: {
    padding: 24,
    borderTopWidth: 1,
    borderTopColor: Colors.gray[200],
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: Colors.gray[600],
    marginTop: 12,
    fontFamily: 'Inter-Regular',
  },
});