import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  ScrollView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import Colors from '@/constants/Colors';
import Button from '@/components/Button';
import ProgressIndicator from '@/components/ProgressIndicator';
import { Phone, MoveHorizontal as MoreHorizontal, Share2 } from 'lucide-react-native';

export default function QuickAccessScreen() {
  const router = useRouter();
  const { completeOnboarding } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  
  const isIOS = Platform.OS === 'ios';
  
  const steps = isIOS
    ? [
        {
          title: 'Open Share Menu',
          description: 'Tap the share icon in Safari',
          image: 'https://images.pexels.com/photos/9808012/pexels-photo-9808012.jpeg',
          icon: <Share2 size={24} color={Colors.primary[500]} />,
        },
        {
          title: 'Add to Home Screen',
          description: 'Scroll down and tap "Add to Home Screen"',
          image: 'https://images.pexels.com/photos/6745820/pexels-photo-6745820.jpeg',
          icon: <MoreHorizontal size={24} color={Colors.primary[500]} />,
        },
        {
          title: 'Confirm Addition',
          description: 'Tap "Add" in the top-right corner',
          image: 'https://images.pexels.com/photos/6745775/pexels-photo-6745775.jpeg',
          icon: <Phone size={24} color={Colors.primary[500]} />,
        },
      ]
    : [
        {
          title: 'Open Menu in Chrome',
          description: 'Tap the three dots in the top-right corner',
          image: 'https://images.pexels.com/photos/5082567/pexels-photo-5082567.jpeg',
          icon: <MoreHorizontal size={24} color={Colors.primary[500]} />,
        },
        {
          title: 'Find "Add to Home screen"',
          description: 'Select "Add to Home screen" from the menu',
          image: 'https://images.pexels.com/photos/4384832/pexels-photo-4384832.jpeg',
          icon: <Phone size={24} color={Colors.primary[500]} />,
        },
        {
          title: 'Confirm Addition',
          description: 'Tap "Add" in the popup',
          image: 'https://images.pexels.com/photos/4384833/pexels-photo-4384833.jpeg',
          icon: <Phone size={24} color={Colors.primary[500]} />,
        },
      ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = async () => {
    await completeOnboarding();
    router.replace('/(tabs)');
  };

  const handleSkip = async () => {
    await completeOnboarding();
    router.replace('/(tabs)');
  };

  return (
    <View style={styles.container}>
      <View style={styles.progressContainer}>
        <ProgressIndicator currentStep={4} totalSteps={4} onComplete={handleComplete} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Phone size={28} color={Colors.primary[500]} />
            <Text style={styles.title}>Quick Access Setup</Text>
            <Text style={styles.description}>
              For emergencies, add AI First Responder to your home screen for instant access when seconds count.
            </Text>
          </View>

          <View style={styles.tutorialContainer}>
            <View style={styles.stepIndicator}>
              {steps.map((_, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.stepDot,
                    currentStep === index && styles.stepDotActive,
                  ]}
                  onPress={() => setCurrentStep(index)}
                  activeOpacity={0.7}
                />
              ))}
            </View>

            <View style={styles.stepContent}>
              <View style={styles.stepHeader}>
                {steps[currentStep].icon}
                <Text style={styles.stepTitle}>{steps[currentStep].title}</Text>
              </View>

              <Text style={styles.stepDescription}>
                {steps[currentStep].description}
              </Text>

              <View style={styles.imageContainer}>
                <Image
                  source={{ uri: steps[currentStep].image }}
                  style={styles.stepImage}
                  resizeMode="cover"
                />
              </View>
            </View>

            <View style={styles.navigationButtons}>
              <Button
                title="Previous"
                onPress={handlePrevious}
                variant="outline"
                size="medium"
                disabled={currentStep === 0}
                style={[styles.navButton, { opacity: currentStep === 0 ? 0.5 : 1 }]}
              />
              <Button
                title="Next"
                onPress={handleNext}
                variant="primary"
                size="medium"
                disabled={currentStep === steps.length - 1}
                style={[styles.navButton, { opacity: currentStep === steps.length - 1 ? 0.5 : 1 }]}
              />
            </View>
          </View>

          <View style={styles.infoBox}>
            <Text style={styles.infoTitle}>Why this matters</Text>
            <Text style={styles.infoText}>
              In an emergency, quick access can save lives. Having the app on your home screen
              means you can reach emergency services and alert your contacts with just one tap.
            </Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
          <Text style={styles.skipButtonText}>Add Later</Text>
        </TouchableOpacity>
        <Button
          title="Complete Setup"
          onPress={handleComplete}
          size="large"
          style={styles.continueButton}
        />
      </View>
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
  scrollView: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.gray[900],
    marginTop: 16,
    marginBottom: 8,
    fontFamily: 'Inter-Bold',
  },
  description: {
    fontSize: 16,
    color: Colors.gray[600],
    textAlign: 'center',
    fontFamily: 'Inter-Regular',
  },
  tutorialContainer: {
    backgroundColor: Colors.gray[50],
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: Colors.gray[200],
  },
  stepIndicator: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  stepDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.gray[300],
    marginHorizontal: 4,
  },
  stepDotActive: {
    backgroundColor: Colors.primary[500],
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  stepContent: {
    alignItems: 'center',
  },
  stepHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  stepTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.gray[900],
    marginLeft: 8,
    fontFamily: 'Inter-SemiBold',
  },
  stepDescription: {
    fontSize: 16,
    color: Colors.gray[700],
    textAlign: 'center',
    marginBottom: 20,
    fontFamily: 'Inter-Regular',
  },
  imageContainer: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 20,
  },
  stepImage: {
    width: '100%',
    height: '100%',
  },
  navigationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  navButton: {
    flex: 1,
    marginHorizontal: 8,
  },
  infoBox: {
    backgroundColor: Colors.gray[100],
    borderRadius: 8,
    padding: 16,
    marginBottom: 24,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.gray[900],
    marginBottom: 8,
    fontFamily: 'Inter-SemiBold',
  },
  infoText: {
    fontSize: 14,
    lineHeight: 20,
    color: Colors.gray[700],
    fontFamily: 'Inter-Regular',
  },
  footer: {
    padding: 24,
    borderTopWidth: 1,
    borderTopColor: Colors.gray[200],
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  continueButton: {
    flex: 1,
    maxWidth: 200,
  },
  skipButton: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  skipButtonText: {
    color: Colors.gray[600],
    fontWeight: '500',
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
});