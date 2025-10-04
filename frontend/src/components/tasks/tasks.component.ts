import { Component, ChangeDetectionStrategy, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TaskService } from '../../services/task.service';
import { Task, TaskStatus } from '../../models';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './tasks.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TasksComponent {
  taskService = inject(TaskService);
  tasks = this.taskService.tasks;

  showForm = signal(false);
  newTaskTitle = signal('');
  newTaskDescription = signal('');
  newTaskDueDate = signal('');

  tasksToDo = computed(() => this.tasks().filter(t => t.status === 'To Do').sort((a,b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()));
  tasksInProgress = computed(() => this.tasks().filter(t => t.status === 'In Progress').sort((a,b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()));
  tasksDone = computed(() => this.tasks().filter(t => t.status === 'Done').sort((a,b) => new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime()));

  toggleForm() {
    this.showForm.set(!this.showForm());
    this.resetForm();
  }

  resetForm() {
    this.newTaskTitle.set('');
    this.newTaskDescription.set('');
    this.newTaskDueDate.set('');
  }

  addTask() {
    if (this.newTaskTitle() && this.newTaskDueDate()) {
      this.taskService.addTask({
        title: this.newTaskTitle(),
        description: this.newTaskDescription(),
        dueDate: this.newTaskDueDate(),
      });
      this.toggleForm();
    }
  }

  updateTaskStatus(task: Task, newStatus: TaskStatus) {
    this.taskService.updateTask({ ...task, status: newStatus });
  }

  deleteTask(id: number) {
    this.taskService.deleteTask(id);
  }
}
