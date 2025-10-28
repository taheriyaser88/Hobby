import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzBadgeModule } from 'ng-zorro-antd/badge';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    NzLayoutModule,
    NzMenuModule,
    NzIconModule,
    NzBreadCrumbModule,
    NzAvatarModule,
    NzDropDownModule,
    NzButtonModule,
    NzBadgeModule
  ],
  template: `
    <nz-layout class="layout">
      <!-- Sidebar -->
      <nz-sider 
        nzCollapsible 
        [(nzCollapsed)]="isCollapsed"
        [nzWidth]="256"
        [nzCollapsedWidth]="80"
        class="sidebar">
        <div class="logo">
          <h2 *ngIf="!isCollapsed" class="logo-text">Hobby</h2>
          <h2 *ngIf="isCollapsed" class="logo-text-collapsed">H</h2>
        </div>
        
        <ul nz-menu nzTheme="dark" nzMode="inline" class="sidebar-menu">
          <li nz-menu-item routerLink="/app/dashboard">
            <i nz-icon nzType="dashboard"></i>
            <span>Dashboard</span>
          </li>
          <li nz-menu-item routerLink="/app/events">
            <i nz-icon nzType="calendar"></i>
            <span>Events</span>
          </li>
          <li nz-menu-item routerLink="/app/tasks">
            <i nz-icon nzType="check-square"></i>
            <span>Tasks</span>
          </li>
          <li nz-menu-item routerLink="/app/notifications">
            <i nz-icon nzType="bell"></i>
            <span>Notifications</span>
            <nz-badge [nzCount]="5" [nzOffset]="[10, 0]"></nz-badge>
          </li>
          <li nz-menu-item routerLink="/app/settings">
            <i nz-icon nzType="setting"></i>
            <span>Settings</span>
          </li>
        </ul>
      </nz-sider>

      <!-- Main Content -->
      <nz-layout>
        <!-- Header -->
        <nz-header class="header">
          <div class="header-content">
            <div class="header-left">
              <nz-breadcrumb>
                <nz-breadcrumb-item>
                  <a routerLink="/app/dashboard">Dashboard</a>
                </nz-breadcrumb-item>
                <nz-breadcrumb-item *ngIf="currentPage">
                  {{ currentPage }}
                </nz-breadcrumb-item>
              </nz-breadcrumb>
            </div>
            
            <div class="header-right">
              <nz-badge [nzCount]="3" [nzOffset]="[10, 0]">
                <button nz-button nzType="text" nzSize="large">
                  <i nz-icon nzType="bell"></i>
                </button>
              </nz-badge>
              
              <div class="user-info">
                <nz-avatar nzIcon="user" nzSize="default"></nz-avatar>
                <span class="user-name">John Doe</span>
              </div>
            </div>
          </div>
        </nz-header>

        <!-- Content -->
        <nz-content class="content">
          <div class="content-wrapper">
            <router-outlet></router-outlet>
          </div>
        </nz-content>

        <!-- Footer -->
        <nz-footer class="footer">
          Hobby Management System ©2025 Created by Sina
        </nz-footer>
      </nz-layout>
    </nz-layout>
  `,
  styles: [`
    .layout {
      min-height: 100vh;
    }
    
    .sidebar {
      background: #001529;
      box-shadow: 2px 0 8px rgba(0, 0, 0, 0.15);
    }
    
    .logo {
      height: 64px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #002140;
      margin-bottom: 16px;
    }
    
    .logo-text {
      color: #fff;
      font-size: 20px;
      font-weight: bold;
      margin: 0;
    }
    
    .logo-text-collapsed {
      color: #fff;
      font-size: 24px;
      font-weight: bold;
      margin: 0;
    }
    
    .sidebar-menu {
      background: #001529;
    }
    
    .header {
      background: #fff;
      padding: 0 24px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
      display: flex;
      align-items: center;
    }
    
    .header-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
    }
    
    .header-right {
      display: flex;
      align-items: center;
      gap: 16px;
    }
    
    .user-name {
      margin-left: 8px;
      margin-right: 8px;
    }
    
    .content {
      margin: 24px;
      background: #fff;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    }
    
    .content-wrapper {
      padding: 24px;
    }
    
    .footer {
      background: #f0f2f5;
      padding: 24px 50px;
      text-align: center;
      color: #999;
    }
    
    /* Google-like colors */
    :host ::ng-deep .ant-menu-dark {
      background: #001529;
    }
    
    :host ::ng-deep .ant-menu-dark .ant-menu-item-selected {
      background-color: #4285F4 !important;
    }
    
    :host ::ng-deep .ant-menu-dark .ant-menu-item:hover {
      background-color: #4285F4 !important;
    }
    
    :host ::ng-deep .ant-breadcrumb a {
      color: #4285F4;
    }
    
    :host ::ng-deep .ant-breadcrumb a:hover {
      color: #1a73e8;
    }
  `]
})
export class LayoutComponent implements OnInit {
  isCollapsed = false;
  currentPage = '';

  ngOnInit() {
    // Initialize based on current route
  }
}