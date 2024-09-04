import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  imports: [CommonModule, FormsModule]
})
export class LoginComponent {
  userData = {
    email: '',
    password: ''
  };

  constructor(private authService: AuthService, private router: Router) { }

  signIn() {
    this.authService.signIn(this.userData).subscribe({
      next: (response) => {
        if (response.user && response.token) {
          this.authService.setCurrentUser(response.user); // Guarda el usuario
          this.authService.saveToken(response.token); // Guarda el token

          if (this.authService.isAuthenticated()) {
            this.router.navigate(['/products']);
          } else {
            console.error('Error: El token no está guardado correctamente.');
          }
        } else {
          console.error('Error: Respuesta del servidor no contiene usuario o token.');
        }
      },
      error: (err) => {
        alert('Credenciales incorrectas');
      }
    });
  }

}

