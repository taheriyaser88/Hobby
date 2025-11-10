import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EventsComponent } from './components/events/events.component';
import { EventDetailComponent } from './components/event-detail/event-detail.component';
import { EventFormComponent } from './components/event-form/event-form.component';

const routes: Routes = [
  { path: '', component: EventsComponent },
  { path: 'new', component: EventFormComponent },
  { path: 'edit/:id', component: EventFormComponent },
  { 
    path: ':id', 
    component: EventDetailComponent,
    children: [
      { 
        path: 'overview', 
        loadComponent: () => import('./components/event-detail/event-overview/event-overview.component').then(m => m.EventOverviewComponent) 
      },
      { 
        path: 'tasks', 
        loadComponent: () => import('./components/event-detail/event-tasks/event-tasks.component').then(m => m.EventTasksComponent) 
      },
      { 
        path: 'sessions', 
        loadComponent: () => import('./components/event-detail/event-sessions/event-sessions.component').then(m => m.EventSessionsComponent) 
      },
      { 
        path: 'tickets', 
        loadComponent: () => import('./components/event-detail/event-tickets/event-tickets.component').then(m => m.EventTicketsComponent) 
      },
      { 
        path: 'attendees', 
        loadComponent: () => import('./components/event-detail/event-attendees/event-attendees.component').then(m => m.EventAttendeesComponent) 
      },
      { 
        path: 'analytics', 
        loadComponent: () => import('./components/event-detail/event-analytics/event-analytics.component').then(m => m.EventAnalyticsComponent) 
      },
      { 
        path: 'integrations', 
        loadComponent: () => import('./components/event-detail/event-integrations/event-integrations.component').then(m => m.EventIntegrationsComponent) 
      },
      { 
        path: 'settings', 
        loadComponent: () => import('./components/event-detail/event-settings/event-settings.component').then(m => m.EventSettingsComponent) 
      },
      { path: '', redirectTo: 'overview', pathMatch: 'full' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EventsRoutingModule { }

