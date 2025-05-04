import React from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import Colors from '@/constants/Colors';
import Button from '@/components/Button';
import SkipButton from '@/components/SkipButton';
import ProgressIndicator from '@/components/ProgressIndicator';
import MedicalConditionItem from '@/components/MedicalConditionItem';
import { Heart, Plus } from 'lucide-react-native';
import { MedicalCondition } from '@/types';

export default function MedicalHistoryScreen() {
  const router = useRouter();
  const { user, updateMedicalCondition } = useAuth();

  const handleToggleCondition = (condition: MedicalCondition) => {
    updateMedicalCondition(condition);
  };

  const handleAddCustomCondition = () => {
    // In a real app, this would open a modal or screen to add a custom condition
    // For this example, we'll just show a placeholder
    console.log('Add custom condition');
  };

  const handleContinue = () => {
    router.push('/onboarding/quick-access');
  };

  const handleSkip = () => {
    router.push('/onboarding/quick-access');
  };

  return (
    <View style={styles.container}>
      <View style={styles.progressContainer}>
        <ProgressIndicator currentStep={3} totalSteps={4} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Heart size={28} color={Colors.primary[500]} />
            <Text style={styles.title}>Medical History</Text>
            <Text style={styles.description}>
              Add any medical conditions that emergency responders should know about.
              This information will only be shared during emergencies.
            </Text>
          </View>

          <View style={styles.conditionsContainer}>
            <Text style={styles.sectionTitle}>Common Conditions</Text>
            
            {user?.medicalConditions.map((condition) => (
              <MedicalConditionItem
                key={condition.id}
                condition={condition}
                onToggle={handleToggleCondition}
              />
            ))}

            <Button
              title="Add Custom Condition"
              onPress={handleAddCustomCondition}
              variant="outline"
              icon={<Plus size={18} color={Colors.primary[500]} />}
              style={styles.addButton}
            />
          </View>

          <View style={styles.infoBox}>
            <Text style={styles.infoTitle}>Why this matters</Text>
            <Text style={styles.infoText}>
              Medical information can be critical for first responders to provide
              appropriate care during emergencies. This data is only shared when
              you trigger an emergency alert.
            </Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <SkipButton onPress={handleSkip} />
        <Button
          title="Continue"
          onPress={handleContinue}
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
  conditionsContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.gray[900],
    marginBottom: 16,
    fontFamily: 'Inter-SemiBold',
  },
  addButton: {
    marginTop: 8,
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
    maxWidth: 150,
  },
});