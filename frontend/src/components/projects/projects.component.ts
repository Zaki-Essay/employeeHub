import { Component, ChangeDetectionStrategy, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../services/data.service';
import { Employee, Project, EmployeeRole } from '../../models';
import { NotificationService } from '../../services/notification.service';
import { RoleService } from '../../services/role.service';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './projects.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectsComponent {
  dataService = inject(DataService);
  notificationService = inject(NotificationService);
  roleService = inject(RoleService);
  projects = this.dataService.projects;
  allEmployees = this.dataService.employees;
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

  openForm(project: Project | null = null) {
    if (project) {
      this.editingProject.set(project);
      this.projectName.set(project.name);
      this.projectDescription.set(project.description);
      // Load current assignments for this project
      const currentAssignments = this.allEmployees()
        .flatMap(e => e.projectAssignments.filter(pa => pa.projectId === project.id).map(pa => ({ employeeId: e.id, role: pa.role })));
      this.projectAssignments.set(currentAssignments);

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
      const updatedProject = { 
        ...this.editingProject()!, 
        name: this.projectName(), 
        description: this.projectDescription() 
      };
      this.dataService.updateProject(updatedProject);
      this.dataService.updateProjectAssignments(updatedProject.id, this.projectAssignments());
      this.notificationService.show('Project updated successfully!', 'success');
    } else {
      // Add new project
      const newProject = this.dataService.addProject({
        name: this.projectName(),
        description: this.projectDescription()
      });
      // Assign members to the newly created project
      this.dataService.updateProjectAssignments(newProject.id, this.projectAssignments());
      this.notificationService.show('Project added successfully!', 'success');
    }
    this.closeForm();
  }
  
  deleteProject(project: Project) {
    if (confirm(`Are you sure you want to delete the project "${project.name}"? This action cannot be undone.`)) {
      this.dataService.deleteProject(project.id);
      this.notificationService.show('Project deleted successfully.', 'success');
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

  getEmployeesForProject(projectId: number): Employee[] {
    return this.dataService.getEmployeesForProject(projectId);
  }
  
  getProjectManager(projectId: number): Employee | undefined {
    return this.dataService.employees().find(e => 
      e.projectAssignments.some(pa => pa.projectId === projectId && pa.role === 'Project Manager')
    );
  }

  getDeveloperCount(projectId: number): number {
    return this.getEmployeesForProject(projectId)
      .filter(employee => 
        employee.projectAssignments.some(assignment => 
          assignment.projectId === projectId && assignment.role === 'Developer'
        )
      ).length;
  }

  getRoleForProject(employee: Employee, projectId: number): EmployeeRole {
    return employee.projectAssignments.find(pa => pa.projectId === projectId)?.role || employee.role;
  }
}