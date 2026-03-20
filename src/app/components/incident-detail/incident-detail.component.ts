import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { TimelineModule } from 'primeng/timeline';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';

import { IncidentService } from '../../services/incident.service';
import { IncidentDetail, IncidentEvent } from '../../models/incident.model';

@Component({
  selector: 'app-incident-detail',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CardModule,
    TagModule,
    ButtonModule,
    TimelineModule,
    DropdownModule,
  ],
  templateUrl: './incident-detail.component.html',
  styleUrl: './incident-detail.component.css'
})
export class IncidentDetailComponent implements OnInit {

  incident: IncidentDetail | null = null;
  loading = true;
  updatingStatus = false;

  selectedStatus = '';

  statusOptions = [
    { label: 'Open', value: 'OPEN' },
    { label: 'In Progress', value: 'IN_PROGRESS' },
    { label: 'Resolved', value: 'RESOLVED' },
    { label: 'Closed', value: 'CLOSED' },
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private incidentService: IncidentService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadIncident(id);
    }
  }

  loadIncident(id: string): void {
    this.loading = true;
    this.incidentService.getIncident(id).subscribe({
      next: (data) => {
        this.incident = data;
        this.selectedStatus = data.status;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading incident:', err);
        this.loading = false;
      }
    });
  }

  onStatusChange(): void {
    if (!this.incident || this.selectedStatus === this.incident.status) return;

    this.updatingStatus = true;
    this.incidentService.updateStatus(this.incident.id, this.selectedStatus).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Status Updated',
          detail: `Status changed to ${this.selectedStatus}`,
        });
        // Recargar para obtener timeline actualizado
        this.loadIncident(this.incident!.id);
        this.updatingStatus = false;
      },
      error: (err) => {
        console.error('Error updating status:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to update status.',
        });
        this.selectedStatus = this.incident!.status;
        this.updatingStatus = false;
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/incidents']);
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

  getEventIcon(type: string): string {
    const map: Record<string, string> = {
      'incident_created': 'pi pi-plus-circle',
      'incident_status_changed': 'pi pi-refresh',
      'service_catalog_snapshot': 'pi pi-server',
    };
    return map[type] || 'pi pi-circle';
  }

  getEventColor(type: string): string {
    const map: Record<string, string> = {
      'incident_created': '#22c55e',
      'incident_status_changed': '#3b82f6',
      'service_catalog_snapshot': '#8b5cf6',
    };
    return map[type] || '#94a3b8';
  }

  formatEventType(type: string): string {
    return type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  }

  formatStatus(status: string): string {
    return status.replace('_', ' ');
  }
}
