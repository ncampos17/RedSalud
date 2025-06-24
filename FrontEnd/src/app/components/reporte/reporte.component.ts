import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Para *ngFor, *ngIf, pipe async
import { FormsModule } from '@angular/forms';   // Para [(ngModel)] (si se agregan filtros)
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

// Interfaces para los datos del reporte
interface SpecialtyOccupation {
  specialty: string;
  totalBoxesOccupied: number;
  // Podrías añadir más métricas aquí, ej:
  // reservationsCount: number;
  // professionalsCount: number;
}

interface FloorOccupation {
  floor: number;
  totalBoxesOccupied: number;
  // Podrías añadir un desglose por box dentro del piso
  boxesDetail: { box: string, count: number }[];
}


@Component({
  selector: 'app-reporte-ocupacion',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './reporte.component.html',
  styleUrls: ['./reporte.component.css']
})
export class ReporteOcupacionComponent implements OnInit {

  allReservations: Reservation[] = []; // Todas las reservas cargadas

  // Datos para los reportes
  totalReservationsCount: number = 0;
  specialtyOccupations: SpecialtyOccupation[] = [];
  floorOccupations: FloorOccupation[] = [];

  // Podrías agregar filtros de fecha si tu sistema de reservas los maneja
  // Por ahora, el reporte será sobre todas las reservas en localStorage.

  ngOnInit(): void {
    this.loadReservations();
    this.generateReports();
  }

  private loadReservations(): void {
    const storedReservations = localStorage.getItem('confirmedBoxReservations');
    if (storedReservations) {
      this.allReservations = JSON.parse(storedReservations);
    }
  }

  private generateReports(): void {
    this.totalReservationsCount = this.allReservations.length;

    // --- Reporte por Especialidad ---
    const specialtyMap = new Map<string, number>(); // Map<Specialty, Count>
    this.allReservations.forEach(res => {
      const currentCount = specialtyMap.get(res.specialty) || 0;
      specialtyMap.set(res.specialty, currentCount + 1);
    });

    this.specialtyOccupations = Array.from(specialtyMap.entries()).map(([specialty, count]) => ({
      specialty: specialty,
      totalBoxesOccupied: count
    }));
    // Opcional: Ordenar por ocupación descendente
    this.specialtyOccupations.sort((a, b) => b.totalBoxesOccupied - a.totalBoxesOccupied);


    // --- Reporte por Piso ---
    const floorMap = new Map<number, { total: number, boxes: Map<string, number> }>();
    this.allReservations.forEach(res => {
      if (!floorMap.has(res.floor)) {
        floorMap.set(res.floor, { total: 0, boxes: new Map<string, number>() });
      }
      const floorData = floorMap.get(res.floor)!;
      floorData.total++;
      const currentBoxCount = floorData.boxes.get(res.box) || 0;
      floorData.boxes.set(res.box, currentBoxCount + 1);
    });

    this.floorOccupations = Array.from(floorMap.entries()).map(([floor, data]) => ({
      floor: floor,
      totalBoxesOccupied: data.total,
      boxesDetail: Array.from(data.boxes.entries()).map(([box, count]) => ({ box: box, count: count }))
                                                     .sort((a, b) => a.box.localeCompare(b.box)) // Ordenar boxes alfabéticamente
    }));
    // Opcional: Ordenar por número de piso
    this.floorOccupations.sort((a, b) => a.floor - b.floor);

    // --- Otras métricas que podrías añadir ---
    // Ej: Ocupación por día de la semana, por hora, etc.
    // Ej: Número de profesionales distintos que han reservado
  }
}