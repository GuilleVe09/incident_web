import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  Incident,
  IncidentDetail,
  PaginatedResponse,
  CreateIncidentRequest
} from '../models/incident.model';
import { environment } from '../environments/environtment';

@Injectable({
  providedIn: 'root'
})
export class IncidentService {

  private apiUrl = `${environment.apiUrl}/incidents`;

  constructor(private http: HttpClient) {}

  getIncidents(filters: {
    status?: string;
    severity?: string;
    serviceId?: string;
    q?: string;
    page?: number;
    pageSize?: number;
    sort?: string;
  } = {}): Observable<PaginatedResponse> {
    let params = new HttpParams();

    if (filters.status) params = params.set('status', filters.status);
    if (filters.severity) params = params.set('severity', filters.severity);
    if (filters.serviceId) params = params.set('serviceId', filters.serviceId);
    if (filters.q) params = params.set('q', filters.q);
    if (filters.page) params = params.set('page', filters.page.toString());
    if (filters.pageSize) params = params.set('pageSize', filters.pageSize.toString());
    if (filters.sort) params = params.set('sort', filters.sort);

    return this.http.get<PaginatedResponse>(this.apiUrl, { params });
  }

  getIncident(id: string): Observable<IncidentDetail> {
    return this.http.get<IncidentDetail>(`${this.apiUrl}/${id}`);
  }

  createIncident(data: CreateIncidentRequest): Observable<Incident> {
    return this.http.post<Incident>(this.apiUrl, data);
  }

  updateStatus(id: string, status: string): Observable<Incident> {
    return this.http.patch<Incident>(`${this.apiUrl}/${id}/status`, { status });
  }
}
