import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextarea } from 'primeng/inputtextarea';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';

import { IncidentService } from '../../services/incident.service';

@Component({
  selector: 'app-incident-create',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CardModule,
    InputTextModule,
    InputTextarea,
    DropdownModule,
    ButtonModule,
  ],
  templateUrl: './incident-create.component.html',
  styleUrl: './incident-create.component.css'
})
export class IncidentCreateComponent {

  form: FormGroup;
  submitting = false;

  severityOptions = [
    { label: 'Low', value: 'LOW' },
    { label: 'Medium', value: 'MEDIUM' },
    { label: 'High', value: 'HIGH' },
    { label: 'Critical', value: 'CRITICAL' },
  ];

  serviceOptions = [
    { label: 'Payments API', value: 'payments-api' },
    { label: 'Accounts API', value: 'accounts-api' },
    { label: 'Notifications API', value: 'notifications-api' },
    { label: 'Auth API', value: 'auth-api' },
    { label: 'Reports API', value: 'reports-api' },
  ];

  constructor(
    private fb: FormBuilder,
    private incidentService: IncidentService,
    private messageService: MessageService,
    private router: Router
  ) {
    this.form = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(255)]],
      description: [''],
      severity: ['', Validators.required],
      serviceId: ['', Validators.required],
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting = true;
    this.incidentService.createIncident(this.form.value).subscribe({
      next: (incident) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Incident Created',
          detail: `"${incident.title}" was created successfully.`,
        });
        this.router.navigate(['/incidents', incident.id]);
      },
      error: (err) => {
        console.error('Error creating incident:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to create incident. Please try again.',
        });
        this.submitting = false;
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/incidents']);
  }
}
