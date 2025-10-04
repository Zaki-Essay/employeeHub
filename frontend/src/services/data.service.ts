import { Injectable, signal, computed, effect } from '@angular/core';
import { Employee, Project, Reward, KudoTransaction, EmployeeRole, ProjectAssignment } from '../models';

const MOCK_EMPLOYEES: Employee[] = [
  { id: 1, name: 'Alex Johnson', role: 'Project Manager', avatarUrl: 'https://i.pravatar.cc/150?u=1', kudosReceived: 125, kudosBalance: 50, kudosSent: 35, projectAssignments: [{ projectId: 1, role: 'Project Manager' }, { projectId: 2, role: 'Project Manager' }] },
  { id: 2, name: 'Maria Garcia', role: 'Developer', avatarUrl: 'https://i.pravatar.cc/150?u=2', kudosReceived: 210, kudosBalance: 50, kudosSent: 80, projectAssignments: [{ projectId: 1, role: 'Developer' }] },
  { id: 3, name: 'James Smith', role: 'Developer', avatarUrl: 'https://i.pravatar.cc/150?u=3', kudosReceived: 180, kudosBalance: 50, kudosSent: 120, projectAssignments: [{ projectId: 1, role: 'Developer' }, { projectId: 3, role: 'Developer' }] },
  { id: 4, name: 'Li Wei', role: 'Developer', avatarUrl: 'https://i.pravatar.cc/150?u=4', kudosReceived: 95, kudosBalance: 50, kudosSent: 40, projectAssignments: [{ projectId: 2, role: 'Developer' }] },
  { id: 5, name: 'Fatima Ahmed', role: 'Business Analyst', avatarUrl: 'https://i.pravatar.cc/150?u=5', kudosReceived: 150, kudosBalance: 50, kudosSent: 60, projectAssignments: [{ projectId: 2, role: 'Business Analyst' }, { projectId: 3, role: 'Business Analyst' }] },
  { id: 6, name: 'Chloe Dubois', role: 'Developer', avatarUrl: 'https://i.pravatar.cc/150?u=6', kudosReceived: 300, kudosBalance: 50, kudosSent: 95, projectAssignments: [{ projectId: 3, role: 'Developer' }] },
];

const MOCK_PROJECTS: Project[] = [
  { id: 1, name: 'Phoenix Initiative', description: 'Next-gen e-commerce platform migration.' },
  { id: 2, name: 'Project Titan', description: 'AI-driven analytics dashboard for enterprise clients.' },
  { id: 3, name: 'Odyssey Mobile App', description: 'Cross-platform mobile application for user engagement.' },
];

const MOCK_REWARDS: Reward[] = [
  { id: 1, name: 'Coffee Shop Voucher', description: '$10 voucher for your favorite coffee.', cost: 50, imageUrl: 'https://picsum.photos/seed/coffee/400/300' },
  { id: 2, name: 'Movie Tickets', description: 'Two tickets for a movie of your choice.', cost: 150, imageUrl: 'https://picsum.photos/seed/movie/400/300' },
  { id: 3, name: 'Company Swag Pack', description: 'T-shirt, mug, and stickers with company branding.', cost: 250, imageUrl: 'https://picsum.photos/seed/swag/400/300' },
  { id: 4, name: 'Online Course Subscription', description: '1-month subscription to a learning platform.', cost: 400, imageUrl: 'https://picsum.photos/seed/course/400/300' },
];

@Injectable({ providedIn: 'root' })
export class DataService {
  private employeeStorageKey = 'employeehub_employees';
  employees = signal<Employee[]>([]);
  projects = signal<Project[]>(MOCK_PROJECTS);
  rewards = signal<Reward[]>(MOCK_REWARDS);
  
  kudosFeed = signal<KudoTransaction[]>([]);
  private nextKudoId = 1;
  private nextProjectId = MOCK_PROJECTS.length + 1;

  constructor() {
    this.loadEmployeesFromStorage();
    this.generateMockFeed();

    // Effect to save employees to localStorage
    effect(() => {
      this.saveEmployeesToStorage(this.employees());
    });
  }

  // Let's assume the current user is Alex Johnson (ID 1)
  currentUser = computed(() => this.employees().find(e => e.id === 1)!);

  private loadEmployeesFromStorage() {
    if (typeof localStorage !== 'undefined') {
      const storedEmployees = localStorage.getItem(this.employeeStorageKey);
      if (storedEmployees) {
        this.employees.set(JSON.parse(storedEmployees));
      } else {
        this.employees.set(MOCK_EMPLOYEES);
      }
    } else {
      this.employees.set(MOCK_EMPLOYEES);
    }
  }

