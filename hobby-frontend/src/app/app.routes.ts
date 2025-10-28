import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/auth/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { EventListComponent } from './components/event/event-list.component';
import { EventCalendarComponent } from './components/event/event-calendar.component';
import { TaskBoardComponent } from './components/task/task-board.component';
import { LayoutComponent } from './components/layout/layout.component';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { 
    path: 'app', 
    component: LayoutComponent, 
    // canActivate: [AuthGuard], // Temporarily disabled for testing
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'events', component: EventListComponent },
      { path: 'events/calendar', component: EventCalendarComponent },
      { path: 'tasks', component: TaskBoardComponent },
    ]
  },
  { path: '**', redirectTo: '' }
];