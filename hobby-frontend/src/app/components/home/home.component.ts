import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <!-- Hero Section -->
    <div class="bg-gradient-to-br from-primary-500 to-purple-600 text-white py-20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center">
          <h1 class="text-5xl md:text-6xl font-bold mb-6">
            Manage Your Hobbies
          </h1>
          <p class="text-xl md:text-2xl mb-10 max-w-3xl mx-auto opacity-90 leading-relaxed">
            Track your hobbies, set goals, and connect with like-minded people.
            Start your journey today!
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <a routerLink="/login" 
               class="inline-flex items-center justify-center px-8 py-4 border border-transparent text-lg font-medium rounded-lg text-primary-600 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white transition-all duration-300 shadow-lg">
              Get Started
            </a>
            <a routerLink="/app/dashboard" 
               class="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-lg font-medium rounded-lg text-white hover:bg-white hover:text-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white transition-all duration-300">
              Dashboard
            </a>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Features Section -->
    <div class="py-20 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Why Choose Hobby Manager?
          </h2>
          <p class="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover the features that make hobby management effortless and enjoyable
          </p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <!-- Feature 1 -->
          <div class="text-center p-8 bg-gray-50 rounded-2xl hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
            <div class="text-6xl mb-6">🎯</div>
            <h3 class="text-2xl font-bold text-gray-900 mb-4">Track Progress</h3>
            <p class="text-gray-600 leading-relaxed">
              Set goals and track your progress in your favorite hobbies with detailed analytics and insights.
            </p>
          </div>
          
          <!-- Feature 2 -->
          <div class="text-center p-8 bg-gray-50 rounded-2xl hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
            <div class="text-6xl mb-6">👥</div>
            <h3 class="text-2xl font-bold text-gray-900 mb-4">Connect</h3>
            <p class="text-gray-600 leading-relaxed">
              Find and connect with people who share your interests and build meaningful relationships.
            </p>
          </div>
          
          <!-- Feature 3 -->
          <div class="text-center p-8 bg-gray-50 rounded-2xl hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
            <div class="text-6xl mb-6">📊</div>
            <h3 class="text-2xl font-bold text-gray-900 mb-4">Analytics</h3>
            <p class="text-gray-600 leading-relaxed">
              Get insights into your hobby activities and achievements with comprehensive reporting.
            </p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class HomeComponent {}

