import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/service/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(private _AuthService: AuthService, private router: Router) {}
  canActivate(): boolean {
    const role = this._AuthService.getRole();
   
    if (role === 'Admin') {
      return true;
    } else {
      this.router.navigate(['/not-allowed']);
      return false;
    }
  }
  
}
