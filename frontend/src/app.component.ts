import { Component, ChangeDetectionStrategy, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService } from './services/data.service';
import { NotificationService } from './services/notification.service';
import { ThemeService } from './services/theme.service';
import { Employee, Project, Reward } from './models';

import { DashboardComponent } from './components/dashboard/dashboard.component';
import { EmployeesComponent } from './components/employees/employees.component';
import { ProjectsComponent } from './components/projects/projects.component';
import { RewardsComponent } from './components/rewards/rewards.component';
import { ProfileComponent } from './components/profile/profile.component';
import { KudosModalComponent } from './components/kudos-modal/kudos-modal.component';
import { NotificationComponent } from './components/notification/notification.component';
import { ConfettiComponent } from './components/confetti/confetti.component';

type View = 'dashboard' | 'employees' | 'projects' | 'rewards' | 'profile';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    CommonModule,
    DashboardComponent,
    EmployeesComponent,
    ProjectsComponent,
    RewardsComponent,
    ProfileComponent,
    KudosModalComponent,
    NotificationComponent,
    ConfettiComponent,
  ],
})
export class AppComponent {
  dataService = inject(DataService);
  notificationService = inject(NotificationService);
  themeService = inject(ThemeService); // Initialize theme service

  currentUser = this.dataService.currentUser;
  notifications = this.notificationService.notifications;
  
  activeView = signal<View>('dashboard');

  kudosTargetEmployee = signal<Employee | null>(null);
  
  kudosBalanceUpdated = signal(false);
  kudosPointsUpdated = signal(false);
  showConfetti = signal(false);


  changeView(view: View) {
    this.activeView.set(view);
  }

  openKudosModal(employee: Employee) {
    this.kudosTargetEmployee.set(employee);
  }

  closeKudosModal() {
    this.kudosTargetEmployee.set(null);
  }

  handleSendKudos(event: { to: Employee, amount: number, message: string }) {
    const result = this.dataService.sendKudos(event.to.id, event.amount, event.message);
    if (result.success) {
      this.notificationService.show(result.message, 'success');
      this.closeKudosModal();
      this.triggerBalanceAnimation();
      if (event.amount >= 50) { // Significant amount for confetti
        this.triggerConfetti();
      }
    } else {
      this.notificationService.show(result.message, 'error');
    }
  }

  handleRedeemReward(reward: Reward) {
    const result = this.dataService.redeemReward(reward.id);
     if (result.success) {
      this.notificationService.show(result.message, 'success');
      this.triggerPointsAnimation();
    } else {
      this.notificationService.show(result.message, 'error');
    }
  }

  triggerBalanceAnimation() {
    this.kudosBalanceUpdated.set(true);
    setTimeout(() => this.kudosBalanceUpdated.set(false), 500);
  }

  triggerPointsAnimation() {
    this.kudosPointsUpdated.set(true);
    setTimeout(() => this.kudosPointsUpdated.set(false), 500);
  }
  
  triggerConfetti() {
    this.showConfetti.set(true);
    setTimeout(() => this.showConfetti.set(false), 3000); // Corresponds to animation duration
  }
}