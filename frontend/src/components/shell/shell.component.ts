import {Component, ChangeDetectionStrategy, inject, signal} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { NotificationComponent } from '../notification/notification.component';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service';

type View = 'dashboard' | 'employees' | 'projects' | 'rewards' | 'profile';

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
          <div class="flex items-center space-x-4">
            @if (currentUser(); as user) {
              <button (click)="changeView('profile')" class="flex items-center space-x-3 p-1 rounded-full hover:bg-foreground/5 dark:hover:bg-white/5 transition-colors">
                <img [src]="user.avatarUrl" alt="User Avatar" class="w-8 h-8 rounded-full">
                <div class="text-left hidden sm:block">
                  <p class="font-semibold text-sm mr-2 text-foreground dark:text-white">{{ user.name }}</p>
                </div>
              </button>
            }
            <button (click)="authService.logout()" class="px-3 py-1 text-sm text-red-600 hover:text-red-700 border border-red-300 rounded-md hover:bg-red-50 transition-colors">
              Logout
            </button>
          </div>
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
  currentUser = this.authService.currentUser;
  activeView = signal<View>('dashboard');
  notificationService = inject(NotificationService);
  router = inject(Router);
  
  changeView(view: View) {
    this.activeView.set(view);
    this.router.navigate([`/${view}`]);
  }
}
