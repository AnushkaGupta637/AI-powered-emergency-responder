import React, { useState } from 'react';
import {
  StyleSheet,
  TextInput,
  View,
  Text,
  TouchableOpacity,
  Platform,
  ViewStyle,
  TextStyle,
  KeyboardTypeOptions,
} from 'react-native';
import { Eye, EyeOff } from 'lucide-react-native';
import Colors from '../constants/Colors';

interface InputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  label?: string;
  errorMessage?: string;
  secureTextEntry?: boolean;
  keyboardType?: KeyboardTypeOptions;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  autoCorrect?: boolean;
  maxLength?: number;
  multiline?: boolean;
  style?: ViewStyle;
  inputStyle?: TextStyle;
  labelStyle?: TextStyle;
  errorStyle?: TextStyle;
  required?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  testID?: string;
}

export default function Input({
  value,
  onChangeText,
  placeholder,
  label,
  errorMessage,
  secureTextEntry = false,
  keyboardType = 'default',
  autoCapitalize = 'none',
  autoCorrect = false,
  maxLength,
  multiline = false,
  style,
  inputStyle,
  labelStyle,
  errorStyle,
  required = false,
  disabled = false,
  icon,
  testID,
}: InputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(!secureTextEntry);

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);
  const togglePasswordVisibility = () => setIsPasswordVisible(!isPasswordVisible);

  return (
    <View style={[styles.container, style]}>
      {label && (
        <Text style={[styles.label, labelStyle]}>
          {label} {required && <Text style={styles.requiredIndicator}>*</Text>}
        </Text>
      )}

      <View
        style={[
          styles.inputContainer,
          isFocused && styles.focused,
          errorMessage ? styles.error : null,
          disabled && styles.disabled,
        ]}
      >
        {icon && <View style={styles.iconContainer}>{icon}</View>}

        <TextInput
          style={[
            styles.input,
            inputStyle,
            multiline && styles.multilineInput,
            icon && styles.inputWithIcon,
            secureTextEntry && styles.inputWithToggle,
          ]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={Colors.gray[400]}
          secureTextEntry={secureTextEntry && !isPasswordVisible}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          autoCorrect={autoCorrect}
          maxLength={maxLength}
          multiline={multiline}
          onFocus={handleFocus}
          onBlur={handleBlur}
          editable={!disabled}
          testID={testID}
          textContentType={secureTextEntry ? 'oneTimeCode' : undefined} // Prevent autofill on iOS
        />

        {secureTextEntry && (
          <TouchableOpacity
            style={styles.toggleButton}
            onPress={togglePasswordVisibility}
            accessibilityLabel={isPasswordVisible ? 'Hide password' : 'Show password'}
          >
            {isPasswordVisible ? (
              <EyeOff size={20} color={Colors.gray[500]} />
            ) : (
              <Eye size={20} color={Colors.gray[500]} />
            )}
          </TouchableOpacity>
        )}
      </View>

      {errorMessage && (
        <Text style={[styles.errorText, errorStyle]}>{errorMessage}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
    color: Colors.gray[800],
  },
  requiredIndicator: {
    color: Colors.secondary[500],
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.gray[300],
    borderRadius: 8,
    backgroundColor: Colors.white,
    ...Platform.select({
      web: {
        outlineStyle: 'none',
      },
    }),
  },
  input: {
    flex: 1,
    height: 48,
    paddingHorizontal: 16,
    fontSize: 16,
    color: Colors.gray[900],
  },
  inputWithIcon: {
    paddingLeft: 8,
  },
  inputWithToggle: {
    paddingRight: 48,
  },
  multilineInput: {
    height: 100,
    textAlignVertical: 'top',
    paddingTop: 12,
  },
  iconContainer: {
    paddingLeft: 12,
  },
  toggleButton: {
    padding: 12,
    position: 'absolute',
    right: 0,
    height: '100%',
    justifyContent: 'center',
  },
  focused: {
    borderColor: Colors.primary[500],
    borderWidth: 2,
  },
  error: {
    borderColor: Colors.error[500],
  },
  errorText: {
    color: Colors.error[500],
    fontSize: 12,
    marginTop: 4,
  },
  disabled: {
    backgroundColor: Colors.gray[100],
    borderColor: Colors.gray[300],
  },
});