import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './components/navbar/navbar.component';
import { NzIconService } from 'ng-zorro-antd/icon';
import { 
  DashboardOutline, 
  CalendarOutline, 
  CheckSquareOutline, 
  BellOutline, 
  SettingOutline,
  PlusOutline,
  UserOutline,
  DownOutline,
  LogoutOutline,
  CheckCircleOutline,
  UnorderedListOutline,
  FormOutline,
  UploadOutline
} from '@ant-design/icons-angular/icons';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, NavbarComponent],
  template: `
    <router-outlet></router-outlet>
  `,
  styles: [`
    :host {
      display: block;
      min-height: 100vh;
    }
  `]
})
export class AppComponent implements OnInit {
  title = 'Hobby Management System';

  constructor(private iconService: NzIconService) {}

  ngOnInit() {
    this.iconService.addIcon(
      DashboardOutline,
      CalendarOutline,
      CheckSquareOutline,
      BellOutline,
      SettingOutline,
      PlusOutline,
      UserOutline,
      DownOutline,
      LogoutOutline,
      CheckCircleOutline,
      UnorderedListOutline,
      FormOutline,
      UploadOutline
    );
  }
}

