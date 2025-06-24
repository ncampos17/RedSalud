import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  correo: string = '';
  contrasena: string = '';

  constructor(private router: Router) {}

  iniciarSesion() {
    if (!this.correo || !this.contrasena) {
      alert('Por favor, ingrese su correo y/o contraseña.');
      return;
    }
    if (!this.correo.trim().toLowerCase().endsWith('@redsalud.cl')) {
     alert('El correo debe terminar con @redsalud.cl');
      return;
    }
   if (this.contrasena.length < 8) {
      alert('La contraseña debe tener al menos 8 caracteres.');
      return;
    }
    const nombre = this.correo.split('@')[0];
    localStorage.setItem('correoUsuario', this.correo.trim().toLowerCase());
    localStorage.setItem('nombreUsuario', nombre.charAt(0).toUpperCase() + nombre.slice(1));
    this.router.navigate(['/dashboard']);
  }
}
