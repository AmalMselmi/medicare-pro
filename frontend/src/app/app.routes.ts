import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [authGuard]
  },
  {
    path: 'patients',
    loadComponent: () => import('./pages/patients/patient-list/patient-list.component').then(m => m.PatientListComponent),
    canActivate: [authGuard]
  },
  {
    path: 'patients/new',
    loadComponent: () => import('./pages/patients/patient-form/patient-form.component').then(m => m.PatientFormComponent),
    canActivate: [authGuard]
  },
  {
    path: 'patients/:id',
    loadComponent: () => import('./pages/patients/patient-detail/patient-detail.component').then(m => m.PatientDetailComponent),
    canActivate: [authGuard]
  },
  {
    path: 'patients/:id/edit',
    loadComponent: () => import('./pages/patients/patient-form/patient-form.component').then(m => m.PatientFormComponent),
    canActivate: [authGuard]
  },
  {
    path: 'rendezvous',
    loadComponent: () => import('./pages/rendezvous/rdv-list/rdv-list.component').then(m => m.RdvListComponent),
    canActivate: [authGuard]
  },
  {
    path: 'rendezvous/new',
    loadComponent: () => import('./pages/rendezvous/rdv-form/rdv-form.component').then(m => m.RdvFormComponent),
    canActivate: [authGuard]
  },
  {
    path: 'rendezvous/:id/edit',
    loadComponent: () => import('./pages/rendezvous/rdv-form/rdv-form.component').then(m => m.RdvFormComponent),
    canActivate: [authGuard]
  },
  {
    path: 'medecins',
    loadComponent: () => import('./pages/medecins/medecin-list/medecin-list.component').then(m => m.MedecinListComponent),
    canActivate: [authGuard]
  },
  {
    path: 'medecins/new',
    loadComponent: () => import('./pages/medecins/medecin-form/medecin-form.component').then(m => m.MedecinFormComponent),
    canActivate: [authGuard]
  },
  {
    path: 'medecins/:id/edit',
    loadComponent: () => import('./pages/medecins/medecin-form/medecin-form.component').then(m => m.MedecinFormComponent),
    canActivate: [authGuard]
  },
  { path: '**', redirectTo: '/dashboard' }
];