import type { Incident, IncidentDetail, PaginatedResponse } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

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
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create incident');
  return res.json();
}

export async function updateIncidentStatus(id: string, status: string): Promise<Incident> {
  const res = await fetch(`${API_URL}/incidents/${id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });
  if (!res.ok) throw new Error('Failed to update status');
  return res.json();
}
