import { Injectable, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { ApiService, AuthResponse, LoginRequest, RegisterRequest } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Signals for reactive state management
  private isAuthenticatedSignal = signal<boolean>(false);
  public currentUser = signal<AuthResponse | null>(null);
  public isLoading = signal<boolean>(false);
  public error = signal<string | null>(null);

  constructor(
    private apiService: ApiService,
    private router: Router
  ) {
    // Initialize authentication state
    this.initializeAuth();
  }

  private initializeAuth(): void {
    const isAuth = this.apiService.isAuthenticated();
    this.isAuthenticatedSignal.set(isAuth);
    
    if (isAuth) {
      this.apiService.getCurrentUser().subscribe({
        next: (user) => {
          this.currentUser.set(user);
          this.isAuthenticatedSignal.set(true);
        },
        error: () => {
          this.logout();
        }
      });
    }
  }

  // Computed properties
  public isLoggedIn = computed(() => this.isAuthenticatedSignal());
  public userRole = computed(() => this.currentUser()?.role || null);
  public isAdmin = computed(() => this.userRole() === 'ADMIN');
  public isUser = computed(() => this.userRole() === 'USER');

  login(credentials: LoginRequest): Observable<AuthResponse> {
    this.isLoading.set(true);
    this.error.set(null);

    return this.apiService.login(credentials).pipe(
      tap((response) => {
        this.currentUser.set(response);
        this.isAuthenticatedSignal.set(true);
        this.isLoading.set(false);
        this.router.navigateByUrl('/dashboard');
      }),
      catchError((error) => {
        this.error.set(error.message || 'Login failed');
        this.isLoading.set(false);
        throw error;
      })
    );
  }

  register(userData: RegisterRequest): Observable<AuthResponse> {
    this.isLoading.set(true);
    this.error.set(null);

    return this.apiService.register(userData).pipe(
      tap((response) => {
        this.currentUser.set(response);
        this.isAuthenticatedSignal.set(true);
        this.isLoading.set(false);
        this.router.navigateByUrl('/dashboard');
      }),
      catchError((error) => {
        this.error.set(error.message || 'Registration failed');
        this.isLoading.set(false);
        throw error;
      })
    );
  }

  logout(): void {
    this.apiService.logout();
    this.currentUser.set(null);
    this.isAuthenticatedSignal.set(false);
    this.error.set(null);
    this.router.navigateByUrl('/login');
  }

  getCurrentUser(): AuthResponse | null {
    return this.currentUser();
  }

  hasRole(role: string): boolean {
    return this.userRole() === role;
  }

  hasAnyRole(roles: string[]): boolean {
    const userRole = this.userRole();
    return userRole ? roles.includes(userRole) : false;
  }

  clearError(): void {
    this.error.set(null);
  }
}
