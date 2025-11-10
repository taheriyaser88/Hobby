import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TasksRoutingModule } from './tasks-routing.module';
import { TasksComponent } from './components/tasks/tasks.component';
import { TaskDetailComponent } from './components/task-detail/task-detail.component';
import { TaskFormComponent } from './components/task-form/task-form.component';
import { TaskService } from '../services/task.service';
import { TaskCardComponent } from './components/shared/task-card/task-card.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [
    TasksComponent,
    TaskDetailComponent,
    TaskFormComponent,
    TaskCardComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    TasksRoutingModule,
    SharedModule
  ],
  providers: [
    TaskService
  ],
  exports: []
})
export class TasksModule { }

