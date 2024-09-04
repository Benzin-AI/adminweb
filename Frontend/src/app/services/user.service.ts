import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:3000/api/users';

  constructor(private http: HttpClient) { }

  // Método para obtener las cabeceras con el token
  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders().set('x-access-token', token ? token : '');
  }

  // Método para obtener todos los usuarios
  getUsers(): Observable<any> {
    const headers = this.getHeaders();
    return this.http.get(this.apiUrl, { headers });
  }

  // Método para obtener un usuario por ID
  getUserById(id: string): Observable<any> {
    const headers = this.getHeaders();
    return this.http.get(`${this.apiUrl}/${id}`, { headers });
  }

  // Método para crear un nuevo usuario
  createUser(user: any): Observable<any> {
    const headers = this.getHeaders();
    return this.http.post(this.apiUrl, user, { headers });
  }

  // Método para actualizar un usuario existente
  updateUser(id: string, user: any): Observable<any> {
    const headers = this.getHeaders();
    return this.http.put(`${this.apiUrl}/${id}`, user, { headers });
  }

  // Método para eliminar un usuario
  deleteUser(id: string): Observable<any> {
    const headers = this.getHeaders();
    return this.http.delete(`${this.apiUrl}/${id}`, { headers });
  }

  // Método para obtener el usuario actual
  getCurrentUser(): Observable<any> {
    const headers = this.getHeaders();
    return this.http.get(`${this.apiUrl}/current`, { headers });
  }
}
