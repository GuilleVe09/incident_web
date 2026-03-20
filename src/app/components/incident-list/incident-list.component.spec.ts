import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { IncidentListComponent } from './incident-list.component';
import { IncidentService } from '../../services/incident.service';
import { of } from 'rxjs';

describe('IncidentListComponent', () => {
  let component: IncidentListComponent;
  let fixture: ComponentFixture<IncidentListComponent>;
  let incidentService: jasmine.SpyObj<IncidentService>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('IncidentService', ['getIncidents']);
    spy.getIncidents.and.returnValue(of({
      data: [
        {
          id: 'abc-123',
          title: 'Test Incident',
          description: 'Something broke',
          severity: 'HIGH',
          status: 'OPEN',
          serviceId: 'payments-api',
          createdAt: '2026-03-01T08:30:00Z',
          updatedAt: '2026-03-01T08:30:00Z',
        }
      ],
      total: 1,
      page: 1,
      pageSize: 10,
      totalPages: 1,
    }));

    await TestBed.configureTestingModule({
      imports: [
        IncidentListComponent,
        HttpClientTestingModule,
        RouterTestingModule,
      ],
      providers: [
        { provide: IncidentService, useValue: spy },
      ],
    }).compileComponents();

    incidentService = TestBed.inject(IncidentService) as jasmine.SpyObj<IncidentService>;
    fixture = TestBed.createComponent(IncidentListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load incidents on init', () => {
    expect(incidentService.getIncidents).toHaveBeenCalled();
    expect(component.incidents.length).toBe(1);
    expect(component.total).toBe(1);
  });

  it('should reset page to 1 when filtering', () => {
    component.page = 3;
    component.selectedStatus = 'OPEN';
    component.onFilter();
    expect(component.page).toBe(1);
  });

  it('should return correct severity tag color', () => {
    expect(component.getSeverityTag('CRITICAL')).toBe('danger');
    expect(component.getSeverityTag('HIGH')).toBe('warning');
    expect(component.getSeverityTag('MEDIUM')).toBe('info');
    expect(component.getSeverityTag('LOW')).toBe('success');
  });

  it('should format status replacing underscores', () => {
    expect(component.formatStatus('IN_PROGRESS')).toBe('IN PROGRESS');
  });
});
