import { Component, ChangeDetectionStrategy, inject, signal, computed, output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../services/data.service';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { BadgeService } from '../../services/badge.service';
import { RoleService } from '../../services/role.service';
import { NotificationService } from '../../services/notification.service';
import { Employee, EmployeeRole, Badge, ProjectAssignment, UserDTO } from '../../models';
import { KudosModalComponent } from '../kudos-modal/kudos-modal.component';

@Component({
  selector: 'app-employees',
  standalone: true,
  imports: [CommonModule, FormsModule, KudosModalComponent],
  templateUrl: './employees.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmployeesComponent implements OnInit {
  dataService = inject(DataService);
  apiService = inject(ApiService);
  authService = inject(AuthService);
  badgeService = inject(BadgeService);
  roleService = inject(RoleService);
  notificationService = inject(NotificationService);
  sendKudos = output<Employee>();

  searchTerm = signal('');
  selectedRole = signal<EmployeeRole | 'All'>('All');

  editingAssignmentsFor = signal<Employee | null>(null);
  selectedProjectId = signal<number | null>(null);
  selectedProjectRole = signal<EmployeeRole>('Developer');

  showKudosModal = signal(false);
  selectedEmployee = signal<Employee | null>(null);

  roles = computed(() => ['All', ...this.roleService.roles()]);
  projects = this.apiService.projects;

  filteredEmployees = computed(() => {
    const term = this.searchTerm().toLowerCase();
    const role = this.selectedRole();
    const allEmployees = this.apiService.employees();

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
    // For now, return all projects since we don't have project assignments in the backend yet
    return this.projects();
  });

  ngOnInit() {
    // Load data from API
    this.apiService.getAllUsers().subscribe();
    this.apiService.getAllProjects().subscribe();
  }

  getEmployeeBadges(employee: UserDTO): Badge[] {
      // Convert UserDTO to Employee for badge service compatibility
      const employeeForBadges: Employee = {
        id: employee.id,
        name: employee.name,
        role: employee.role as EmployeeRole,
        avatarUrl: employee.avatarUrl,
        kudosReceived: employee.kudosReceived,
        kudosBalance: employee.kudosBalance,
        kudosSent: 0, // Default value since UserDTO doesn't have this
        projectAssignments: [] // Default empty array since UserDTO doesn't have this
      };
      return this.badgeService.getBadgesForEmployee(employeeForBadges, this.apiService.employees().map(u => ({
        id: u.id,
        name: u.name,
        role: u.role as EmployeeRole,
        avatarUrl: u.avatarUrl,
        kudosReceived: u.kudosReceived,
        kudosBalance: u.kudosBalance,
        kudosSent: 0,
        projectAssignments: []
      })));
  }

  onSendKudos(employee: UserDTO) {
    // Convert UserDTO to Employee for the modal
    const employeeForKudos: Employee = {
      id: employee.id,
      name: employee.name,
      role: employee.role as EmployeeRole,
      avatarUrl: employee.avatarUrl,
      kudosReceived: employee.kudosReceived,
      kudosBalance: employee.kudosBalance,
      kudosSent: 0, // Default value
      projectAssignments: [] // Default empty array
    };
    this.selectedEmployee.set(employeeForKudos);
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
        // Refresh employee list
        this.apiService.getAllUsers().subscribe();
      },
      error: (error) => {
        console.error('Failed to send kudos:', error);
        this.onCloseModal();
      }
    });
  }

  openAssignmentModal(employee: UserDTO) {
    // Convert UserDTO to Employee for the modal
    const employeeForModal: Employee = {
      id: employee.id,
      name: employee.name,
      role: employee.role as EmployeeRole,
      avatarUrl: employee.avatarUrl,
      kudosReceived: employee.kudosReceived,
      kudosBalance: employee.kudosBalance,
      kudosSent: 0, // Default value
      projectAssignments: [] // Default empty array
    };
    this.editingAssignmentsFor.set(employeeForModal);
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