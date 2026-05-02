import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface User {
  id: number;
  username: string;
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'https://localhost:8443/api';

  private currentUserSubject = new BehaviorSubject<User | null>(
    JSON.parse(localStorage.getItem('currentUser') || 'null')
  );

  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {}

  get currentUser(): User | null {
    return this.currentUserSubject.value;
  }

  get isLoggedIn(): boolean {
    return !!this.currentUserSubject.value;
  }

  get username(): string {
    return this.currentUser?.username || '';
  }

  login(username: string, password: string): Observable<User> {
    // Mock login: Accept any username/password for now
    const mockUser: User = {
      id: 1,
      username: username,
      token: 'mock-jwt-token-' + Math.random().toString(36).substring(7)
    };

    return new Observable<User>(observer => {
      setTimeout(() => {
        localStorage.setItem('currentUser', JSON.stringify(mockUser));
        sessionStorage.setItem('username', JSON.stringify(username)); // For compatibility
        this.currentUserSubject.next(mockUser);
        observer.next(mockUser);
        observer.complete();
      }, 500); // Simulate network delay
    });
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    sessionStorage.removeItem('username');
    this.currentUserSubject.next(null);
  }
}