import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';

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
  errorMessage: string | null = null;
  private errorTimer: any;

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.loadUsers();
  }

  async loadUsers(): Promise<void> {
    try {
      const data = await firstValueFrom(this.userService.getUsers());
      this.users = data;
    } catch (error: unknown) {
      console.error('Error al cargar los usuarios', error);
      this.errorMessage = 'Error al cargar los usuarios';
    }
  }

  startAddingUser(): void {
    this.selectedUser = null;
    this.currentUser = {
      name: '',
      email: '',
      password: '',
      roles: ['vendedor'] // Seleccionar por defecto el rol "vendedor"
    };
    this.isAddingUser = true;
  }

  editUser(user: any): void {
    this.selectedUser = { ...user };
    this.currentUser = {
      name: user.name,
      email: user.email,
      password: '',
      roles: user.roles.map((role: any) => role.name) || []
    };
    this.isAddingUser = false;
  }

  async onSaveUser(): Promise<void> {
    // Validar campos requeridos
    if (!this.currentUser.name) {
      this.showErrorMessage('El nombre es requerido');
      return;
    }

    if (!this.currentUser.email) {
      this.showErrorMessage('El email es requerido');
      return;
    }

    // Validar formato del correo electrónico
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(this.currentUser.email)) {
      this.showErrorMessage('El formato del email no es válido');
      return;
    }

    // Si estamos editando un usuario y la contraseña está vacía, la quitamos del objeto para que no se actualice
    if (this.selectedUser && !this.currentUser.password) {
      delete this.currentUser.password;
    } else if (!this.currentUser.password) {
      this.showErrorMessage('La contraseña es requerida');
      return;
    }

    try {
      if (this.selectedUser) {
        // Actualizar usuario existente
        const updatedUser = await firstValueFrom(this.userService.updateUser(this.selectedUser._id, this.currentUser));
        const index = this.users.findIndex(user => user._id === updatedUser._id);
        if (index > -1) {
          this.users[index] = updatedUser;
        }
        this.selectedUser = null;
      } else {
        // Crear nuevo usuario
        const createdUser = await firstValueFrom(this.userService.createUser(this.currentUser));
        this.users.push(createdUser);
      }
      this.currentUser = { roles: [] };
      this.isAddingUser = false;
    } catch (error: unknown) {
      console.error('Error al guardar el usuario', error);
      if ((error as any).status === 403) {
        this.showErrorMessage(this.selectedUser ? 'No tienes permisos para actualizar el usuario.' : 'No tienes permisos para agregar usuarios.');
      } else {
        this.showErrorMessage(this.selectedUser ? 'Debes seleccionar un rol' : 'Ese email ya está en uso');
      }
    }
  }

  onCancel(): void {
    this.selectedUser = null;
    this.currentUser = { roles: [] };
    this.isAddingUser = false;
  }

  async deleteUser(userId: string): Promise<void> {
    if (confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
      try {
        await firstValueFrom(this.userService.deleteUser(userId));
        this.users = this.users.filter(user => user._id !== userId);
        this.selectedUser = null;
        this.currentUser = { roles: [] };
      } catch (error: unknown) {
        console.error('Error al eliminar el usuario', error);
        this.errorMessage = 'Error al eliminar el usuario';
      }
    }
  }

  private showErrorMessage(message: string): void {
    this.errorMessage = message;
    if (this.errorTimer) {
      clearTimeout(this.errorTimer);
    }
    this.errorTimer = setTimeout(() => {
      this.errorMessage = null;
    }, 3000);
  }
}
