import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  // Simulación de usuarios
  private users = [
    { email: 'admin@demo.com', password: 'admin123', role: 'admin' },
    { email: 'especialista@demo.com', password: 'esp123', role: 'especialista' }
  ];

  private currentUser: any = null;

  login(email: string, password: string): Observable<any> {
    const user = this.users.find(u => u.email === email && u.password === password);
    if (user) {
      this.currentUser = user;
      return of({ success: true, role: user.role });
    }
    return of({ success: false });
  }

  getCurrentUser() {
    return this.currentUser;
  }

  logout() {
    this.currentUser = null;
  }
}
