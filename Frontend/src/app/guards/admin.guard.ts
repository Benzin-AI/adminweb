import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    if (this.authService.isAuthenticated()) {
      const userRole = this.authService.getUserRole();
      if (userRole === 'admin') {
        return true;
      } else {
        this.router.navigate(['/products']);
        return false;
      }
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }
}
