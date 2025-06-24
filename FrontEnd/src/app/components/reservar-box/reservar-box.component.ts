import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Definimos una interfaz para el profesional
interface Professional {
  id: number;
  name: string;
  specialty: string;
}

// Actualizamos la interfaz para la reserva
interface Reservation {
  day: string;
  time: string;
  professional: Professional | null;
  specialty: string;
  floor: number;
  box: string;
}

@Component({
  selector: 'app-reservar-box',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './reservar-box.component.html',
  styleUrls: ['./reservar-box.component.css']
})
export class ReservarBoxComponent implements OnInit {

  // --- DATOS DE EJEMPLO ---
  specialties: string[] = ['Medicina General', 'Ginecología', 'Odontología', 'Pediatría'];
  floors: number[] = [1, 2, 3, 4, 5, 6];

  allProfessionals: Professional[] = [
    { id: 1, name: 'Dr. Juan Pérez', specialty: 'Medicina General' },
    { id: 2, name: 'Dra. Ana Gómez', specialty: 'Medicina General' },
    { id: 3, name: 'Dr. Carlos Soto', specialty: 'Ginecología' },
    { id: 4, name: 'Dra. Laura Méndez', specialty: 'Odontología' },
    { id: 5, name: 'Dr. Mario Bros', specialty: 'Pediatría' },
    { id: 6, name: 'Dra. Peach Toadstool', specialty: 'Pediatría' },
  ];

  // --- ESTADO DE LOS FILTROS Y LA GRILA ---
  daysOfWeek: string[] = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
  timeSlots: string[] = [];
  boxes: string[] = []; // Los boxes disponibles para el piso seleccionado

  // Filtros de selección
  selectedSpecialty: string = '';
  selectedProfessionalId: string = '';
  selectedFloor: string = '';
  selectedBox: string = '';

  // Profesionales filtrados para el dropdown
  filteredProfessionals: Professional[] = [];

  // Almacena la selección actual del usuario
  currentSelection: Reservation | null = null;

  // Almacena las reservas confirmadas para simular ocupación (cargadas desde localStorage)
  confirmedReservations: Reservation[] = [];

  ngOnInit() {
    this.timeSlots = this.generateTimeSlots('08:00', '18:00', 20);
    this.loadReservations(); // Cargar reservas al iniciar el componente
  }

  private generateTimeSlots(start: string, end: string, interval: number): string[] {
    const slots = [];
    let currentTime = new Date(`1970-01-01T${start}:00`);
    const endTime = new Date(`1970-01-01T${end}:00`);
    while (currentTime < endTime) {
      slots.push(currentTime.toTimeString().substring(0, 5));
      currentTime.setMinutes(currentTime.getMinutes() + interval);
    }
    return slots;
  }

  // --- Métodos para cargar y guardar reservas en localStorage ---
  private loadReservations(): void {
    const storedReservations = localStorage.getItem('confirmedBoxReservations');
    if (storedReservations) {
      this.confirmedReservations = JSON.parse(storedReservations);
    }
  }

  private saveReservations(): void {
    localStorage.setItem('confirmedBoxReservations', JSON.stringify(this.confirmedReservations));
  }

  // --- Lógica de los filtros ---
  onSpecialtyChange(): void {
    this.filteredProfessionals = this.allProfessionals.filter(p => p.specialty === this.selectedSpecialty);
    // Reseteamos todas las selecciones dependientes
    this.selectedProfessionalId = '';
    this.selectedFloor = '';
    this.selectedBox = '';
    this.boxes = [];
    this.currentSelection = null;
  }

  onProfessionalChange(): void {
    // Reseteamos selecciones dependientes si cambia el profesional
    this.selectedFloor = '';
    this.selectedBox = '';
    this.boxes = [];
    this.currentSelection = null;
  }

  onFloorChange(): void {
    if (this.selectedFloor) {
      // Generamos 5 boxes genéricos por cada piso
      this.boxes = Array.from({ length: 5 }, (_, i) => `Box ${i + 1}`);
    } else {
      this.boxes = [];
    }
    // Reseteamos selecciones dependientes
    this.selectedBox = '';
    this.currentSelection = null;
  }

  onBoxChange(): void {
    // Reseteamos la selección de horario si cambia el box
    this.currentSelection = null;
  }

  // --- Nuevo método para generar un objeto de reserva potencial ---
  // Este método se llamará desde el HTML para construir el objeto de la reserva para isSlotBooked
  getPotentialSlotReservation(day: string, time: string): Reservation | null {
    if (!this.selectedSpecialty || !this.selectedProfessionalId || !this.selectedFloor || !this.selectedBox) {
      return null; // No podemos formar una reserva completa sin todos los filtros
    }

    const professional = this.allProfessionals.find(p => p.id === Number(this.selectedProfessionalId)) || null;

    if (!professional) {
      return null; // No se encontró un profesional válido
    }

    return {
      day: day,
      time: time,
      professional: professional,
      specialty: this.selectedSpecialty,
      floor: this.stringToNumber(this.selectedFloor), // Usamos el nuevo método auxiliar
      box: this.selectedBox
    };
  }


