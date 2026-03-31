export type UserRole = 'user' | 'pharmacy' | 'admin';

export interface User {
  id: string | number;
  phone: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  city?: string;
  role: UserRole;
  wallet_balance: number;
  createdAt?: string;
}

export interface Medication {
  id: number;
  name: string;
  generic_name?: string;
  genericName?: string; // Support for both FE/BE naming
  category: string;
  dosage?: string;
  description?: string;
  image_url?: string;
}

export interface Pharmacy {
  id: number;
  name: string;
  address: string;
  phone: string;
  city: string;
  latitude: number;
  longitude: number;
  type: 'jour' | 'nuit' | 'mixte' | 'garde';
  is_on_garde: boolean;
  is_open?: boolean;
}

export interface Transaction {
  id: number;
  user_id: number;
  amount: number;
  type: 'topup' | 'payment' | 'refund';
  status: 'pending' | 'completed' | 'failed';
  payment_method: string;
  created_at: string;
}

export interface SearchSession {
  sessionId: string;
  timestamp: string;
  medications: Medication[];
  results: {
    pharmacy: Pharmacy;
    items: {
      medicament_id: number;
      name: string;
      price: number;
      quantity: number;
    }[];
  }[];
}
