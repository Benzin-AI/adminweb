import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';
import { FormsModule} from '@angular/forms';

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
      password:'',
      roles: user.roles.map((role: any) => role.name) || []
    };
    this.isAddingUser = false;
  }

  onSaveUser(): void {
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
      // Si estamos creando un usuario y la contraseña está vacía, mostramos un mensaje de error
      this.showErrorMessage('La contraseña es requerida');
      return;
    }

    // Limpiar mensaje de error en caso de éxito
    this.errorMessage = '';

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
          this.showErrorMessage(error.status === 403 ? 'No tienes permisos para actualizar el usuario.' : 'Debes seleccionar un rol');
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
          if (error.status === 403) {
            this.showErrorMessage('No tienes permisos para agregar usuarios.');
          } else {
            this.showErrorMessage('Ese email ya está en uso');
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
          this.errorMessage = 'Error al eliminar el usuario';
        }
      );
    }
  }
  private showErrorMessage(message: string): void {
    this.errorMessage = message;
    // Limpiar el temporizador anterior, si existe
    if (this.errorTimer) {
      clearTimeout(this.errorTimer);
    }
    // Temporizador para que desaparezca el mensaje de error despues de x tiempo
    this.errorTimer = setTimeout(() => {
      this.errorMessage = null;
    }, 3000);
  }
}