  private saveEmployeesToStorage(employees: Employee[]) {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(this.employeeStorageKey, JSON.stringify(employees));
    }
  }


  private generateMockFeed() {
      const feed: KudoTransaction[] = [
          { id: this.nextKudoId++, from: this.getEmployeeById(2)!, to: this.getEmployeeById(6)!, amount: 20, message: "Amazing work on the latest feature!", timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000) },
          { id: this.nextKudoId++, from: this.getEmployeeById(3)!, to: this.getEmployeeById(2)!, amount: 15, message: "Thanks for helping me debug that issue.", timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000) },
          { id: this.nextKudoId++, from: this.getEmployeeById(5)!, to: this.getEmployeeById(1)!, amount: 10, message: "Great leadership in the team meeting.", timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000) },
      ];
      this.kudosFeed.set(feed);
  }

  getEmployeeById(id: number) {
    return this.employees().find(e => e.id === id);
  }

  getProjectById(id: number) {
    return this.projects().find(p => p.id === id);
  }

  getEmployeesForProject(projectId: number) {
    return this.employees().filter(e => e.projectAssignments.some(pa => pa.projectId === projectId));
  }

  isRoleInUse(role: string): boolean {
    return this.employees().some(e => e.role === role || e.projectAssignments.some(pa => pa.role === role));
  }

  // Project CRUD
  addProject(projectData: Omit<Project, 'id'>): Project {
    const newProject: Project = { ...projectData, id: this.nextProjectId++ };
    this.projects.update(projects => [...projects, newProject]);
    return newProject;
  }

  updateProject(updatedProject: Project) {
    this.projects.update(projects => projects.map(p => p.id === updatedProject.id ? updatedProject : p));
  }
  
  deleteProject(projectId: number) {
    // First, remove the project itself
    this.projects.update(projects => projects.filter(p => p.id !== projectId));
    // Then, remove any assignments to that project from all employees
    this.employees.update(employees => 
      employees.map(emp => ({
        ...emp,
        projectAssignments: emp.projectAssignments.filter(pa => pa.projectId !== projectId)
      }))
    );
  }

  updateProjectAssignments(projectId: number, newAssignments: { employeeId: number, role: EmployeeRole }[]) {
    const newAssignedEmployeeIds = new Set(newAssignments.map(a => a.employeeId));

    this.employees.update(employees => employees.map(emp => {
      const isCurrentlyAssigned = emp.projectAssignments.some(pa => pa.projectId === projectId);
      const shouldBeAssigned = newAssignedEmployeeIds.has(emp.id);

      if (isCurrentlyAssigned && !shouldBeAssigned) {
        // Remove assignment
        return {
          ...emp,
          projectAssignments: emp.projectAssignments.filter(pa => pa.projectId !== projectId)
        };
      }
      
      if (!isCurrentlyAssigned && shouldBeAssigned) {
        // Add assignment
        const assignment = newAssignments.find(a => a.employeeId === emp.id)!;
        return {
          ...emp,
          projectAssignments: [...emp.projectAssignments, { projectId, role: assignment.role }]
        };
      }

      if (isCurrentlyAssigned && shouldBeAssigned) {
        // Update role if changed
        const newAssignment = newAssignments.find(a => a.employeeId === emp.id)!;
        const currentAssignment = emp.projectAssignments.find(pa => pa.projectId === projectId)!;
        if (newAssignment.role !== currentAssignment.role) {
          return {
            ...emp,
            projectAssignments: emp.projectAssignments.map(pa => 
              pa.projectId === projectId ? { ...pa, role: newAssignment.role } : pa
            )
          };
        }
      }
      
      return emp; // No change for this employee regarding this project
    }));
  }
  
  updateEmployeeRole(employeeId: number, newRole: EmployeeRole) {
    this.employees.update(employees =>
      employees.map(emp =>
        emp.id === employeeId ? { ...emp, role: newRole } : emp
      )
    );
  }

  assignEmployeeToProject(employeeId: number, projectId: number, role: EmployeeRole) {
    this.employees.update(employees => 
      employees.map(emp => {
        if (emp.id === employeeId) {
          // Avoid duplicate assignments
          if (emp.projectAssignments.some(pa => pa.projectId === projectId)) {
            return emp; 
          }
          const newAssignment: ProjectAssignment = { projectId, role };
          return { ...emp, projectAssignments: [...emp.projectAssignments, newAssignment] };
        }
        return emp;
      })
    );
  }

  unassignEmployeeFromProject(employeeId: number, projectId: number) {
     this.employees.update(employees => 
      employees.map(emp => {
        if (emp.id === employeeId) {
          return { ...emp, projectAssignments: emp.projectAssignments.filter(pa => pa.projectId !== projectId) };
        }
        return emp;
      })
    );
  }


  sendKudos(toEmployeeId: number, amount: number, message: string): { success: boolean, message: string } {
    const fromUser = this.currentUser();
    const toEmployee = this.getEmployeeById(toEmployeeId);

    if (!toEmployee) {
      return { success: false, message: "Recipient not found." };
    }
    if (fromUser.id === toEmployeeId) {
      return { success: false, message: "You cannot send kudos to yourself." };
    }
    if (fromUser.kudosBalance < amount) {
      return { success: false, message: "Not enough kudos balance." };
    }

    // --- Streak Bonus Logic ---
    let streak = 0;
    let bonus = 0;
    if (typeof localStorage !== 'undefined') {
      const todayStr = new Date().toDateString();
      const storageKeyLastSent = `user_${fromUser.id}_last_kudo_sent_date`;
      const storageKeyStreak = `user_${fromUser.id}_kudo_streak`;

      const lastSentDateStr = localStorage.getItem(storageKeyLastSent);
      let currentStreak = localStorage.getItem(storageKeyStreak) ? parseInt(localStorage.getItem(storageKeyStreak)!, 10) : 0;

      if (lastSentDateStr) {
        if (lastSentDateStr !== todayStr) {
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          if (lastSentDateStr === yesterday.toDateString()) {
            // Sent yesterday, increment streak
            currentStreak++;
          } else {
            // Sent before yesterday, reset streak
            currentStreak = 1;
          }
           localStorage.setItem(storageKeyLastSent, todayStr);
        }
        // If sent today, streak is unchanged.
      } else {
        // First time sending kudos
        currentStreak = 1;
        localStorage.setItem(storageKeyLastSent, todayStr);
      }
      
      streak = currentStreak;
      localStorage.setItem(storageKeyStreak, streak.toString());

      // Apply bonus if streak is 3 days or more
      if (streak >= 3) {
        bonus = Math.max(1, Math.floor(amount * 0.1)); // 10% kudos back, min 1
      }
    }
    // --- End Streak Bonus Logic ---


    // Update balances
    this.employees.update(employees => 
      employees.map(emp => {
        if (emp.id === fromUser.id) {
          return { ...emp, kudosBalance: emp.kudosBalance - amount + bonus, kudosSent: emp.kudosSent + amount };
        }
        if (emp.id === toEmployeeId) {
          return { ...emp, kudosReceived: emp.kudosReceived + amount };
        }
        return emp;
      })
    );
    
    // Add to feed
    const newKudo: KudoTransaction = {
        id: this.nextKudoId++,
        from: fromUser,
        to: toEmployee,
        amount,
        message,
        timestamp: new Date()
    };
    this.kudosFeed.update(feed => [newKudo, ...feed]);

    // Simulate pub/sub notification to Teams
    console.log(`[TEAMS NOTIFICATION] ${fromUser.name} sent ${amount} kudos to ${toEmployee.name} with message: "${message}"`);

    let successMessage = `Successfully sent ${amount} kudos!`;
    if (bonus > 0) {
        successMessage += ` You got ${bonus} kudos back for your ${streak}-day streak! 🔥`;
    }

    return { success: true, message: successMessage };
  }

  redeemReward(rewardId: number): { success: boolean, message: string } {
      const reward = this.rewards().find(r => r.id === rewardId);
      if (!reward) {
          return { success: false, message: "Reward not found." };
      }
      
      const user = this.currentUser();
      if (user.kudosReceived < reward.cost) {
          return { success: false, message: "Not enough kudos points to redeem this reward." };
      }
      
      this.employees.update(employees => 
        employees.map(emp => emp.id === user.id ? { ...emp, kudosReceived: emp.kudosReceived - reward.cost } : emp)
      );
      
      return { success: true, message: `You have successfully redeemed "${reward.name}"!` };
  }

  getKudosLeaderboard = computed(() => {
    return this.employees().slice().sort((a, b) => b.kudosReceived - a.kudosReceived).slice(0, 5);
  });
}