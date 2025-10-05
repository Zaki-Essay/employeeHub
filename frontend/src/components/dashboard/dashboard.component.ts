import { Component, ChangeDetectionStrategy, inject, output, computed, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService } from '../../services/data.service';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { Employee, UserDTO } from '../../models';
import { RecognitionFeedComponent } from '../recognition-feed/recognition-feed.component';
import { KudosModalComponent } from '../kudos-modal/kudos-modal.component';

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
  sendKudos = output<Employee>();

  topThreeLeaderboard = computed(() => this.leaderboard().slice(0, 3));
  otherLeaders = computed(() => this.leaderboard().slice(3));

  showKudosModal = signal(false);
  selectedEmployee = signal<Employee | null>(null);

  ngOnInit() {
    // Load data from API
    this.apiService.getAllUsers().subscribe();
    this.apiService.getAllProjects().subscribe();
  }

  onSendKudos(employee: Employee) {
    this.selectedEmployee.set(employee);
    this.showKudosModal.set(true);
  }

  onCloseModal() {
    this.showKudosModal.set(false);
    this.selectedEmployee.set(null);
  }

  onSendKudosConfirmed(data: { to: Employee, amount: number, message: string }) {
    this.apiService.sendKudos({
      receiverId: data.to.id,
      amount: data.amount,
      message: data.message
    }).subscribe({
      next: () => {
        this.onCloseModal();
        // Refresh leaderboard
        this.apiService.getKudosLeaderboard().subscribe();
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
