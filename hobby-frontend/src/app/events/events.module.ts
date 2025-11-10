import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { EventsRoutingModule } from './events-routing.module';
import { EventsComponent } from './components/events/events.component';
import { EventDetailComponent } from './components/event-detail/event-detail.component';
import { EventFormComponent } from './components/event-form/event-form.component';
import { EventService } from './services/event.service';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [
    EventsComponent,
    EventDetailComponent,
    EventFormComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    EventsRoutingModule,
    SharedModule
  ],
  providers: [
    EventService
  ],
  exports: []
})
export class EventsModule { }

