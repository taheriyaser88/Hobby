import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dashboard-container">
      <div class="container">
        <div class="dashboard-header">
          <h1>Welcome back, {{ currentUser?.firstName }}!</h1>
          <p>Manage your hobbies and track your progress</p>
        </div>
        
        <div class="dashboard-content">
          <div class="stats-grid">
            <div class="stat-card">
              <div class="stat-icon">🎯</div>
              <div class="stat-content">
                <h3>Active Hobbies</h3>
                <p class="stat-number">0</p>
              </div>
            </div>
            
            <div class="stat-card">
              <div class="stat-icon">📈</div>
              <div class="stat-content">
                <h3>Progress This Month</h3>
                <p class="stat-number">0%</p>
              </div>
            </div>
            
            <div class="stat-card">
              <div class="stat-icon">🏆</div>
              <div class="stat-content">
                <h3>Achievements</h3>
                <p class="stat-number">0</p>
              </div>
            </div>
          </div>
          
          <div class="dashboard-sections">
            <div class="section-card">
              <h2>My Hobbies</h2>
              <div class="empty-state">
                <div class="empty-icon">🎨</div>
                <h3>No hobbies yet</h3>
                <p>Start by adding your first hobby!</p>
                <button class="btn btn-primary">Add Hobby</button>
              </div>
            </div>
            
            <div class="section-card">
              <h2>Recent Activity</h2>
              <div class="empty-state">
                <div class="empty-icon">📝</div>
                <h3>No recent activity</h3>
                <p>Your activity will appear here</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      padding: 40px 0;
    }
    
    .dashboard-header {
      text-align: center;
      margin-bottom: 40px;
    }
    
    .dashboard-header h1 {
      font-size: 2.5rem;
      color: #333;
      margin-bottom: 16px;
    }
    
    .dashboard-header p {
      font-size: 1.2rem;
      color: #666;
    }
    
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 24px;
      margin-bottom: 40px;
    }
    
    .stat-card {
      background: white;
      border-radius: 12px;
      padding: 24px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      display: flex;
      align-items: center;
      gap: 16px;
    }
    
    .stat-icon {
      font-size: 2.5rem;
    }
    
    .stat-content h3 {
      font-size: 1rem;
      color: #666;
      margin-bottom: 8px;
    }
    
    .stat-number {
      font-size: 2rem;
      font-weight: bold;
      color: #1976d2;
      margin: 0;
    }
    
    .dashboard-sections {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
      gap: 24px;
    }
    
    .section-card {
      background: white;
      border-radius: 12px;
      padding: 24px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }
    
    .section-card h2 {
      font-size: 1.5rem;
      color: #333;
      margin-bottom: 20px;
    }
    
    .empty-state {
      text-align: center;
      padding: 40px 20px;
    }
    
    .empty-icon {
      font-size: 3rem;
      margin-bottom: 16px;
    }
    
    .empty-state h3 {
      font-size: 1.2rem;
      color: #333;
      margin-bottom: 8px;
    }
    
    .empty-state p {
      color: #666;
      margin-bottom: 20px;
    }
  `]
})
export class DashboardComponent implements OnInit {
  currentUser: User | null = null;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
  }
}

