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
  selectedProduct: any = null;
  showDetails = false;

  constructor(private productService: ProductService) { }

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.productService.getProducts().pipe(
      tap((data) => {
        this.products = data;
      }),
      catchError((error) => {
        console.error('Error al cargar los productos', error);
        return of([]);
      })
    ).subscribe();
  }

  editProduct(product: any): void {
    if (!this.showDetails) {
      this.selectedProduct = { ...product }; // Clonar el producto seleccionado para edición
    }
  }

  addNewProduct(): void {
    if (!this.showDetails) {
      this.selectedProduct = { name: '', price: 0, description: '' }; // Inicializar un nuevo producto vacío
    }
  }

  onSaveProduct(): void {
    if (!this.selectedProduct.name || !this.selectedProduct.price) {
      // Mostrar alerta si los campos requeridos están vacíos
      alert('Nombre y precio son campos requeridos');
      return;
    }

    // Convertir el precio a un número entero
    const price = parseInt(this.selectedProduct.price, 10);

    // Validar que el precio sea un número entero positivo
    if (isNaN(price) || price < 0) {
      alert('El precio debe ser un número entero positivo');
      return;
    }

    this.selectedProduct.price = price; // Actualizar el precio en el producto

    if (this.selectedProduct._id) {
      // Actualizar producto existente
      this.productService.updateProduct(this.selectedProduct._id, this.selectedProduct).subscribe(
        (updatedProduct) => {
          const index = this.products.findIndex(product => product._id === updatedProduct._id);
          if (index > -1) {
            this.products[index] = updatedProduct;
          }
          this.selectedProduct = null; // Limpiar la selección
          this.showDetails = false; // Ocultar detalles después de la edición
        },
        (error) => {
          console.error('Error al actualizar el producto', error);
        }
      );
    } else {
      // Agregar nuevo producto
      this.productService.createProduct(this.selectedProduct).subscribe(
        (newProduct) => {
          this.products.push(newProduct); // Añadir el nuevo producto a la lista
          this.selectedProduct = null; // Limpiar la selección
          this.showDetails = false; // Ocultar detalles después de agregar el producto
        },
        (error) => {
          console.error('Error al agregar el producto', error);
        }
      );
    }
  }

  cancelEdit(): void {
    this.selectedProduct = null; // Limpiar la selección y cerrar el formulario de edición
    this.showDetails = false; // Ocultar detalles cuando se cancela la edición
  }

  deleteProduct(id: string): void {
    if (confirm('¿Estás seguro de que deseas eliminar este producto?')) {
      this.productService.deleteProduct(id).subscribe(
        () => {
          this.products = this.products.filter(product => product._id !== id); // Actualizar la lista eliminando el producto
          this.selectedProduct = null; // Limpiar la selección
          this.showDetails = false; // Ocultar detalles después de eliminar un producto
        },
        (error) => {
          console.error('Error al eliminar el producto', error);
        }
      );
    }
  }

  showProductDetails(product: any): void {
    this.selectedProduct = product; // Asignar el producto seleccionado
    this.showDetails = true; // Mostrar detalles
  }

  closeDetails(): void {
    this.showDetails = false; // Ocultar detalles
    this.selectedProduct = null; // Limpiar el producto seleccionado
  }
}