  // --- Lógica de selección y confirmación de slots ---
  selectSlot(day: string, time: string): void {
    // Validar que se hayan seleccionado todos los filtros
    if (!this.selectedSpecialty || !this.selectedProfessionalId || !this.selectedFloor || !this.selectedBox) {
      alert('Por favor, complete todos los filtros (Especialidad, Profesional, Piso y Box) antes de seleccionar un horario.');
      return;
    }

    // Usamos el nuevo método para obtener la reserva potencial
    const potentialReservation = this.getPotentialSlotReservation(day, time);

    if (!potentialReservation) {
      alert('No se pudo formar la reserva. Verifique la selección de profesional o filtros incompletos.');
      return;
    }

    // *** CAMBIO CLAVE AQUÍ: Se verifica si el box ya está ocupado en ese día y hora, independientemente del profesional. ***
    if (this.isBoxBooked(potentialReservation)) {
      alert('Este box ya está ocupado en el día y hora seleccionados. Por favor, elija otro horario o box.');
      return;
    }

    this.currentSelection = potentialReservation;
  }

  confirmReservation(): void {
    if (this.currentSelection) {
      // Doble verificación antes de añadir, aunque selectSlot ya lo debería haber prevenido
      if (this.isBoxBooked(this.currentSelection)) {
        alert('Esta reserva ya existe o el box está ocupado. No se puede confirmar.');
        this.currentSelection = null; // Limpiar la selección actual si ya está reservada
        return;
      }

      this.confirmedReservations.push(this.currentSelection);
      this.saveReservations(); // Guardar las reservas en localStorage

      alert(`¡Reserva confirmada!\n` +
        `Profesional: ${this.currentSelection.professional?.name}\n` +
        `Piso: ${this.currentSelection.floor}, Box: ${this.currentSelection.box}\n` +
        `Día: ${this.currentSelection.day}, Hora: ${this.currentSelection.time}`);

      this.currentSelection = null; // Limpiar la selección después de confirmar
      // Opcional: Podrías resetear todos los filtros aquí o redirigir al usuario.
    } else {
      alert('No hay ninguna reserva seleccionada para confirmar.');
    }
  }

  // *** MÉTODO ORIGINAL 'isSlotBooked' RENOMBRADO/MODIFICADO para verificar si un slot específico (profesional, día, hora, box) está reservado ***
  // Útil para la clase 'selected' en el HTML si quieres resaltar la selección actual
  isSlotSelectedForCurrentFilters(checkReservation: Reservation): boolean {
    return this.confirmedReservations.some(reservation =>
      reservation.day === checkReservation.day &&
      reservation.time === checkReservation.time &&
      // Compara el ID del profesional
      reservation.professional?.id === checkReservation.professional?.id &&
      reservation.floor === checkReservation.floor &&
      reservation.box === checkReservation.box
    );
  }

  // *** NUEVO MÉTODO PARA VERIFICAR SI UN BOX ESTÁ OCUPADO EN UN HORARIO ESPECÍFICO (IGNORANDO EL PROFESIONAL) ***
  isBoxBooked(checkReservation: Reservation): boolean {
    return this.confirmedReservations.some(reservation =>
      reservation.day === checkReservation.day &&
      reservation.time === checkReservation.time &&
      reservation.floor === checkReservation.floor &&
      reservation.box === checkReservation.box
    );
  }

  // --- Nuevo método para cancelar una reserva ---
  cancelReservation(reservationToCancel: Reservation): void {
    if (confirm(`¿Estás seguro de que quieres cancelar la reserva para ${reservationToCancel.professional?.name} en ${reservationToCancel.day} a las ${reservationToCancel.time} en Piso ${reservationToCancel.floor}, ${reservationToCancel.box}?`)) {
      this.confirmedReservations = this.confirmedReservations.filter(reservation =>
        !(reservation.day === reservationToCancel.day &&
          reservation.time === reservationToCancel.time &&
          reservation.professional?.id === reservationToCancel.professional?.id &&
          reservation.floor === reservationToCancel.floor &&
          reservation.box === reservationToCancel.box)
      );
      this.saveReservations(); // Actualizar localStorage
      alert('Reserva cancelada con éxito.');
      // Opcional: limpiar la selección actual si era la que se canceló
      if (this.currentSelection && this.isSameReservation(this.currentSelection, reservationToCancel)) {
        this.currentSelection = null;
      }
    }
  }

  // Helper para comparar si dos objetos de reserva son iguales
  private isSameReservation(res1: Reservation, res2: Reservation): boolean {
    return res1.day === res2.day &&
           res1.time === res2.time &&
           res1.professional?.id === res2.professional?.id &&
           res1.specialty === res2.specialty &&
           res1.floor === res2.floor &&
           res1.box === res2.box;
  }

  // --- MÉTODO AUXILIAR para convertir string a number en la plantilla ---
  stringToNumber(value: string): number {
    return Number(value);
  }

  filterProfessionalId: string = '';
filterFloor: string = '';
filterBox: string = '';
filterDateTime: string = '';

get filteredReservations() {
  return this.confirmedReservations.filter(res => {
    const matchesProfessional = !this.filterProfessionalId || res.professional?.id === Number(this.filterProfessionalId);
    const matchesFloor = !this.filterFloor || res.floor === Number(this.filterFloor);
    const matchesBox = !this.filterBox || res.box === this.filterBox;
    const matchesDateTime =
      !this.filterDateTime ||
      res.day.toLowerCase().includes(this.filterDateTime.toLowerCase()) ||
      res.time.includes(this.filterDateTime);
    return matchesProfessional && matchesFloor && matchesBox && matchesDateTime;
  });
}

resetReservationFilters(): void {
  this.filterProfessionalId = '';
  this.filterFloor = '';
  this.filterBox = '';
  this.filterDateTime = '';
}



}