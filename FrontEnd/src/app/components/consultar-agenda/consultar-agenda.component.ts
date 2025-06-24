import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Para *ngFor, *ngIf
import { FormsModule } from '@angular/forms';   // Para [(ngModel)]
import { RouterModule } from '@angular/router'; // Para el botón de volver

// Reutilizamos las interfaces ya definidas
interface Professional {
  id: number;
  name: string;
  specialty: string;
}

interface Reservation {
  day: string;
  time: string;
  professional: Professional | null;
  specialty: string;
  floor: number;
  box: string;
}

@Component({
  selector: 'app-consultar-agenda',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule], // Importa los módulos necesarios
  templateUrl: './consultar-agenda.component.html',
  styleUrls: ['./consultar-agenda.component.css']
})
export class ConsultarAgendaComponent implements OnInit {

  // --- Datos de ejemplo (para los filtros, pueden ser los mismos que en reservar-box) ---
  specialties: string[] = ['Medicina General', 'Ginecología', 'Odontología', 'Pediatría'];
  floors: number[] = [1, 2, 3, 4, 5, 6];
  daysOfWeek: string[] = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

  // Asumiendo que esta lista de profesionales es global o se obtiene de un servicio
  allProfessionals: Professional[] = [
    { id: 1, name: 'Dr. Juan Pérez', specialty: 'Medicina General' },
    { id: 2, name: 'Dra. Ana Gómez', specialty: 'Medicina General' },
    { id: 3, name: 'Dr. Carlos Soto', specialty: 'Ginecología' },
    { id: 4, name: 'Dra. Laura Méndez', specialty: 'Odontología' },
    { id: 5, name: 'Dr. Mario Bros', specialty: 'Pediatría' },
    { id: 6, name: 'Dra. Peach Toadstool', specialty: 'Pediatría' },
  ];

  // --- Listas de reservas ---
  allReservations: Reservation[] = []; // Todas las reservas cargadas
  filteredReservations: Reservation[] = []; // Reservas después de aplicar filtros

  // --- Variables para los filtros ---
  filterDay: string = '';
  filterSpecialty: string = '';
  filterProfessionalId: string = '';
  filterFloor: string = '';
  filterBox: string = '';

  // Profesionales filtrados por especialidad para el dropdown del filtro
  filteredProfessionalsForFilter: Professional[] = [];

  ngOnInit(): void {
    this.loadReservations();
    this.applyFilters(); // Aplica los filtros iniciales (sin filtros, muestra todo)
  }

  private loadReservations(): void {
    const storedReservations = localStorage.getItem('confirmedBoxReservations');
    if (storedReservations) {
      this.allReservations = JSON.parse(storedReservations);
    }
  }

  // Método que se llama cuando cambia cualquier filtro
  onFilterChange(): void {
    this.applyFilters();
  }

  // Método para aplicar los filtros a las reservas
  applyFilters(): void {
    let tempReservations = [...this.allReservations]; // Copia de todas las reservas

    // Filtro por día de la semana
    if (this.filterDay) {
      tempReservations = tempReservations.filter(res => res.day === this.filterDay);
    }

    // Filtro por especialidad
    if (this.filterSpecialty) {
      tempReservations = tempReservations.filter(res => res.specialty === this.filterSpecialty);
      // También actualiza la lista de profesionales para el filtro de profesional
      this.filteredProfessionalsForFilter = this.allProfessionals.filter(p => p.specialty === this.filterSpecialty);
    } else {
      // Si no hay especialidad seleccionada, muestra todos los profesionales en el filtro
      this.filteredProfessionalsForFilter = [...this.allProfessionals];
    }
    // Si la especialidad cambia y el profesional seleccionado ya no coincide, resetéalo
    if (this.filterProfessionalId && !this.filteredProfessionalsForFilter.some(p => p.id === Number(this.filterProfessionalId))) {
      this.filterProfessionalId = '';
    }


    // Filtro por profesional
    if (this.filterProfessionalId) {
      tempReservations = tempReservations.filter(res => res.professional?.id === Number(this.filterProfessionalId));
    }

    // Filtro por piso
    if (this.filterFloor) {
      tempReservations = tempReservations.filter(res => res.floor === Number(this.filterFloor));
    }

    // Filtro por box
    if (this.filterBox) {
      tempReservations = tempReservations.filter(res => res.box === this.filterBox);
    }

    this.filteredReservations = tempReservations;
  }

  // Método para resetear todos los filtros
  resetFilters(): void {
    this.filterDay = '';
    this.filterSpecialty = '';
    this.filterProfessionalId = '';
    this.filterFloor = '';
    this.filterBox = '';
    this.filteredProfessionalsForFilter = [...this.allProfessionals]; // Reiniciar lista de profesionales
    this.applyFilters(); // Aplicar filtros para mostrar todas las reservas
  }

  // Método auxiliar para convertir string a number (útil si los valores de los selects son string)
  stringToNumber(value: string): number {
    return Number(value);
  }
}