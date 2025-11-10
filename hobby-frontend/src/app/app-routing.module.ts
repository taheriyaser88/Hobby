import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingComponent } from './components/landing/landing.component';
import { LoginComponent } from './components/login/login.component';
import { MainLayoutComponent } from './components/shared/main-layout/main-layout.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { DocsComponent } from './components/docs/docs.component';
import { DocsInteractiveComponent } from './components/docs-interactive/docs-interactive.component';

const routes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'login', component: LoginComponent },
  { 
    path: '', 
    component: MainLayoutComponent,
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { 
        path: 'tasks', 
        loadChildren: () => import('./tasks/tasks.module').then(m => m.TasksModule)
      },
      { 
        path: 'events', 
        loadChildren: () => import('./events/events.module').then(m => m.EventsModule)
      },
      { 
        path: 'users', 
        loadChildren: () => import('./users/users.module').then(m => m.UsersModule)
      }
    ]
  },
  { path: 'profile', component: LoginComponent },
  { path: 'docs', component: DocsComponent },
  { path: 'docs-interactive', component: DocsInteractiveComponent },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }

