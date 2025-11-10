import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UsersComponent } from './components/users/users.component';
import { UserFormComponent } from './components/user-form/user-form.component';
import { UserDetailComponent } from './components/user-detail/user-detail.component';

const routes: Routes = [
  { path: '', component: UsersComponent },
  { 
    path: 'new', 
    loadComponent: () => import('./components/user-form/user-form.component').then(m => m.UserFormComponent)
  },
  { 
    path: 'edit/:id', 
    loadComponent: () => import('./components/user-form/user-form.component').then(m => m.UserFormComponent)
  },
  { 
    path: ':id', 
    loadComponent: () => import('./components/user-detail/user-detail.component').then(m => m.UserDetailComponent)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersRoutingModule { }

