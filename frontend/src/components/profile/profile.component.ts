import { Component, ChangeDetectionStrategy, inject, computed, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../services/data.service';
import { BadgeService } from '../../services/badge.service';
import { ThemeService } from '../../services/theme.service';
import { RoleService } from '../../services/role.service';
import { NotificationService } from '../../services/notification.service';
import { Project, EmployeeRole, Employee } from '../../models';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileComponent {
  dataService = inject(DataService);
  badgeService = inject(BadgeService);
  themeService = inject(ThemeService);
  roleService = inject(RoleService);
  notificationService = inject(NotificationService);

  currentUser = this.dataService.currentUser;
  
  // Settings
  teamNotifications = signal(false);
  private teamNotificationStorageKey = 'employeehub_team_notifications';

  // Role management
  newRoleName = signal('');
  employeesToManage = computed(() => this.dataService.employees().filter(e => e.id !== this.currentUser()?.id));

  constructor() {
    this.loadSettings();
    effect(() => {
      this.saveTeamNotifications(this.teamNotifications());
    });
  }

  isDarkMode = computed(() => this.themeService.theme() === 'dark');
  
  toggleTheme() {
    this.themeService.toggleTheme();
  }

  toggleTeamNotifications() {
    this.teamNotifications.update(enabled => !enabled);
  }

  private loadSettings() {
    if (typeof localStorage !== 'undefined') {
      const storedValue = localStorage.getItem(this.teamNotificationStorageKey);
      this.teamNotifications.set(storedValue === 'true');
    }
  }

  private saveTeamNotifications(enabled: boolean) {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(this.teamNotificationStorageKey, String(enabled));
    }
  }

  addRole() {
    const roleName = this.newRoleName().trim();
    if (roleName) {
      if (this.roleService.roles().some(r => r.toLowerCase() === roleName.toLowerCase())) {
        this.notificationService.show(`Role "${roleName}" already exists.`, 'error');
      } else {
        this.roleService.addRole(roleName);
        this.notificationService.show(`Role "${roleName}" added successfully.`, 'success');
        this.newRoleName.set('');
      }
    }
  }

  deleteRole(role: EmployeeRole) {
    if (this.dataService.isRoleInUse(role)) {
       this.notificationService.show(`Cannot delete role "${role}" as it is currently assigned to one or more employees.`, 'error');
       return;
    }
    if (confirm(`Are you sure you want to delete the role "${role}"?`)) {
        this.roleService.deleteRole(role);
        this.notificationService.show(`Role "${role}" deleted.`, 'success');
    }
  }

  isRoleInUse(role: EmployeeRole): boolean {
    return this.dataService.isRoleInUse(role);
  }

  onUserRoleChange(employee: Employee, event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const newRole = selectElement.value;
    this.dataService.updateEmployeeRole(employee.id, newRole);
    this.notificationService.show(`${employee.name}'s role has been updated to ${newRole}.`, 'success');
  }

  userBadges = computed(() => {
    const user = this.currentUser();
    if (!user) return [];
    return this.badgeService.getBadgesForEmployee(user, this.dataService.employees());
  });

  assignedProjects = computed(() => {
    const user = this.currentUser();
    if (!user) return [];
    return user.projectAssignments.map(pa => this.dataService.getProjectById(pa.projectId)).filter(p => p !== undefined) as Project[];
  });
}