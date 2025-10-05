import { Component, ChangeDetectionStrategy, inject, output, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService } from '../../services/data.service';
import { ApiService } from '../../services/api.service';
import { Employee, UserDTO } from '../../models';
import { RecognitionFeedComponent } from '../recognition-feed/recognition-feed.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RecognitionFeedComponent],
  templateUrl: './dashboard.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent implements OnInit {
  dataService = inject(DataService);
  apiService = inject(ApiService);
  leaderboard = this.apiService.kudosLeaderboard;
  projects = this.apiService.projects;
  sendKudos = output<Employee>();

  topThreeLeaderboard = computed(() => this.leaderboard().slice(0, 3));
  otherLeaders = computed(() => this.leaderboard().slice(3));

  ngOnInit() {
    // Load data from API
    this.apiService.getKudosLeaderboard().subscribe();
  }

  onSendKudos(employee: Employee) {
    this.sendKudos.emit(employee);
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
