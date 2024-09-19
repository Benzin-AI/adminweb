import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { catchError, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-product-list',
  standalone: true,
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
  imports: [CommonModule, FormsModule]
})
export class ProductsComponent implements OnInit {
  products: any[] = [];
  filteredProducts: any[] = [];
  chunkedProducts: any[][] = [];
  selectedProduct: any = null;
  showDetails = false;
  searchTerm: string = '';

  constructor(private productService: ProductService) { }

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.productService.getProducts().pipe(
      tap((data) => {
        this.products = data;
        this.filteredProducts = data;
        this.chunkProducts(); // Dividir productos en chunks
      }),
      catchError((error) => {
        console.error('Error al cargar los productos', error);
        if (error.status === 401) {
          console.log('Error de autenticación. Redirigir al login o mostrar mensaje.');
        }
        return of([]);
      })
    ).subscribe();
  }

  chunkProducts(): void {
    const chunkSize = 5;
    this.chunkedProducts = [];
    for (let i = 0; i < this.filteredProducts.length; i += chunkSize) {
      this.chunkedProducts.push(this.filteredProducts.slice(i, i + chunkSize));
    }
  }

  searchProducts(): void {
    if (!this.searchTerm) {
      this.filteredProducts = this.products;
    } else {
      this.filteredProducts = this.products.filter(product =>
        product.name.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
    this.chunkProducts(); // Actualizar chunks al buscar
  }

  editProduct(product: any): void {
    if (!this.showDetails) {
      this.selectedProduct = { ...product };
    }
  }

  addNewProduct(): void {
    if (!this.showDetails) {
      this.selectedProduct = { name: '', price: '', description: '' };
    }
  }

  onSaveProduct(): void {
    if (!this.selectedProduct.name && !this.selectedProduct.price) {
      alert('Nombre y precio son campos requeridos');
      return;
    }
    if (!this.selectedProduct.price) {
      alert('Precio es un campo requerido');
      return;
    }
    if (!this.selectedProduct.name) {
      alert('Nombre es un campo requerido');
      return;
    }

    const price = parseInt(this.selectedProduct.price, 10);

    if (isNaN(price) || price < 0) {
      alert('El precio debe ser un número entero positivo');
      return;
    }

    this.selectedProduct.price = price;

    if (this.selectedProduct._id) {
      this.productService.updateProduct(this.selectedProduct._id, this.selectedProduct).subscribe(() => {
        this.loadProducts();
        this.selectedProduct = null;
      });
    } else {
      this.productService.createProduct(this.selectedProduct).subscribe(() => {
        this.loadProducts();
        this.selectedProduct = null;
      });
    }
  }

  deleteProduct(productId: any): void {
    if (confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      this.productService.deleteProduct(productId).subscribe(() => {
        this.loadProducts();
      });
    }
  }

  showProductDetails(product: any): void {
    if (!this.selectedProduct || this.selectedProduct._id !== product._id) {
      this.selectedProduct = product;
      this.showDetails = true;
    }
  }

  closeDetails(): void {
    this.showDetails = false;
    this.selectedProduct = null;
  }

  cancelEdit(): void {
    this.selectedProduct = null;
  }
}
