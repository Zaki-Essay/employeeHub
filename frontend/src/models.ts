export type EmployeeRole = string;

export interface ProjectAssignment {
  projectId: number;
  role: EmployeeRole;
}

export interface Badge {
    id: string;
    name: string;
    description: string;
    icon: string; // emoji
}

export interface Employee {
  id: number;
  name: string;
  role: EmployeeRole;
  avatarUrl: string;
  kudosReceived: number;
  kudosBalance: number;
  kudosSent: number;
  projectAssignments: ProjectAssignment[];
}

// Backend DTO interface that matches the API response
export interface UserDTO {
  id: number;
  name: string;
  email: string;
  role: string;
  avatarUrl: string;
  kudosBalance: number;
  kudosReceived: number;
  streakCount: number;
}

export interface Project {
  id: number;
  name: string;
  description: string;
}

export interface Reward {
  id: number;
  name: string;
  description: string;
  cost: number;
  imageUrl: string;
}

export interface KudoTransaction {
  id: number;
  from: Employee;
  to: Employee;
  amount: number;
  message: string;
  timestamp: Date;
}

export interface Notification {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
}

// FIX: Add missing Task and TaskStatus types.
export type TaskStatus = 'To Do' | 'In Progress' | 'Done';

export interface Task {
  id: number;
  title: string;
  description: string;
  dueDate: string;
  status: TaskStatus;
}
