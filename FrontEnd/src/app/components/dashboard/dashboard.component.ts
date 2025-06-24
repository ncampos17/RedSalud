import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  correoUsuario: string = '';

  ngOnInit() {
    const correo = localStorage.getItem('correoUsuario') || '';
    this.correoUsuario = correo.trim().toLowerCase();
    console.log('Correo leído en dashboard:', this.correoUsuario);
  }

  get esAdmin(): boolean {
    return this.correoUsuario === 'admin@redsalud.cl';
  }
  
}