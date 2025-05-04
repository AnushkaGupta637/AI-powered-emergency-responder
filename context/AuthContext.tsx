import React, { createContext, useContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import { User, EmergencyContact, MedicalCondition } from '../types';

interface AuthContextProps {
  user: User | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateUser: (userData: Partial<User>) => Promise<void>;
  addEmergencyContact: (contact: Omit<EmergencyContact, 'id'>) => Promise<void>;
  updateEmergencyContact: (contact: EmergencyContact) => Promise<void>;
  removeEmergencyContact: (id: string) => Promise<void>;
  updateMedicalCondition: (condition: MedicalCondition) => Promise<void>;
  setLocationPermission: (granted: boolean) => Promise<void>;
  completeOnboarding: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

const defaultUser: User = {
  emergencyContacts: [],
  medicalConditions: [
    { id: '1', name: 'Asthma', selected: false },
    { id: '2', name: 'Diabetes', selected: false },
    { id: '3', name: 'Heart Condition', selected: false },
    { id: '4', name: 'Epilepsy', selected: false },
    { id: '5', name: 'Allergies', selected: false },
  ],
  hasGrantedLocationPermission: false,
  hasCompletedOnboarding: false,
};

// Helper functions for storage operations
const storage = {
  getItem: async (key: string): Promise<string | null> => {
    if (Platform.OS === 'web') {
      return localStorage.getItem(key);
    }
    return await SecureStore.getItemAsync(key);
  },
  setItem: async (key: string, value: string): Promise<void> => {
    if (Platform.OS === 'web') {
      localStorage.setItem(key, value);
    } else {
      await SecureStore.setItemAsync(key, value);
    }
  },
  removeItem: async (key: string): Promise<void> => {
    if (Platform.OS === 'web') {
      localStorage.removeItem(key);
    } else {
      await SecureStore.deleteItemAsync(key);
    }
  },
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user data from storage on mount
  useEffect(() => {
    const loadUser = async () => {
      try {
        const userData = await storage.getItem('user');
        if (userData) {
          setUser(JSON.parse(userData));
        }
      } catch (error) {
        console.error('Failed to load user data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  // Save user data to storage whenever it changes
  useEffect(() => {
    const saveUser = async () => {
      if (user) {
        try {
          await storage.setItem('user', JSON.stringify(user));
        } catch (error) {
          console.error('Failed to save user data:', error);
        }
      }
    };

    if (user) {
      saveUser();
    }
  }, [user]);

  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setUser({ ...defaultUser, email });
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setUser({ ...defaultUser, email });
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    setIsLoading(true);
    try {
      await storage.removeItem('user');
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const updateUser = async (userData: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...userData });
    }
  };

  const addEmergencyContact = async (contact: Omit<EmergencyContact, 'id'>) => {
    if (user) {
      const newContact = {
        ...contact,
        id: Date.now().toString(),
      };
      setUser({
        ...user,
        emergencyContacts: [...user.emergencyContacts, newContact],
      });
    }
  };

  const updateEmergencyContact = async (contact: EmergencyContact) => {
    if (user) {
      const updatedContacts = user.emergencyContacts.map(c => 
        c.id === contact.id ? contact : c
      );
      setUser({
        ...user,
        emergencyContacts: updatedContacts,
      });
    }
  };

  const removeEmergencyContact = async (id: string) => {
    if (user) {
      setUser({
        ...user,
        emergencyContacts: user.emergencyContacts.filter(c => c.id !== id),
      });
    }
  };

  const updateMedicalCondition = async (condition: MedicalCondition) => {
    if (user) {
      const updatedConditions = user.medicalConditions.map(c => 
        c.id === condition.id ? condition : c
      );
      setUser({
        ...user,
        medicalConditions: updatedConditions,
      });
    }
  };

  const setLocationPermission = async (granted: boolean) => {
    if (user) {
      setUser({
        ...user,
        hasGrantedLocationPermission: granted,
      });
    }
  };

  const completeOnboarding = async () => {
    if (user) {
      setUser({
        ...user,
        hasCompletedOnboarding: true,
      });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        signIn,
        signUp,
        signOut,
        updateUser,
        addEmergencyContact,
        updateEmergencyContact,
        removeEmergencyContact,
        updateMedicalCondition,
        setLocationPermission,
        completeOnboarding,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};