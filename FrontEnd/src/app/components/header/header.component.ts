import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  nombreUsuario: string = '';
  mostrarUsuario: boolean = false;

  constructor(private router: Router) {
    this.cargarNombre();
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.cargarNombre();
        this.mostrarUsuario = this.router.url.startsWith('/dashboard');
      }
    });
    this.mostrarUsuario = this.router.url.startsWith('/dashboard');
  }

  cargarNombre() {
    this.nombreUsuario = localStorage.getItem('nombreUsuario') || '';
  }

  logout() {
    localStorage.removeItem('correoUsuario');
    localStorage.removeItem('nombreUsuario');
    this.router.navigate(['/login']);
  }
}