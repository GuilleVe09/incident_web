export interface Incident {
  id: string;
  title: string;
  description: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
  serviceId: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedResponse {
  data: Incident[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface IncidentEvent {
  incidentId: string;
  type: string;
  occurredAt: string;
  payload: any;
  metadata: {
    correlationId: string;
  };
}

export interface IncidentDetail extends Incident {
  timeline: IncidentEvent[];
}

export interface CreateIncidentRequest {
  title: string;
  description: string;
  severity: string;
  serviceId: string;
}
