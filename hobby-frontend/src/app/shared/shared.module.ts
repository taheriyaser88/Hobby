import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { EventCardComponent } from '../events/components/shared/event-card.component';
import { EventService } from '../events/services/event.service';

@NgModule({
  declarations: [
    EventCardComponent
  ],
  imports: [
    CommonModule,
    RouterModule
  ],
  providers: [
    EventService
  ],
  exports: [
    EventCardComponent
  ]
})
export class SharedModule { }


