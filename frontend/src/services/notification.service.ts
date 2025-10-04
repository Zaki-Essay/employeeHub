
import { Injectable, signal } from '@angular/core';
import { Notification } from '../models';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  notifications = signal<Notification[]>([]);
  private nextId = 0;

  show(message: string, type: 'success' | 'error' | 'info' = 'info', duration: number = 3000) {
    const id = this.nextId++;
    const notification: Notification = { id, message, type };
    this.notifications.update(current => [...current, notification]);

    setTimeout(() => {
      this.remove(id);
    }, duration);
  }

  remove(id: number) {
    this.notifications.update(current => current.filter(n => n.id !== id));
  }
}
