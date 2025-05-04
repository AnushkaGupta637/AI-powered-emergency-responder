import React, { useState, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Platform,
  Keyboard,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Image,
} from 'react-native';
import { useAuth } from '@/context/AuthContext';
import { Mic, Camera, X, TriangleAlert as AlertTriangle, Phone, Users, Send } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import * as Haptics from 'expo-haptics';
import { CameraView } from 'expo-camera';
import { Alert } from 'react-native';

export default function EmergencyScreen() {
  const { user } = useAuth();
  const [inputMode, setInputMode] = useState<'voice' | 'text' | 'camera' | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [emergencyText, setEmergencyText] = useState('');
  const textInputRef = useRef<TextInput>(null);

  const triggerHapticFeedback = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    }
  };

  const handleMicPress = async () => {
    triggerHapticFeedback();
    setInputMode('voice');
    setIsRecording(true);
  
    try {
      const response = await fetch('http://127.0.0.1:5000/record', {
        method: 'POST',
      });
  
      const data = await response.json();
  
      if (data.error) {
        Alert.alert('Error', data.error);
      } else {
        Alert.alert(
          'Speech Recognized',
          `Original (${data.language}): ${data.original}\nTranslated: ${data.translated}`
        );
      }
    } catch (err) {
      Alert.alert('Error', 'Could not connect to server.');
      console.error(err);
    } finally {
      setIsRecording(false);
    }
  };  

  const handleCameraPress = () => {
    triggerHapticFeedback();
    setInputMode('camera');
  };

  const handleTextPress = () => {
    setInputMode('text');
    setTimeout(() => textInputRef.current?.focus(), 100);
  };

  const handleCancel = () => {
    triggerHapticFeedback();
    setInputMode(null);
    setIsRecording(false);
    setEmergencyText('');
    Keyboard.dismiss();
  };

  const handleSubmit = () => {
    triggerHapticFeedback();
    // Implement emergency submission logic here
    console.log('Emergency submitted:', { mode: inputMode, text: emergencyText });
  };

  const handleEmergencyCall = () => {
    triggerHapticFeedback();
    // Implement emergency call logic here
    if (user?.emergencyContacts[0]?.phoneNumber) {
      window.location.href = `tel:${user.emergencyContacts[0].phoneNumber}`;
    }
  };
  
  const renderInputMode = () => {
    switch (inputMode) {
      case 'voice':
        return (
          <View style={styles.inputContainer}>
            <View style={styles.recordingStatus}>
              <View style={[styles.recordingIndicator, isRecording && styles.recording]} />
              <Text style={styles.recordingText}>
                {isRecording ? 'Listening...' : 'Press to start recording'}
              </Text>
            </View>
            <TouchableOpacity
              style={[styles.micButton, isRecording && styles.micButtonRecording]}
              onPress={() => setIsRecording(!isRecording)}
              accessibilityLabel={isRecording ? 'Stop recording' : 'Start recording'}
              accessibilityHint="Double tap to toggle voice recording"
            >
              <Mic size={40} color={Colors.white} />
            </TouchableOpacity>
          </View>
        );

      case 'camera':
        return (
          <View style={styles.cameraContainer}>
            <CameraView style={styles.camera}>
              <View style={styles.cameraControls}>
                <TouchableOpacity
                  style={styles.captureButton}
                  onPress={() => {/* Implement photo capture */}}
                  accessibilityLabel="Take photo"
                />
              </View>
            </CameraView>
          </View>
        );

      case 'text':
        return (
          <View style={styles.textInputContainer}>
            <TextInput
              ref={textInputRef}
              style={styles.textInput}
              placeholder="Describe the emergency situation..."
              placeholderTextColor={Colors.gray[400]}
              value={emergencyText}
              onChangeText={setEmergencyText}
              multiline
              autoFocus
              accessibilityLabel="Emergency description input"
            />
            {emergencyText.length > 0 && (
              <TouchableOpacity
                style={styles.sendButton}
                onPress={handleSubmit}
                accessibilityLabel="Send emergency description"
              >
                <Send size={24} color={Colors.white} />
              </TouchableOpacity>
            )}
          </View>
        );

      default:
        return (
          <View style={styles.defaultContainer}>
            <TouchableOpacity
               style={[styles.micButton, isRecording && styles.micButtonRecording]}
               onPress={handleMicPress}
               disabled={isRecording}
               accessibilityLabel={isRecording ? 'Recording in progress' : 'Start recording'}
               accessibilityHint="Double tap to start voice recording"
            >
              <Mic size={40} color={Colors.white} />
              <Text style={styles.micButtonText}>Tap to Speak</Text>
            </TouchableOpacity>

            <View style={styles.secondaryButtons}>
              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={handleCameraPress}
                accessibilityLabel="Camera input"
              >
                <Camera size={24} color={Colors.gray[700]} />
                <Text style={styles.secondaryButtonText}>Take Photo</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={handleTextPress}
                accessibilityLabel="Text input"
              >
                <Text style={styles.secondaryButtonText}>Type Instead</Text>
              </TouchableOpacity>
            </View>
          </View>
        );
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.inner}>
          <View style={styles.header}>
            <Text style={styles.title}>AI First Aid Assistant</Text>
            {inputMode && (
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={handleCancel}
                accessibilityLabel="Cancel"
              >
                <X size={24} color={Colors.gray[600]} />
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.welcomeContainer}>
            <Text style={styles.welcomeText}>
              Hello, {user?.email?.split('@')[0] || 'User'}
            </Text>
            <Text style={styles.prompt}>
              Please describe the emergency situation
            </Text>
          </View>

          {renderInputMode()}

          <View style={styles.quickActions}>
            <TouchableOpacity
              style={styles.quickActionButton}
              onPress={handleEmergencyCall}
              accessibilityLabel="Call emergency contact"
            >
              <Phone size={24} color={Colors.white} />
              <Text style={styles.quickActionText}>Call Emergency</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.quickActionButton, styles.quickActionSecondary]}
              onPress={() => {/* Navigate to contacts */}}
              accessibilityLabel="View emergency contacts"
            >
              <Users size={24} color={Colors.white} />
              <Text style={styles.quickActionText}>Saved Contacts</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.helpButton}
            onPress={handleSubmit}
            accessibilityLabel="Submit emergency"
            accessibilityHint="Double tap to submit emergency report"
          >
            <AlertTriangle size={24} color={Colors.white} style={styles.helpIcon} />
            <Text style={styles.helpButtonText}>NEED HELP?</Text>
          </TouchableOpacity>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  inner: {
    flex: 1,
    padding: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 60,
    marginBottom: 24,
    position: 'relative',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.gray[900],
    textAlign: 'center',
    fontFamily: 'Inter-Bold',
  },
  welcomeContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  welcomeText: {
    fontSize: 18,
    color: Colors.gray[700],
    marginBottom: 8,
    fontFamily: 'Inter-Medium',
  },
  prompt: {
    fontSize: 16,
    color: Colors.gray[600],
    fontFamily: 'Inter-Regular',
  },
  cancelButton: {
    position: 'absolute',
    right: 0,
    padding: 8,
  },
  defaultContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  recordingStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  recordingIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.gray[400],
    marginRight: 8,
  },
  recording: {
    backgroundColor: Colors.secondary[500],
  },
  micButton: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: Colors.primary[500],
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  micButtonText: {
    color: Colors.white,
    marginTop: 8,
    fontSize: 16,
    fontFamily: 'Inter-Medium',
  },
  micButtonRecording: {
    backgroundColor: Colors.secondary[500],
  },
  recordingText: {
    fontSize: 16,
    color: Colors.gray[600],
    fontFamily: 'Inter-Regular',
  },
  secondaryButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 32,
  },
  secondaryButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: Colors.gray[100],
    marginHorizontal: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  secondaryButtonText: {
    fontSize: 16,
    color: Colors.gray[700],
    marginLeft: 8,
    fontFamily: 'Inter-Medium',
  },
  textInputContainer: {
    flex: 1,
    width: '100%',
    position: 'relative',
  },
  textInput: {
    flex: 1,
    backgroundColor: Colors.gray[50],
    borderRadius: 12,
    padding: 16,
    paddingRight: 56,
    fontSize: 16,
    color: Colors.gray[900],
    fontFamily: 'Inter-Regular',
    textAlignVertical: 'top',
  },
  sendButton: {
    position: 'absolute',
    right: 12,
    bottom: 12,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary[500],
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraContainer: {
    flex: 1,
    width: '100%',
    borderRadius: 12,
    overflow: 'hidden',
  },
  camera: {
    flex: 1,
  },
  cameraControls: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'flex-end',
    padding: 24,
  },
  captureButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.white,
    alignSelf: 'center',
    marginBottom: 24,
    borderWidth: 4,
    borderColor: Colors.gray[300],
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
    marginBottom: 16,
  },
  quickActionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.secondary[500],
    paddingVertical: 12,
    borderRadius: 8,
    marginHorizontal: 6,
  },
  quickActionSecondary: {
    backgroundColor: Colors.primary[500],
  },
  quickActionText: {
    color: Colors.white,
    fontSize: 14,
    marginLeft: 8,
    fontFamily: 'Inter-Medium',
  },
  helpButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.secondary[500],
    paddingVertical: 16,
    borderRadius: 12,
  },
  helpIcon: {
    marginRight: 8,
  },
  helpButtonText: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: '700',
    fontFamily: 'Inter-Bold',
  },
});