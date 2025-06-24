import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterModule, FormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  nombre: string = '';
  correo: string = '';
  contrasena: string = '';
  registroExitoso: boolean = false;

  registrarUsuario() {
    if (!this.nombre.trim() || !this.correo.trim() || !this.contrasena) {
      alert('Por favor, complete todos los campos.');
      return;
    }
    if (!this.correo.trim().toLowerCase().endsWith('@redsalud.cl')) {
     alert('El correo debe terminar con @redsalud.cl');
      return;
    }
    if (this.correo.trim().toLowerCase() === 'admin@redsalud.cl') {
     alert('No puede registrar el correo admin@redsalud.cl');
     return;
   }
    if (this.contrasena.length < 8) {
      alert('La contraseña debe tener al menos 8 caracteres.');
      return;
    }
    // Aquí podrías guardar el usuario en un backend o localStorage
    this.registroExitoso = true;
    // Opcional: limpiar los campos
    this.nombre = '';
    this.correo = '';
    this.contrasena = '';
  }
}