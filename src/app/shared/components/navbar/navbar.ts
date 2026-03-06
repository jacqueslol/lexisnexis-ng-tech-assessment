import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faBars, faHome, faX } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, FaIconComponent],
  standalone: true,
  template: `
    <nav class="navbar">
      <div class="nav-header">
        <div class="brand-wrapper">
          <a class="brand nav-item" [routerLink]="['/']" (click)="isMenuOpen = false">
            <fa-icon [icon]="faHome" style="color: #e8171f;"></fa-icon>
            Catalog
          </a>
        </div>
        <a class="desktop-only nav-item" [routerLink]="['/favorites']">Favorites</a>
        <a class="desktop-only nav-item" [routerLink]="['/admin']">Admin</a>

        <button
          class="menu-toggle mobile-only"
          (click)="toggleMenu()"
          aria-label="Toggle navigation"
          aria-expanded="{{ isMenuOpen }}"
        >
          <fa-icon [icon]="isMenuOpen ? faX : faBars"></fa-icon>
        </button>
      </div>

      <div class="nav-links animated" [class.open]="isMenuOpen">
        <a class="nav-item" [routerLink]="['/']" (click)="isMenuOpen = false">Catalog</a>
        <a class="nav-item" [routerLink]="['/favorites']" (click)="isMenuOpen = false">Favorites</a>
        <a class="nav-item" [routerLink]="['/admin']" (click)="isMenuOpen = false">Admin</a>
      </div>
    </nav>
  `,
  styleUrls: ['./navbar.scss'],
})
export class Navbar {
  // Icons
  faBars = faBars;
  faX = faX;
  faHome = faHome;

  isMenuOpen = false;

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }
}
