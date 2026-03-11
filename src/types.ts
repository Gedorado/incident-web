export interface Incident {
  Id: string;
  Title: string;
  Description: string;
  Severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  Status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED';
  ServiceId: string;
  CreatedAt: string;
  UpdatedAt: string;
}

export interface IncidentEvent {
  _id: string;
  incidentId: string;
  type: string;
  occurredAt: string;
  payload: Record<string, unknown>;
  metadata: Record<string, unknown>;
}

export interface IncidentDetail extends Incident {
  timeline: IncidentEvent[];
}

export interface PaginatedResponse {
  data: Incident[];
  total: number;
  page: number;
  pageSize: number;
}
