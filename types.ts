export enum Role {
  ADMIN = 'ADMIN',
  DOCTOR = 'DOCTOR',
  PHARMACIST = 'PHARMACIST',
  LAB_TECH = 'LAB_TECH',
  ACCOUNTANT = 'ACCOUNTANT',
  PATIENT = 'PATIENT',
}

export enum Urgency {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  lastVisit: string;
  diagnosis?: string;
  status: 'Waiting' | 'In Treatment' | 'Discharged' | 'Admitted';
}

export interface Staff {
  id: string;
  name: string;
  role: Role;
  status: 'Available' | 'Busy' | 'Off Duty';
  department?: string;
}

export interface Medicine {
  id: string;
  name: string;
  stock: number;
  category: string;
  price: number;
  expiryDate: string;
}

export interface LabResult {
  id: string;
  patientId: string;
  testType: string;
  status: 'Pending' | 'Completed';
  result?: string;
  date: string;
}

export interface Appointment {
  id: string;
  patientName: string;
  doctorName: string;
  time: string;
  type: string;
}