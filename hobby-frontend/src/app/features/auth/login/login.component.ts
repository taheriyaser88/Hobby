import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  standalone: true,
  selector: 'app-login',
  imports: [CommonModule, NzButtonModule, NzCardModule, NzIconModule, NzTypographyModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  readonly loading = signal(false);

  constructor(private readonly authService: AuthService) {}

  onGoogleLogin(): void {
    this.loading.set(true);
    this.authService.startGoogleLogin(window.location.origin);
  }
}


