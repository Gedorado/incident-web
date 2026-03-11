import type { Incident, IncidentDetail, PaginatedResponse } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

function getToken(): string | null {
  return localStorage.getItem('token');
}

function authHeaders(): Record<string, string> {
  const token = getToken();
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

export async function loginUser(username: string, password: string): Promise<{ access_token: string }> {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  if (!res.ok) throw new Error('Invalid credentials');
  return res.json();
}

export async function getIncidents(params: Record<string, string> = {}): Promise<PaginatedResponse> {
  const query = new URLSearchParams(params).toString();
  const res = await fetch(`${API_URL}/incidents?${query}`);
  if (!res.ok) throw new Error('Failed to fetch incidents');
  return res.json();
}

export async function getIncident(id: string): Promise<IncidentDetail> {
  const res = await fetch(`${API_URL}/incidents/${id}`);
  if (!res.ok) throw new Error('Failed to fetch incident');
  return res.json();
}

export async function createIncident(data: {
  title: string;
  description: string;
  severity: string;
  serviceId: string;
}): Promise<Incident> {
  const res = await fetch(`${API_URL}/incidents`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  if (res.status === 401) throw new Error('No autorizado. Inicia sesion primero.');
  if (!res.ok) throw new Error('Failed to create incident');
  return res.json();
}

export async function updateIncidentStatus(id: string, status: string): Promise<Incident> {
  const res = await fetch(`${API_URL}/incidents/${id}/status`, {
    method: 'PATCH',
    headers: authHeaders(),
    body: JSON.stringify({ status }),
  });
  if (res.status === 401) throw new Error('No autorizado. Inicia sesion primero.');
  if (!res.ok) throw new Error('Failed to update status');
  return res.json();
}
