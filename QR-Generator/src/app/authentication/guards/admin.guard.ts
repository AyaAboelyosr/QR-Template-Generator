import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  async canActivate(): Promise<boolean> {
    const role = this.authService.getRole();
    const isLoggedIn = await firstValueFrom(this.authService.isLoggedIn$);
  
    if (isLoggedIn && role === 'Admin') {
      return true; 
    }
  
    this.router.navigate(['/auth/login']); 
    return false;
  }
}
