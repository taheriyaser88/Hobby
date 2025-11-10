import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LandingComponent } from './components/landing/landing.component';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { DocsComponent } from './components/docs/docs.component';
import { DocsInteractiveComponent } from './components/docs-interactive/docs-interactive.component';
import { NavbarComponent } from './components/shared/navbar/navbar.component';
import { MainLayoutComponent } from './components/shared/main-layout/main-layout.component';
import { TaskCardComponent } from './components/shared/task-card/task-card.component';
import { FormsModule } from '@angular/forms';
import { SharedModule } from './shared/shared.module';
import { UserService } from './users/services/user.service';

@NgModule({
  declarations: [
    AppComponent,
    LandingComponent,
    LoginComponent,
    DashboardComponent,
    DocsComponent,
    DocsInteractiveComponent,
    NavbarComponent,
    MainLayoutComponent,
    TaskCardComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    SharedModule
  ],
  providers: [UserService],
  bootstrap: [AppComponent]
})
export class AppModule { }

