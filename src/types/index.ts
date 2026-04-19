export type RequestStatus = 'pending' | 'in_progress' | 'quoted' | 'completed';
export type DevisStatus = 'draft' | 'sent' | 'accepted' | 'rejected';
export type ServiceType = 'web' | 'it' | 'admin' | 'other';

export interface ContactRequest {
  id: string;
  name: string;
  email: string;
  phone: string;
  service_type: ServiceType;
  message: string;
  status: RequestStatus;
  created_at: string;
}

export interface DevisItem {
  description: string;
  quantity: number;
  unit_price: number;
}

export interface Devis {
  id: string;
  request_id: string | null;
  client_name: string;
  client_email: string;
  items: DevisItem[];
  total_amount: number;
  notes: string;
  status: DevisStatus;
  created_at: string;
  updated_at: string;
}
