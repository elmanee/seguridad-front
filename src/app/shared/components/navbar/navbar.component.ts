import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  public authService = inject(AuthService);
  private router = inject(Router);
  public isDropdownOpen = false;

  ngOnInit() {
    this.router.events.subscribe(() => {
      this.isDropdownOpen = false;
    });
  }

  onLogout() {
    this.isDropdownOpen = false;
    this.authService.logout().subscribe({
      next: () => {
        this.authService.clearTokens();
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('Error al cerrar sesión en el servidor', err);
        this.authService.clearTokens();
        this.router.navigate(['/login']);
      }
    });
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }
}
