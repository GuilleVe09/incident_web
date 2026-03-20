import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { TagModule } from 'primeng/tag';
import { PaginatorModule } from 'primeng/paginator';

import { IncidentService } from '../../services/incident.service';
import { Incident } from '../../models/incident.model';

@Component({
  selector: 'app-incident-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    DropdownModule,
    TagModule,
    PaginatorModule,
  ],
  templateUrl: './incident-list.component.html',
  styleUrl: './incident-list.component.css'
})
export class IncidentListComponent implements OnInit {

  incidents: Incident[] = [];
  loading = false;

  // Paginación
  total = 0;
  page = 1;
  pageSize = 10;

  // Filtros
  searchQuery = '';
  selectedStatus: string | null = null;
  selectedSeverity: string | null = null;

  statusOptions = [
    { label: 'All Status', value: null },
    { label: 'Open', value: 'OPEN' },
    { label: 'In Progress', value: 'IN_PROGRESS' },
    { label: 'Resolved', value: 'RESOLVED' },
    { label: 'Closed', value: 'CLOSED' },
  ];

  severityOptions = [
    { label: 'All Severity', value: null },
    { label: 'Critical', value: 'CRITICAL' },
    { label: 'High', value: 'HIGH' },
    { label: 'Medium', value: 'MEDIUM' },
    { label: 'Low', value: 'LOW' },
  ];

  constructor(
    private incidentService: IncidentService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadIncidents();
  }

  loadIncidents(): void {
    this.loading = true;
    this.incidentService.getIncidents({
      status: this.selectedStatus || undefined,
      severity: this.selectedSeverity || undefined,
      q: this.searchQuery || undefined,
      page: this.page,
      pageSize: this.pageSize,
      sort: 'createdAt_desc',
    }).subscribe({
      next: (response) => {
        this.incidents = response.data;
        this.total = response.total;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading incidents:', err);
        this.loading = false;
      }
    });
  }

  onFilter(): void {
    this.page = 1;
    this.loadIncidents();
  }

  onPageChange(event: any): void {
    this.page = (event.page || 0) + 1;
    this.pageSize = event.rows;
    this.loadIncidents();
  }

  onSearch(): void {
    this.page = 1;
    this.loadIncidents();
  }

  clearFilters(): void {
    this.searchQuery = '';
    this.selectedStatus = null;
    this.selectedSeverity = null;
    this.page = 1;
    this.loadIncidents();
  }

  viewDetail(incident: Incident): void {
    this.router.navigate(['/incidents', incident.id]);
  }

  getSeverityTag(severity: string): string {
    const map: Record<string, string> = {
      'CRITICAL': 'danger',
      'HIGH': 'warning',
      'MEDIUM': 'info',
      'LOW': 'success',
    };
    return map[severity] || 'info';
  }

  getStatusTag(status: string): string {
    const map: Record<string, string> = {
      'OPEN': 'info',
      'IN_PROGRESS': 'warning',
      'RESOLVED': 'success',
      'CLOSED': 'secondary',
    };
    return map[status] || 'info';
  }

  formatStatus(status: string): string {
    return status.replace('_', ' ');
  }
}
