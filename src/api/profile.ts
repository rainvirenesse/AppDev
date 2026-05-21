import { apiGet, apiPut } from './client';

export type CustomerProfile = {
  id: number;
  email: string;
  username: string;
  role: string;
  roles: string[];
  status: string;
  verified: boolean;
  createdAt: string;
};

export async function fetchProfile(): Promise<CustomerProfile> {
  return apiGet<CustomerProfile>('/api/customer/profile', true);
}

export async function updateProfile(username: string): Promise<CustomerProfile> {
  return apiPut<CustomerProfile>(
    '/api/customer/profile',
    { username },
    true,
  );
}
