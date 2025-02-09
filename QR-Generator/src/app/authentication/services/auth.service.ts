import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Route, Router } from '@angular/router';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://localhost:7110/api/Authenticate';
  private isLoggedInSubject = new BehaviorSubject<boolean>(this.checkLoginStatus());
  isLoggedIn$: Observable<boolean> = this.isLoggedInSubject.asObservable();

  constructor(private http: HttpClient , private router: Router) {}

  login(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, data).pipe(
      tap((response: any) => {
        if (response?.token) {
          localStorage.setItem('authToken', response.token);
          localStorage.setItem('role', response.role);
          this.setLoginStatus(true);
  
          setTimeout(() => { 
            if (response.role === 'Admin') {
              this.router.navigate(['/QRCodeGenerator/qrgenerator']);
            } else {
              this.router.navigate(['/QRCodeGenerator']);
            }
          }, 100);
        }
      })
    );
  }
  
  

  register(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, data); 
  }

  setRole(role: string) {
    localStorage.setItem('role', role);
  }

  getRole(): string | null {
    return localStorage.getItem('role'); 
  }
  

  logout(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('role');
    localStorage.removeItem('userName');
    this.setLoginStatus(false);
    this.router.navigate(['/auth/login']);
  }
  
  checkAuthenticationState() {
    this.setLoginStatus(this.checkLoginStatus());
  }

  getUserName(): string | null {
    return localStorage.getItem('userName');  // Adjust this based on your storage mechanism
  }

  getAuthHeaders(): { [key: string]: string } {
    const token = localStorage.getItem('authToken');  // Adjust this based on how you store the token
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  private setLoginStatus(isLoggedIn: boolean): void {
    this.isLoggedInSubject.next(isLoggedIn);
  }

   checkLoginStatus(): boolean {
    const token = localStorage.getItem('authToken');
    return !!token; 
  }
  
  
  
}
