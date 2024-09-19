import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { Observable, tap} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://localhost:3000/api/auth';
  private currentUserKey = 'currentUser';
  private usersKey = 'usersList'; // Clave para almacenar la lista de usuarios

  constructor(private http: HttpClient) { }

  signUp(userData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/signup`, userData);
  }

  signIn(userData: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/signin`, userData).pipe(
      tap(response => {
        console.log('Respuesta de inicio de sesión:', response);
        if (response.user && response.token) {
          this.setCurrentUser(response.user);
          this.saveToken(response.token);
        }
      })
    );
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isAuthenticated(): boolean {
    return this.getToken() !== null;
  }

  saveToken(token: string): void {
    localStorage.setItem('token', token);
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem(this.currentUserKey);
  }

  getUsersList(): any[] {
    const usersJson = localStorage.getItem(this.usersKey);
    return usersJson ? JSON.parse(usersJson) : [];
  }
  
  setCurrentUser(user: any): void {
    let users = this.getUsersList();
    const existingUserIndex = users.findIndex(u => u.email === user.email);
    if (existingUserIndex !== -1) {
      users[existingUserIndex] = user;
    } else {
      users.push(user);
    }
    localStorage.setItem(this.usersKey, JSON.stringify(users));
    localStorage.setItem(this.currentUserKey, JSON.stringify(user));
  }

  getCurrentUser(): any {
    const userJson = localStorage.getItem(this.currentUserKey);
    return userJson ? JSON.parse(userJson) : null;
  }

  getUserRole(): string | null {
    const user = this.getCurrentUser();
    return user ? user.role : null;
  }


  getUserByEmail(email: string): any | null {
    const users = this.getUsersList();
    console.log(this.getUserByEmail)
    return users.find(user => user.email === email) || null;
  }
}
