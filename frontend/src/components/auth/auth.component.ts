import { Component, ChangeDetectionStrategy, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './auth.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthComponent {
  private authService = inject(AuthService);
  private notificationService = inject(NotificationService);

  formType = signal<'login' | 'register'>('login');

  email = signal('');
  password = signal('');
  fullName = signal('');

  errorMessage = signal<string | null>(null);

  switchForm(type: 'login' | 'register') {
    this.formType.set(type);
    this.errorMessage.set(null);
    this.authService.clearError();
  }

  submitForm() {
    this.errorMessage.set(null);
    const email = this.email().trim();
    const password = this.password().trim();

    if (this.formType() === 'login') {
      if (!email || !password) {
        this.errorMessage.set('Please enter both email and password.');
        return;
      }
      this.authService.login({ email, password }).subscribe({
        next: () => {
          this.notificationService.show('Welcome back!', 'success');
        },
        error: (error) => {
          this.errorMessage.set(error.message || 'Login failed');
        },
      });
    } else {
      const fullName = this.fullName().trim();
      if (!fullName || !email || !password) {
        this.errorMessage.set('Please fill in all fields.');
        return;
      }
      if (password.length < 6) {
        this.errorMessage.set('Password must be at least 6 characters long.');
        return;
      }
      this.authService.register({ name: fullName, email, password }).subscribe({
        next: () => {
          this.notificationService.show('Account created successfully!', 'success');
        },
        error: (error) => {
          this.errorMessage.set(error.message || 'Registration failed');
        },
      });
    }
  }
}



