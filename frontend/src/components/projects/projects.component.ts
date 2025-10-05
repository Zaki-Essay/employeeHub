import { Component, ChangeDetectionStrategy, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../services/data.service';
import { ApiService } from '../../services/api.service';
import { Employee, Project, EmployeeRole, UserDTO } from '../../models';
import { NotificationService } from '../../services/notification.service';
import { RoleService } from '../../services/role.service';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './projects.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectsComponent implements OnInit {
  dataService = inject(DataService);
  apiService = inject(ApiService);
  notificationService = inject(NotificationService);
  roleService = inject(RoleService);
  projects = this.apiService.projects;
  allEmployees = this.apiService.employees;
  roles = this.roleService.roles;

  showForm = signal(false);
  editingProject = signal<Project | null>(null);
  
  // Form state
  projectName = signal('');
  projectDescription = signal('');
  projectAssignments = signal<{ employeeId: number; role: EmployeeRole }[]>([]);
  
  // New assignment form state
  newAssignmentEmployeeId = signal<number | null>(null);
  newAssignmentRole = signal<EmployeeRole>('Developer');

  assignedEmployees = computed(() => {
    const assignments = this.projectAssignments();
    const employees = this.allEmployees();
    return assignments
      .map(assignment => {
        const employee = employees.find(e => e.id === assignment.employeeId);
        return employee ? { ...employee, assignedRole: assignment.role } : null;
      })
      .filter(e => e !== null);
  });

  unassignedEmployees = computed(() => {
    const assignedIds = new Set(this.projectAssignments().map(a => a.employeeId));
    return this.allEmployees().filter(e => !assignedIds.has(e.id));
  });

  ngOnInit() {
    // Load data from API
    this.apiService.getAllProjects().subscribe();
    this.apiService.getAllUsers().subscribe();
  }

  openForm(project: Project | null = null) {
    if (project) {
      this.editingProject.set(project);
      this.projectName.set(project.name);
      this.projectDescription.set(project.description);
      // For now, start with empty assignments since UserDTO doesn't have projectAssignments
      this.projectAssignments.set([]);

    } else {
      this.editingProject.set(null);
      this.projectName.set('');
      this.projectDescription.set('');
      this.projectAssignments.set([]);
    }
    this.resetNewAssignmentForm();
    this.showForm.set(true);
  }

  closeForm() {
    this.showForm.set(false);
  }

  saveProject() {
    if (!this.projectName()) {
      this.notificationService.show('Project name is required.', 'error');
      return;
    }

    if (this.editingProject()) {
      // Update existing project
      this.apiService.updateProject(this.editingProject()!.id, {
        name: this.projectName(),
        description: this.projectDescription()
      }).subscribe({
        next: () => {
          this.notificationService.show('Project updated successfully!', 'success');
          this.closeForm();
        },
        error: (error) => {
          this.notificationService.show(error.message || 'Failed to update project', 'error');
        }
      });
    } else {
      // Add new project
      this.apiService.createProject({
        name: this.projectName(),
        description: this.projectDescription()
      }).subscribe({
        next: () => {
          this.notificationService.show('Project added successfully!', 'success');
          this.closeForm();
        },
        error: (error) => {
          this.notificationService.show(error.message || 'Failed to create project', 'error');
        }
      });
    }
  }
  
  deleteProject(project: Project) {
    if (confirm(`Are you sure you want to delete the project "${project.name}"? This action cannot be undone.`)) {
      this.apiService.deleteProject(project.id).subscribe({
        next: () => {
          this.notificationService.show('Project deleted successfully.', 'success');
        },
        error: (error) => {
          this.notificationService.show(error.message || 'Failed to delete project', 'error');
        }
      });
    }
  }

  addAssignmentToProject() {
    const employeeId = this.newAssignmentEmployeeId();
    const role = this.newAssignmentRole();
    if (employeeId && role) {
      this.projectAssignments.update(assignments => [...assignments, { employeeId, role }]);
      this.resetNewAssignmentForm();
    }
  }

  removeAssignmentFromProject(employeeId: number) {
    this.projectAssignments.update(assignments => assignments.filter(a => a.employeeId !== employeeId));
  }

  updateAssignmentRole(employeeId: number, event: Event) {
    const newRole = (event.target as HTMLSelectElement).value as EmployeeRole;
    this.projectAssignments.update(assignments => 
      assignments.map(a => a.employeeId === employeeId ? { ...a, role: newRole } : a)
    );
  }

  resetNewAssignmentForm() {
    this.newAssignmentEmployeeId.set(null);
    this.newAssignmentRole.set(this.roles()[0] || 'Developer');
  }

  getEmployeesForProject(projectId: number): UserDTO[] {
    // For now, return all employees since we don't have project assignments in the backend yet
    return this.allEmployees();
  }
  
  getProjectManager(projectId: number): UserDTO | undefined {
    // For now, return the first employee with Project Manager role
    return this.allEmployees().find(e => e.role === 'Project Manager');
  }

  getDeveloperCount(projectId: number): number {
    // For now, return count of all developers
    return this.allEmployees().filter(e => e.role === 'Developer').length;
  }

  getRoleForProject(employee: UserDTO, projectId: number): EmployeeRole {
    // For now, return the employee's main role
    return employee.role as EmployeeRole;
  }
}