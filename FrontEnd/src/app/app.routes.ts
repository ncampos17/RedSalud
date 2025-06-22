import { Routes } from '@angular/router';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';

export const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'recuperar', component: ForgotPasswordComponent },
  { path: 'registro', component: RegisterComponent }

];

