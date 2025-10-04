import { Injectable, signal, effect, inject } from '@angular/core';
import { DataService } from './data.service';
import { EmployeeRole } from '../models';

const DEFAULT_ROLES: EmployeeRole[] = ['Developer', 'Business Analyst', 'Project Manager'];

@Injectable({ providedIn: 'root' })
export class RoleService {
    private storageKey = 'employeehub_roles';
    roles = signal<EmployeeRole[]>([]);

    constructor() {
        this.loadRolesFromStorage();
        effect(() => {
            this.saveRolesToStorage(this.roles());
        });
    }

    private loadRolesFromStorage() {
        if (typeof localStorage !== 'undefined') {
            const storedRoles = localStorage.getItem(this.storageKey);
            if (storedRoles) {
                const parsedRoles = JSON.parse(storedRoles) as EmployeeRole[];
                // Ensure default roles are always present
                const allRoles = [...new Set([...DEFAULT_ROLES, ...parsedRoles])];
                this.roles.set(allRoles);
            } else {
                this.roles.set(DEFAULT_ROLES);
            }
        } else {
            this.roles.set(DEFAULT_ROLES);
        }
    }

    private saveRolesToStorage(roles: EmployeeRole[]) {
        if (typeof localStorage !== 'undefined') {
            localStorage.setItem(this.storageKey, JSON.stringify(roles));
        }
    }

    isDefaultRole(role: EmployeeRole): boolean {
        return DEFAULT_ROLES.includes(role);
    }
    
    addRole(role: EmployeeRole) {
        if (role && !this.roles().find(r => r.toLowerCase() === role.toLowerCase())) {
            this.roles.update(current => [...current, role]);
        }
    }

    updateRole(oldRole: EmployeeRole, newRole: EmployeeRole) {
        if (this.isDefaultRole(oldRole) || !newRole || this.roles().includes(newRole)) {
            return; // Cannot update default roles or to an existing role name
        }
        this.roles.update(roles => roles.map(r => (r === oldRole ? newRole : r)));
        // Note: This does not update the roles assigned to employees. A more complex implementation would do so.
    }

    deleteRole(roleToDelete: EmployeeRole) {
        if (this.isDefaultRole(roleToDelete)) {
            return; // Cannot delete default roles
        }
        this.roles.update(roles => roles.filter(r => r !== roleToDelete));
    }
}