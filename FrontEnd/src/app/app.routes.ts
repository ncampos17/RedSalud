import { Routes } from '@angular/router';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';

export const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'recuperar', component: ForgotPasswordComponent },
  { path: 'registro', component: RegisterComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'reservar-box', loadComponent: () => import('./components/reservar-box/reservar-box.component').then(m => m.ReservarBoxComponent) },
  { path: 'consultar-agenda', loadComponent: () => import('./components/consultar-agenda/consultar-agenda.component').then(m => m.ConsultarAgendaComponent) },
  { path: 'ver-reportes', loadComponent: () => import('./components/reporte/reporte.component').then(m => m.ReporteOcupacionComponent) }
];

