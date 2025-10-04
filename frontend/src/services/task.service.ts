import { Injectable, signal, effect } from '@angular/core';
import { Task } from '../models';

@Injectable({ providedIn: 'root' })
export class TaskService {
  tasks = signal<Task[]>([]);
  private storageKey = 'employeehub_tasks';

  constructor() {
    this.loadTasksFromStorage();
    effect(() => {
      this.saveTasksToStorage(this.tasks());
    });
  }

  private loadTasksFromStorage() {
    if (typeof localStorage !== 'undefined') {
      const storedTasks = localStorage.getItem(this.storageKey);
      if (storedTasks) {
        this.tasks.set(JSON.parse(storedTasks));
      } else {
        // Add some mock tasks if none exist
        this.tasks.set([
            { id: 1, title: 'Prepare Q3 presentation', description: 'Gather all project metrics and create slides.', dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], status: 'In Progress' },
            { id: 2, title: 'Review Titan project PRs', description: 'Go through the open pull requests on GitHub.', dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], status: 'To Do' },
            { id: 3, title: 'Deploy Odyssey App v1.2', description: 'Final deployment to production servers.', dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], status: 'Done' },
        ]);
      }
    }
  }

  private saveTasksToStorage(tasks: Task[]) {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(this.storageKey, JSON.stringify(tasks));
    }
  }

  addTask(task: Omit<Task, 'id' | 'status'>) {
    const newTask: Task = {
      ...task,
      id: Date.now(),
      status: 'To Do',
    };
    this.tasks.update(current => [...current, newTask]);
  }

  updateTask(updatedTask: Task) {
    this.tasks.update(tasks => tasks.map(task => task.id === updatedTask.id ? updatedTask : task));
  }

  deleteTask(id: number) {
    this.tasks.update(tasks => tasks.filter(task => task.id !== id));
  }
}
