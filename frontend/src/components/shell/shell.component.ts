import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NotificationComponent } from '../notification/notification.component';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [CommonModule, RouterModule, NotificationComponent],
  template: `
    <div class="bg-background dark:bg-zinc-900 min-h-screen font-sans">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header class="flex justify-between items-center py-5 border-b border-border dark:border-zinc-800">
          <div class="flex items-center space-x-4">
            <img src="assets/images/logo.png" alt="EmployeeHub Logo" class="h-32 w-auto" />
          </div>
          <nav class="hidden md:flex items-center space-x-2">
            <a routerLink="/dashboard" class="px-3 py-2 rounded-lg text-sm font-medium transition-colors">Dashboard</a>
            <a routerLink="/employees" class="px-3 py-2 rounded-lg text-sm font-medium transition-colors">Employees</a>
            <a routerLink="/projects" class="px-3 py-2 rounded-lg text-sm font-medium transition-colors">Projects</a>
            <a routerLink="/rewards" class="px-3 py-2 rounded-lg text-sm font-medium transition-colors">Rewards</a>
          </nav>
          <button (click)="authService.logout()" class="px-3 py-1 text-sm text-red-600 hover:text-red-700 border border-red-300 rounded-md hover:bg-red-50 transition-colors">
            Logout
          </button>
        </header>

        <main class="py-8 md:py-12">
          <router-outlet />
        </main>
      </div>
    </div>

    <app-notification [notifications]="notificationService.notifications()" />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShellComponent {
  authService = inject(AuthService);
  notificationService = inject(NotificationService);
}
