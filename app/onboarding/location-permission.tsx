import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Image, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import * as Location from 'expo-location';
import Colors from '@/constants/Colors';
import Button from '@/components/Button';
import SkipButton from '@/components/SkipButton';
import ProgressIndicator from '@/components/ProgressIndicator';
import { MapPin, AlertTriangle } from 'lucide-react-native';

export default function LocationPermissionScreen() {
  const router = useRouter();
  const { setLocationPermission } = useAuth();
  
  const [status, setStatus] = useState<
    'initial' | 'requesting' | 'granted' | 'denied'
  >('initial');

  useEffect(() => {
    checkLocationPermission();
  }, []);

  const checkLocationPermission = async () => {
    const { status } = await Location.getForegroundPermissionsAsync();
    
    if (status === Location.PermissionStatus.GRANTED) {
      setStatus('granted');
      setLocationPermission(true);
    } else {
      setStatus('initial');
    }
  };

  const requestLocationPermission = async () => {
    setStatus('requesting');
    
    const { status } = await Location.requestForegroundPermissionsAsync();
    
    if (status === Location.PermissionStatus.GRANTED) {
      setStatus('granted');
      setLocationPermission(true);
    } else {
      setStatus('denied');
      setLocationPermission(false);
    }
  };

  const handleContinue = () => {
    router.push('/onboarding/medical-history');
  };

  const handleSkip = () => {
    setLocationPermission(false);
    router.push('/onboarding/medical-history');
  };

  const renderContent = () => {
    switch (status) {
      case 'initial':
        return (
          <>
            <View style={styles.imageContainer}>
              <Image
                source={{ uri: 'https://images.pexels.com/photos/3760067/pexels-photo-3760067.jpeg' }}
                style={styles.image}
                resizeMode="cover"
              />
            </View>
            
            <Text style={styles.description}>
              AI First Responder needs your location to send accurate
              coordinates to emergency contacts and services when you need help.
            </Text>
            
            <View style={styles.reasonsContainer}>
              <View style={styles.reasonItem}>
                <View style={styles.reasonDot} />
                <Text style={styles.reasonText}>
                  Share precise location with emergency contacts
                </Text>
              </View>
              
              <View style={styles.reasonItem}>
                <View style={styles.reasonDot} />
                <Text style={styles.reasonText}>
                  Help emergency services locate you faster
                </Text>
              </View>
              
              <View style={styles.reasonItem}>
                <View style={styles.reasonDot} />
                <Text style={styles.reasonText}>
                  Only shared during emergencies
                </Text>
              </View>
            </View>
            
            <Text style={styles.privacyNote}>
              Your location is only shared when you trigger an emergency alert.
              We value your privacy.
            </Text>
            
            <Button
              title="Allow Location Access"
              onPress={requestLocationPermission}
              size="medium"
              style={styles.actionButton}
            />
          </>
        );
        
      case 'requesting':
        return (
          <View style={styles.centeredContent}>
            <Text style={styles.loadingText}>
              Requesting permission...
            </Text>
          </View>
        );
        
      case 'granted':
        return (
          <View style={styles.centeredContent}>
            <View style={styles.successIcon}>
              <MapPin size={40} color={Colors.white} />
            </View>
            
            <Text style={styles.successTitle}>
              Location Access Granted
            </Text>
            
            <Text style={styles.successDescription}>
              Great! Now we can send your precise location to emergency
              contacts when needed.
            </Text>
            
            <Button
              title="Continue"
              onPress={handleContinue}
              size="large"
              style={styles.actionButton}
            />
          </View>
        );
        
      case 'denied':
        return (
          <View style={styles.centeredContent}>
            <View style={styles.errorIcon}>
              <AlertTriangle size={40} color={Colors.white} />
            </View>
            
            <Text style={styles.errorTitle}>
              Location Access Denied
            </Text>
            
            <Text style={styles.errorDescription}>
              Without location access, we can't send your precise location
              during emergencies, which may delay help.
            </Text>
            
            {Platform.OS !== 'web' && (
              <Text style={styles.errorInstructions}>
                To enable location, go to your device settings, find AI First Responder,
                and allow location access.
              </Text>
            )}
            
            <Button
              title="Try Again"
              onPress={requestLocationPermission}
              style={styles.actionButton}
            />
            
            <Button
              title="Continue Without Location"
              onPress={handleContinue}
              variant="outline"
              style={styles.secondaryButton}
            />
          </View>
        );
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.progressContainer}>
        <ProgressIndicator currentStep={2} totalSteps={4} />
      </View>
      
      <View style={styles.content}>
        <View style={styles.header}>
          <MapPin size={28} color={Colors.primary[500]} />
          <Text style={styles.title}>Location Access</Text>
        </View>
        
        {renderContent()}
      </View>
      
      {status === 'initial' && (
        <View style={styles.footer}>
          <SkipButton onPress={handleSkip} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  progressContainer: {
    paddingTop: 60,
    paddingHorizontal: 24,
  },
  content: {
    flex: 1,
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.gray[900],
    marginTop: 16,
    fontFamily: 'Inter-Bold',
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: Colors.gray[700],
    textAlign: 'center',
    marginBottom: 24,
    fontFamily: 'Inter-Regular',
  },
  imageContainer: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 24,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  reasonsContainer: {
    marginBottom: 24,
    width: '100%',
  },
  reasonItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  reasonDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary[500],
    marginRight: 12,
  },
  reasonText: {
    fontSize: 16,
    color: Colors.gray[800],
    fontFamily: 'Inter-Regular',
  },
  privacyNote: {
    fontSize: 14,
    color: Colors.gray[600],
    textAlign: 'center',
    marginBottom: 32,
    fontFamily: 'Inter-Regular',
  },
  actionButton: {
    width: '100%',
  },
  secondaryButton: {
    width: '100%',
    marginTop: 12,
  },
  centeredContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: Colors.gray[700],
    fontFamily: 'Inter-Regular',
  },
  successIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.success[500],
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  successTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.gray[900],
    marginBottom: 12,
    fontFamily: 'Inter-Bold',
  },
  successDescription: {
    fontSize: 16,
    color: Colors.gray[700],
    textAlign: 'center',
    marginBottom: 32,
    fontFamily: 'Inter-Regular',
  },
  errorIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.secondary[500],
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.gray[900],
    marginBottom: 12,
    fontFamily: 'Inter-Bold',
  },
  errorDescription: {
    fontSize: 16,
    color: Colors.gray[700],
    textAlign: 'center',
    marginBottom: 16,
    fontFamily: 'Inter-Regular',
  },
  errorInstructions: {
    fontSize: 14,
    color: Colors.gray[600],
    textAlign: 'center',
    marginBottom: 32,
    fontFamily: 'Inter-Regular',
  },
  footer: {
    padding: 24,
    borderTopWidth: 1,
    borderTopColor: Colors.gray[200],
    alignItems: 'center',
  },
});