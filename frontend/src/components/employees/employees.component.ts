import { Component, ChangeDetectionStrategy, inject, signal, computed, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../services/data.service';
import { BadgeService } from '../../services/badge.service';
import { RoleService } from '../../services/role.service';
import { NotificationService } from '../../services/notification.service';
import { Employee, EmployeeRole, Badge, ProjectAssignment } from '../../models';

@Component({
  selector: 'app-employees',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './employees.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmployeesComponent {
  dataService = inject(DataService);
  badgeService = inject(BadgeService);
  roleService = inject(RoleService);
  notificationService = inject(NotificationService);
  sendKudos = output<Employee>();

  searchTerm = signal('');
  selectedRole = signal<EmployeeRole | 'All'>('All');

  editingAssignmentsFor = signal<Employee | null>(null);
  selectedProjectId = signal<number | null>(null);
  selectedProjectRole = signal<EmployeeRole>('Developer');

  roles = computed(() => ['All', ...this.roleService.roles()]);
  projects = this.dataService.projects;

  filteredEmployees = computed(() => {
    const term = this.searchTerm().toLowerCase();
    const role = this.selectedRole();
    const allEmployees = this.dataService.employees();

    return allEmployees.filter(employee => {
      const nameMatch = employee.name.toLowerCase().includes(term);
      const idMatch = employee.id.toString().includes(term);
      const roleMatch = role === 'All' || employee.role === role;
      return (nameMatch || idMatch) && roleMatch;
    });
  });
  
  availableProjects = computed(() => {
    const employee = this.editingAssignmentsFor();
    if (!employee) return [];
    const assignedProjectIds = new Set(employee.projectAssignments.map(pa => pa.projectId));
    return this.projects().filter(p => !assignedProjectIds.has(p.id));
  });

  getEmployeeBadges(employee: Employee): Badge[] {
      return this.badgeService.getBadgesForEmployee(employee, this.dataService.employees());
  }

  onSendKudos(employee: Employee) {
    this.sendKudos.emit(employee);
  }

  openAssignmentModal(employee: Employee) {
    this.editingAssignmentsFor.set(employee);
    this.selectedProjectId.set(null);
    this.selectedProjectRole.set(this.roleService.roles()[0] || 'Developer');
  }

  closeAssignmentModal() {
    this.editingAssignmentsFor.set(null);
  }

  addAssignment() {
    const employee = this.editingAssignmentsFor();
    const projectId = this.selectedProjectId();
    const role = this.selectedProjectRole();
    
    if (employee && projectId && role) {
      this.dataService.assignEmployeeToProject(employee.id, projectId, role);
      this.notificationService.show(`${employee.name} assigned to project.`, 'success');
      this.selectedProjectId.set(null); // Reset for next assignment
    } else {
        this.notificationService.show('Please select a project and role.', 'error');
    }
  }

  removeAssignment(employeeId: number, assignment: ProjectAssignment) {
    const projectName = this.getProjectName(assignment.projectId);
    this.dataService.unassignEmployeeFromProject(employeeId, assignment.projectId);
    this.notificationService.show(`Assignment to ${projectName} removed.`, 'success');
  }

  getProjectName(projectId: number): string {
    return this.projects().find(p => p.id === projectId)?.name || 'Unknown Project';
  }
}