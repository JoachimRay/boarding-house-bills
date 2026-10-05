import { supabase } from '../lib/supabase';

export type Customer = {
  id: string;
  name: string;
  balance: number;
  lastPaid: string;
};

export type Profile = {
  id: string;
  email: string;
  role: string;
};

const BASE = process.env.EXPO_PUBLIC_API_URL?.trim();

function timeout(ms: number): Promise<never> {
  return new Promise((_, reject) => {
    setTimeout(() => reject(new Error('request-timeout')), ms);
  });
}

async function request(path: string, init?: RequestInit) {
  if (!BASE) throw new Error('Set EXPO_PUBLIC_API_URL in .env');

  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;
  if (!data.session) throw new Error('Authentication required. Please sign in again.');

  const headers = new Headers(init?.headers);
  headers.set('Authorization', `Bearer ${data.session.access_token}`);
  headers.set('Accept', 'application/json');

  return Promise.race([
    fetch(BASE + path, { ...init, headers }),
    timeout(8000),
  ]);
}

async function get(path: string) {
  const res = await request(path);
  if (!res.ok) throw new Error(String(res.status));
  return res.json();
}

export const fetchCustomers = (): Promise<Customer[]> => get('/api/customers');
export const fetchCustomer = (id: string): Promise<Customer> =>
  get(`/api/customers/${encodeURIComponent(id)}`);

export async function fetchProfile(): Promise<Profile> {
  const res = await request('/api/me');
  if (!res.ok) throw new Error(String(res.status));
  return res.json();
}

export async function addCustomer(name: string, balance: number): Promise<Customer> {
  const res = await request('/api/customers', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, balance }),
  });
  if (!res.ok) throw new Error(String(res.status));
  return res.json();
}
