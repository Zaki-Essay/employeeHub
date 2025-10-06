import { Component, ChangeDetectionStrategy, inject, output, computed, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService } from '../../services/data.service';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { Employee, UserDTO } from '../../models';
import { RecognitionFeedComponent } from '../recognition-feed/recognition-feed.component';
import { KudosModalComponent } from '../kudos-modal/kudos-modal.component';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RecognitionFeedComponent, KudosModalComponent],
  templateUrl: './dashboard.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent implements OnInit {
  dataService = inject(DataService);
  apiService = inject(ApiService);
  authService = inject(AuthService);
  leaderboard = this.apiService.kudosLeaderboard;
  projects = this.apiService.projects;
  sendKudos = output();

  topThreeLeaderboard = computed(() => this.leaderboard().slice(0, 3));
  otherLeaders = computed(() => this.leaderboard().slice(3));

  showKudosModal = signal(false);
  selectedEmployee = signal<UserDTO | null>(null);

  // Computed signal to get current user from auth service
  currentUser = computed(() => {
    const authResponse = this.authService.currentUser();
    if (!authResponse) return null;

    // Find the full user data from employees list
    return this.apiService.employees().find(e => e.id === authResponse.id) || null;
  });

  ngOnInit() {
    // Load all data from API
    this.refreshData();
  }

  // Helper method to refresh all dashboard data
  private refreshData() {
    forkJoin({
      users: this.apiService.getAllUsers(),
      projects: this.apiService.getAllProjects(),
      leaderboard: this.apiService.getKudosLeaderboard()
    }).subscribe({
      error: (error) => console.error('Failed to load dashboard data:', error)
    });
  }

  // Fix: Accept UserDTO instead of Employee
  onSendKudos(employee: UserDTO) {
    this.selectedEmployee.set(employee);
    this.showKudosModal.set(true);
  }

  onCloseModal() {
    this.showKudosModal.set(false);
    this.selectedEmployee.set(null);
  }

  // Fix: Update parameter type to UserDTO
  onSendKudosConfirmed(data: { to: UserDTO, amount: number, message: string }) {
    this.apiService.sendKudos({
      receiverId: data.to.id,
      amount: data.amount,
      message: data.message
    }).subscribe({
      next: () => {
        this.onCloseModal();
        // Refresh all data including leaderboard and user list
        this.refreshData();
      },
      error: (error) => {
        console.error('Failed to send kudos:', error);
        this.onCloseModal();
      }
    });
  }

  getProjectManager(projectId: number): UserDTO | undefined {
    return this.apiService.employees().find(e =>
        e.role === 'Project Manager' // Simplified for now - would need project assignments in backend
    );
  }

  getDeveloperCount(projectId: number): number {
    return this.apiService.employees().filter(e => e.role === 'Developer').length;
  }
}