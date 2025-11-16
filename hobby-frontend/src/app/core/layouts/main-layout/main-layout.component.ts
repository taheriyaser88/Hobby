import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DashboardNavbarComponent } from '../../components/dashboard-navbar/dashboard-navbar.component';

@Component({
  standalone: true,
  selector: 'app-main-layout',
  imports: [CommonModule, RouterModule, DashboardNavbarComponent],
  template: `
    <app-dashboard-navbar></app-dashboard-navbar>
    <main class="main-container">
      <router-outlet></router-outlet>
    </main>
  `,
  styles: [`
    .main-container {
      padding: 1rem;
      max-width: 1200px;
      margin: 0 auto;
      width: 100%;
    }
    @media (min-width: 1024px) {
      .main-container { padding: 1.25rem; }
    }
  `]
})
export class MainLayoutComponent {}


