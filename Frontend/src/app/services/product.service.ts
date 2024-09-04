import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'http://localhost:3000/api/products';

  constructor(private http: HttpClient) { }

  // Método para obtener todos los productos
  getProducts(): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('x-access-token', token ? token : '');
    return this.http.get(this.apiUrl, { headers });
  }

  // Método para obtener un producto por ID
  getProductById(id: string): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('x-access-token', token ? token : '');
    return this.http.get(`${this.apiUrl}/${id}`, { headers });
  }

  // Método para crear un nuevo producto
  createProduct(product: any): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('x-access-token', token ? token : '');
    return this.http.post(this.apiUrl, product, { headers });
  }

  // Método para actualizar un producto existente
  updateProduct(id: string, product: any): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('x-access-token', token ? token : '');
    return this.http.put(`${this.apiUrl}/${id}`, product, { headers });
  }

  // Método para eliminar un producto
  deleteProduct(id: string): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('x-access-token', token ? token : '');
    return this.http.delete(`${this.apiUrl}/${id}`, { headers });
  }
}
