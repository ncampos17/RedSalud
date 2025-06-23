import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  email = '';
  password = '';
  errorMsg = '';

  constructor(private authService: AuthService, private router: Router) {}

  onLogin() {
    this.authService.login(this.email, this.password).subscribe(result => {
      if (result.success) {
        if (result.role === 'admin') {
          this.router.navigate(['/dashboard']); // acceso total
        } else if (result.role === 'especialista') {
          this.router.navigate(['/dashboard']); // puedes cambiar la ruta si hay una vista específica
        }
      } else {
        this.errorMsg = 'Credenciales incorrectas';
      }
    });
  }
}
