import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-list',
  standalone: true,
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.scss'],
  imports: [CommonModule, FormsModule]
})
export class UsersComponent implements OnInit {
  users: any[] = [];
  selectedUser: any = null;
  currentUser: any = { roles: [] };
  isAddingUser: boolean = false;
  errorMessage: string = '';

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getUsers().subscribe(
      (data) => {
        this.users = data;
      },
      (error) => {
        console.error('Error al cargar los usuarios', error);
        this.errorMessage = 'Error al cargar los usuarios';
      }
    );
  }

  startAddingUser(): void {
    this.selectedUser = null;
    this.currentUser = { roles: [] };
    this.isAddingUser = true;
  }

  editUser(user: any): void {
    this.selectedUser = { ...user };
    this.currentUser = {
      name: user.name,
      email: user.email,
      password: '',
      roles: user.roles
    };
    this.isAddingUser = false;
  }

  onSaveUser(): void {
    if (!this.currentUser.name || !this.currentUser.email || !this.currentUser.password || this.currentUser.roles.length === 0) {
      this.errorMessage = 'Todos los campos (Nombre, Email, Contraseña y Roles) son requeridos';
      return;
    }

    this.errorMessage = ''; // Limpiar mensajes de error previos

    if (this.selectedUser) {
      // Actualizar usuario existente
      this.userService.updateUser(this.selectedUser._id, this.currentUser).subscribe(
        (updatedUser) => {
          const index = this.users.findIndex(user => user._id === updatedUser._id);
          if (index > -1) {
            this.users[index] = updatedUser;
          }
          this.selectedUser = null;
          this.currentUser = { roles: [] };
          this.isAddingUser = false;
        },
        (error) => {
          console.error('Error al actualizar el usuario', error);
          this.errorMessage = 'Error al actualizar el usuario';
        }
      );
    } else {
      // Crear nuevo usuario
      this.userService.createUser(this.currentUser).subscribe(
        (createdUser) => {
          this.users.push(createdUser);
          this.currentUser = { roles: [] };
          this.isAddingUser = false;
        },
        (error) => {
          console.error('Error al agregar el usuario', error);
          if (error.status === 403) {
            this.errorMessage = 'No tienes permisos para agregar usuarios.';
          } else {
            this.errorMessage = 'Error al agregar el usuario';
          }
        }
      );
    }
  }

  onCancel(): void {
    this.selectedUser = null;
    this.currentUser = { roles: [] };
    this.isAddingUser = false;
  }

  deleteUser(userId: string): void {
    if (confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
      this.userService.deleteUser(userId).subscribe(
        () => {
          this.users = this.users.filter(user => user._id !== userId);
          this.selectedUser = null;
          this.currentUser = { roles: [] };
        },
        (error) => {
          console.error('Error al eliminar el usuario', error);
          this.errorMessage = 'Error al eliminar el usuario';
        }
      );
    }
  }
}
