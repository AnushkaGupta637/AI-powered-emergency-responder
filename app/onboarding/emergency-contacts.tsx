import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import Colors from '@/constants/Colors';
import Button from '@/components/Button';
import Input from '@/components/Input';
import SkipButton from '@/components/SkipButton';
import ProgressIndicator from '@/components/ProgressIndicator';
import EmergencyContactItem from '@/components/EmergencyContactItem';
import { UserPlus, Users } from 'lucide-react-native';
import { EmergencyContact } from '@/types';

export default function EmergencyContactsScreen() {
  const router = useRouter();
  const { user, addEmergencyContact, removeEmergencyContact, updateEmergencyContact } = useAuth();
  
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [nameError, setNameError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editContactId, setEditContactId] = useState<string | null>(null);

  const validateInputs = () => {
    let isValid = true;

    if (!name.trim()) {
      setNameError('Name is required');
      isValid = false;
    } else {
      setNameError('');
    }

    const phoneRegex = /^\+?[0-9]{10,14}$/;
    if (!phoneNumber.trim()) {
      setPhoneError('Phone number is required');
      isValid = false;
    } else if (!phoneRegex.test(phoneNumber)) {
      setPhoneError('Please enter a valid phone number');
      isValid = false;
    } else {
      setPhoneError('');
    }

    return isValid;
  };

  const handleAddContact = async () => {
    if (!validateInputs()) return;

    if (user?.emergencyContacts.length === 3) {
      Alert.alert(
        'Maximum Contacts Reached',
        'You can only add up to 3 emergency contacts.'
      );
      return;
    }

    await addEmergencyContact({ name, phoneNumber });
    resetForm();
  };

  const handleUpdateContact = async () => {
    if (!validateInputs() || !editContactId) return;

    await updateEmergencyContact({
      id: editContactId,
      name,
      phoneNumber,
    });

    resetForm();
    setIsEditing(false);
    setEditContactId(null);
  };

  const handleDeleteContact = async (id: string) => {
    Alert.alert(
      'Remove Contact',
      'Are you sure you want to remove this emergency contact?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => removeEmergencyContact(id),
        },
      ]
    );
  };

  const handleEditContact = (contact: EmergencyContact) => {
    setName(contact.name);
    setPhoneNumber(contact.phoneNumber);
    setIsEditing(true);
    setEditContactId(contact.id);
  };

  const resetForm = () => {
    setName('');
    setPhoneNumber('');
    setNameError('');
    setPhoneError('');
  };

  const handleContinue = () => {
    router.push('/onboarding/location-permission');
  };

  const handleSkip = () => {
    router.push('/onboarding/location-permission');
  };

  return (
    <KeyboardAvoidingView
      style={styles.keyboardAvoidingView}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 0}
    >
      <View style={styles.progressContainer}>
        <ProgressIndicator currentStep={1} totalSteps={4} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollView}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.container}>
          <View style={styles.header}>
            <Users size={28} color={Colors.primary[500]} />
            <Text style={styles.title}>Emergency Contacts</Text>
            <Text style={styles.description}>
              Add up to 3 emergency contacts that can be notified instantly in case of emergency.
            </Text>
          </View>

          <View style={styles.formContainer}>
            <Input
              label="Name"
              value={name}
              onChangeText={setName}
              placeholder="Contact Name"
              errorMessage={nameError}
              required
            />

            <Input
              label="Phone Number"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              placeholder="+1234567890"
              keyboardType="phone-pad"
              errorMessage={phoneError}
              required
            />

            <Button
              title={isEditing ? 'Update Contact' : 'Add Contact'}
              onPress={isEditing ? handleUpdateContact : handleAddContact}
              icon={<UserPlus size={20} color={Colors.white} />}
              style={styles.addButton}
            />
          </View>

          {user?.emergencyContacts.length > 0 && (
            <View style={styles.contactsContainer}>
              <Text style={styles.contactsTitle}>Your Emergency Contacts</Text>
              
              {user.emergencyContacts.map((contact) => (
                <EmergencyContactItem
                  key={contact.id}
                  contact={contact}
                  onDelete={handleDeleteContact}
                  onEdit={handleEditContact}
                />
              ))}
            </View>
          )}
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
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardAvoidingView: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  progressContainer: {
    paddingTop: 60,
    paddingHorizontal: 24,
    backgroundColor: Colors.white,
  },
  scrollView: {
    flexGrow: 1,
  },
  container: {
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
  formContainer: {
    marginBottom: 24,
  },
  addButton: {
    marginTop: 16,
  },
  contactsContainer: {
    marginBottom: 24,
  },
  contactsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.gray[900],
    marginBottom: 16,
    fontFamily: 'Inter-SemiBold',
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