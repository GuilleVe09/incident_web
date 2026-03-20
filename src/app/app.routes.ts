import { Routes } from '@angular/router';
import { IncidentListComponent } from './components/incident-list/incident-list.component';
import { IncidentCreateComponent } from './components/incident-create/incident-create.component';
import { IncidentDetailComponent } from './components/incident-detail/incident-detail.component';

export const routes: Routes = [
  { path: '', redirectTo: 'incidents', pathMatch: 'full' },
  { path: 'incidents', component: IncidentListComponent },
  { path: 'incidents/create', component: IncidentCreateComponent },
  { path: 'incidents/:id', component: IncidentDetailComponent },
];
