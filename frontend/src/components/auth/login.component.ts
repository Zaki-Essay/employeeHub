import { Component, ChangeDetectionStrategy, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-md w-full space-y-8">
        <div>
          <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to Employee Hub
          </h2>
          <p class="mt-2 text-center text-sm text-gray-600">
            Or
            <a href="#" (click)="toggleMode()" class="font-medium text-indigo-600 hover:text-indigo-500">
              {{ isLoginMode() ? 'create a new account' : 'sign in to your account' }}
            </a>
          </p>
        </div>
        <form class="mt-8 space-y-6" [formGroup]="authForm" (ngSubmit)="onSubmit()">
          <div class="rounded-md shadow-sm -space-y-px">
            <div>
              <label for="email" class="sr-only">Email address</label>
              <input
                id="email"
                name="email"
                type="email"
                autocomplete="email"
                required
                formControlName="email"
                class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
              />
            </div>
            <div *ngIf="!isLoginMode()">
              <label for="name" class="sr-only">Full name</label>
              <input
                id="name"
                name="name"
                type="text"
                autocomplete="name"
                required
                formControlName="name"
                class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Full name"
              />
            </div>
            <div>
              <label for="password" class="sr-only">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                autocomplete="current-password"
                required
                formControlName="password"
                class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Password"
              />
            </div>
          </div>

          <div *ngIf="authService.error()" class="text-red-600 text-sm text-center">
            {{ authService.error() }}
          </div>

          <div>
            <button
              type="submit"
              [disabled]="authForm.invalid || authService.isLoading()"
              class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span *ngIf="authService.isLoading()" class="absolute left-0 inset-y-0 flex items-center pl-3">
                <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </span>
              {{ isLoginMode() ? 'Sign in' : 'Sign up' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  public authService = inject(AuthService);
  private notificationService = inject(NotificationService);

  isLoginMode = signal<boolean>(true);
  authForm: FormGroup;

  constructor() {
    this.authForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      name: ['', [Validators.required, Validators.minLength(2)]]
    });
  }

  toggleMode(): void {
    this.isLoginMode.set(!this.isLoginMode());
    this.authService.clearError();
    
    if (this.isLoginMode()) {
      this.authForm.get('name')?.clearValidators();
    } else {
      this.authForm.get('name')?.setValidators([Validators.required, Validators.minLength(2)]);
    }
    this.authForm.get('name')?.updateValueAndValidity();
  }

  onSubmit(): void {
    if (this.authForm.valid) {
      const formValue = this.authForm.value;
      
      if (this.isLoginMode()) {
        this.authService.login({
          email: formValue.email,
          password: formValue.password
        }).subscribe({
          next: () => {
            this.notificationService.show('Welcome back!', 'success');
          },
          error: (error) => {
            this.notificationService.show(error.message || 'Login failed', 'error');
          }
        });
      } else {
        this.authService.register({
          name: formValue.name,
          email: formValue.email,
          password: formValue.password
        }).subscribe({
          next: () => {
            this.notificationService.show('Account created successfully!', 'success');
          },
          error: (error) => {
            this.notificationService.show(error.message || 'Registration failed', 'error');
          }
        });
      }
    }
  }
}
