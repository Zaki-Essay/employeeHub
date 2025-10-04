import { Component, ChangeDetectionStrategy, inject, output, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService } from '../../services/data.service';
import { Employee } from '../../models';
import { RecognitionFeedComponent } from '../recognition-feed/recognition-feed.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RecognitionFeedComponent],
  templateUrl: './dashboard.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent {
  dataService = inject(DataService);
  leaderboard = this.dataService.getKudosLeaderboard;
  projects = this.dataService.projects;
  sendKudos = output<Employee>();

  topThreeLeaderboard = computed(() => this.leaderboard().slice(0, 3));
  otherLeaders = computed(() => this.leaderboard().slice(3));

  onSendKudos(employee: Employee) {
    this.sendKudos.emit(employee);
  }

  getProjectManager(projectId: number): Employee | undefined {
    return this.dataService.employees().find(e => 
      e.projectAssignments.some(pa => pa.projectId === projectId && pa.role === 'Project Manager')
    );
  }

  getDeveloperCount(projectId: number): number {
     return this.dataService.getEmployeesForProject(projectId).filter(e => e.role === 'Developer').length;
  }
}
