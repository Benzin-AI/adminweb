import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { LoginComponent } from './components/login/login.component';
import { ProductsComponent } from './components/product/product.component';
import { LayoutComponent } from './layout/layout.component';
import { UsersComponent } from './components/usuarios/usuarios.component';
import { UserService } from './services/user.service';
import { AuthGuard } from './guards/auth.guard';
import { AuthService } from './services/auth.service';
import { AdminGuard } from './guards/admin.guard';


export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'products', component: ProductsComponent },
      { path: 'usuarios', component: UsersComponent, canActivate: [AdminGuard] }
    ]
  },

  { path: '**', redirectTo: '/login' }
];

@NgModule({
  imports: [BrowserModule, RouterModule.forRoot(routes)],
  providers: [provideHttpClient(), UserService, AuthService],
  exports: [RouterModule]
})
export class AppRoutingModule { }
