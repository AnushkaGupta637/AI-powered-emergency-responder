export interface EmergencyContact {
  id: string;
  name: string;
  phoneNumber: string;
}

export interface MedicalCondition {
  id: string;
  name: string;
  selected: boolean;
}

export interface User {
  email?: string;
  phone?: string;
  emergencyContacts: EmergencyContact[];
  medicalConditions: MedicalCondition[];
  hasGrantedLocationPermission: boolean;
  hasCompletedOnboarding: boolean;
}