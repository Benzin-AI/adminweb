import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { NgIf } from '@angular/common';
import { NavbarService } from '../../services/navbar.service';


@Component({
  selector: 'app-navbar',
  standalone: true,
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  imports: [NgIf]
})
export class NavbarComponent implements OnInit {
  userEmail: string | null = null;

  constructor(
    private authService: AuthService,
    private router: Router,
    public navbarService: NavbarService
  ) { }

  ngOnInit(): void {
    this.userEmail = this.authService.getCurrentUser()?.email || null;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
