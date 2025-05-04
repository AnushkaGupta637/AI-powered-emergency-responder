import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import Colors from '@/constants/Colors';
import Logo from '@/components/Logo';
import Input from '@/components/Input';
import Button from '@/components/Button';
import { Mail, Phone, Lock, User, Eye, EyeOff } from 'lucide-react-native';

export default function AuthScreen() {
  const router = useRouter();
  const { signIn, signUp, isLoading } = useAuth();
  
  const [isLogin, setIsLogin] = useState(true);
  const [authMethod, setAuthMethod] = useState<'email' | 'phone'>('email');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Form validation states
  const [fullNameError, setFullNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  const validateFullName = () => {
    if (!isLogin && !fullName.trim()) {
      setFullNameError('Full name is required');
      return false;
    }
    setFullNameError('');
    return true;
  };

  const validateEmail = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setEmailError('Email is required');
      return false;
    } else if (!emailRegex.test(email)) {
      setEmailError('Please enter a valid email');
      return false;
    }
    setEmailError('');
    return true;
  };

  const validatePhone = () => {
    const phoneRegex = /^\+?[0-9]{10,14}$/;
    if (!phone) {
      setPhoneError('Phone number is required');
      return false;
    } else if (!phoneRegex.test(phone)) {
      setPhoneError('Please enter a valid phone number');
      return false;
    }
    setPhoneError('');
    return true;
  };

  const validatePassword = () => {
    if (!password) {
      setPasswordError('Password is required');
      return false;
    } else if (password.length < 8) {
      setPasswordError('Password must be at least 8 characters');
      return false;
    } else if (!/(?=.*[A-Z])/.test(password)) {
      setPasswordError('Password must contain at least one uppercase letter');
      return false;
    } else if (!/(?=.*[0-9])/.test(password)) {
      setPasswordError('Password must contain at least one number');
      return false;
    }
    setPasswordError('');
    return true;
  };

  const validateConfirmPassword = () => {
    if (!isLogin && password !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match');
      return false;
    }
    setConfirmPasswordError('');
    return true;
  };

  const handleAuth = async () => {
    let isValid = true;

    if (!isLogin) {
      isValid = validateFullName() && isValid;
    }

    if (authMethod === 'email') {
      isValid = validateEmail() && isValid;
    } else {
      isValid = validatePhone() && isValid;
    }

    isValid = validatePassword() && isValid;

    if (!isLogin) {
      isValid = validateConfirmPassword() && isValid;
    }

    if (!isValid) return;

    try {
      if (isLogin) {
        await signIn(authMethod === 'email' ? email : phone, password);
      } else {
        await signUp(authMethod === 'email' ? email : phone, password);
      }
      router.replace('/onboarding/welcome');
    } catch (error) {
      console.error('Authentication error:', error);
    }
  };

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setFullNameError('');
    setEmailError('');
    setPhoneError('');
    setPasswordError('');
    setConfirmPasswordError('');
  };

  return (
    <KeyboardAvoidingView
      style={styles.keyboardAvoidingView}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 0}
    >
      <ScrollView
        contentContainerStyle={styles.scrollView}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.container}>
          <View style={styles.headerContainer}>
            <Logo size="medium" />
            <Text style={styles.headerText}>
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </Text>
            <Text style={styles.subHeaderText}>
              {isLogin
                ? 'Sign in to access your emergency profile'
                : 'Join AI First Responder for instant emergency assistance'}
            </Text>
          </View>

          <View style={styles.formContainer}>
            <View style={styles.authToggleContainer}>
              <TouchableOpacity
                style={[
                  styles.authToggleButton,
                  authMethod === 'email' && styles.authToggleButtonActive,
                ]}
                onPress={() => setAuthMethod('email')}
              >
                <Mail
                  size={20}
                  color={
                    authMethod === 'email' ? Colors.primary[500] : Colors.gray[500]
                  }
                />
                <Text
                  style={[
                    styles.authToggleText,
                    authMethod === 'email' && styles.authToggleTextActive,
                  ]}
                >
                  Email
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.authToggleButton,
                  authMethod === 'phone' && styles.authToggleButtonActive,
                ]}
                onPress={() => setAuthMethod('phone')}
              >
                <Phone
                  size={20}
                  color={
                    authMethod === 'phone' ? Colors.primary[500] : Colors.gray[500]
                  }
                />
                <Text
                  style={[
                    styles.authToggleText,
                    authMethod === 'phone' && styles.authToggleTextActive,
                  ]}
                >
                  Phone
                </Text>
              </TouchableOpacity>
            </View>

            {!isLogin && (
              <Input
                label="Full Name"
                value={fullName}
                onChangeText={setFullName}
                placeholder="John Doe"
                errorMessage={fullNameError}
                icon={<User size={20} color={Colors.gray[500]} />}
                required
              />
            )}

            {authMethod === 'email' ? (
              <Input
                label="Email"
                value={email}
                onChangeText={setEmail}
                placeholder="your.email@example.com"
                keyboardType="email-address"
                autoCapitalize="none"
                errorMessage={emailError}
                icon={<Mail size={20} color={Colors.gray[500]} />}
                required
              />
            ) : (
              <Input
                label="Phone Number"
                value={phone}
                onChangeText={setPhone}
                placeholder="+1234567890"
                keyboardType="phone-pad"
                errorMessage={phoneError}
                icon={<Phone size={20} color={Colors.gray[500]} />}
                required
              />
            )}

            <Input
              label="Password"
              value={password}
              onChangeText={setPassword}
              placeholder="••••••••"
              secureTextEntry={!showPassword}
              errorMessage={passwordError}
              icon={<Lock size={20} color={Colors.gray[500]} />}
              required
              rightIcon={
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeIcon}
                >
                  {showPassword ? (
                    <EyeOff size={20} color={Colors.gray[500]} />
                  ) : (
                    <Eye size={20} color={Colors.gray[500]} />
                  )}
                </TouchableOpacity>
              }
            />

            {!isLogin && (
              <Input
                label="Confirm Password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="••••••••"
                secureTextEntry={!showConfirmPassword}
                errorMessage={confirmPasswordError}
                icon={<Lock size={20} color={Colors.gray[500]} />}
                required
                rightIcon={
                  <TouchableOpacity
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                    style={styles.eyeIcon}
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={20} color={Colors.gray[500]} />
                    ) : (
                      <Eye size={20} color={Colors.gray[500]} />
                    )}
                  </TouchableOpacity>
                }
              />
            )}

            <Button
              title={isLogin ? 'Sign In' : 'Create Account'}
              onPress={handleAuth}
              loading={isLoading}
              size="large"
              style={styles.authButton}
            />

            <View style={styles.footer}>
              <Text style={styles.footerText}>
                {isLogin ? "Don't have an account? " : 'Already have an account? '}
              </Text>
              <TouchableOpacity onPress={toggleAuthMode}>
                <Text style={styles.footerLink}>
                  {isLogin ? 'Sign Up' : 'Sign In'}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.securityNote}>
              <Text style={styles.securityText}>
                Your safety is our priority. All data is encrypted and securely stored.
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardAvoidingView: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  scrollView: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    padding: 24,
  },
  headerContainer: {
    alignItems: 'center',
    marginTop: 48,
    marginBottom: 32,
  },
  headerText: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.gray[900],
    marginTop: 24,
    marginBottom: 8,
    fontFamily: 'Inter-Bold',
  },
  subHeaderText: {
    fontSize: 16,
    color: Colors.gray[600],
    textAlign: 'center',
    paddingHorizontal: 24,
    fontFamily: 'Inter-Regular',
  },
  formContainer: {
    width: '100%',
  },
  authToggleContainer: {
    flexDirection: 'row',
    marginBottom: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.gray[200],
    overflow: 'hidden',
  },
  authToggleButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    backgroundColor: Colors.white,
  },
  authToggleButtonActive: {
    backgroundColor: Colors.primary[50],
  },
  authToggleText: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.gray[500],
    marginLeft: 8,
    fontFamily: 'Inter-Medium',
  },
  authToggleTextActive: {
    color: Colors.primary[500],
  },
  eyeIcon: {
    padding: 8,
  },
  authButton: {
    marginTop: 24,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  footerText: {
    fontSize: 16,
    color: Colors.gray[600],
    fontFamily: 'Inter-Regular',
  },
  footerLink: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primary[500],
    fontFamily: 'Inter-SemiBold',
  },
  securityNote: {
    marginTop: 32,
    padding: 16,
    backgroundColor: Colors.gray[50],
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.gray[200],
  },
  securityText: {
    fontSize: 14,
    color: Colors.gray[600],
    textAlign: 'center',
    fontFamily: 'Inter-Regular',
  },
});