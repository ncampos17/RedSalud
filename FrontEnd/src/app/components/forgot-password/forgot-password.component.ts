import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css'
})
export class ForgotPasswordComponent {
  correo: string = '';
  mensaje: string = '';

  enviarInstrucciones() {
    if (!this.correo.trim()) {
      this.mensaje = 'Por favor, ingrese su correo electrónico.';
      return;
    }
    if (!this.correo.trim().toLowerCase().endsWith('@redsalud.cl')) {
      this.mensaje = 'El correo debe terminar con @redsalud.cl';
      return;
    }
    this.mensaje = 'Si el correo está registrado, recibirá instrucciones para recuperar su contraseña.';
    this.correo = '';
  }
}
