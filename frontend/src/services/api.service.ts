import {Injectable, signal, computed, inject} from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { Employee, Project, Reward, KudoTransaction, UserDTO } from '../models';
import {NotificationService} from "@/src/services/notification.service";

// API Response interfaces
export interface AuthResponse {
  id: number;
  name: string;
  email: string;
  role: string;
  token: string;
  avatarUrl: string;
  kudosBalance: number;
  kudosReceived: number;
  streakCount: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}


export interface ProjectDTO {
  id: number;
  name: string;
  description: string;
}

export interface CreateProjectRequest {
  name: string;
  description: string;
}

export interface UpdateProjectRequest {
  name: string;
  description: string;
}

export interface RewardDTO {
  id: number;
  name: string;
  description: string;
  cost: number;
  imageUrl: string;
}

export interface SendKudosRequest {
  receiverId: number;
  amount: number;
  message: string;
}

export interface KudosDTO {
  id: number;
  from: UserDTO;
  to: UserDTO;
  amount: number;
  message: string;
  timestamp: string;
}

export interface RewardRedemptionDTO {
  id: number;
  user: UserDTO;
  reward: RewardDTO;
  redeemedAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly baseUrl = '/api';
  private currentUserSubject = new BehaviorSubject<AuthResponse | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  // Signals for reactive state management
  public employees = signal<UserDTO[]>([]);
  public projects = signal<ProjectDTO[]>([]);
  public rewards = signal<RewardDTO[]>([]);
  public kudosFeed = signal<KudosDTO[]>([]);
  public currentUser = signal<AuthResponse | null>(null);
  public notificationService = inject(NotificationService);

  constructor(private http: HttpClient) {
    this.loadCurrentUser();
  }

  private getHeaders(): HttpHeaders {
    const token = this.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    });
  }

  private getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  private setToken(token: string): void {
    localStorage.setItem('auth_token', token);
  }

  private removeToken(): void {
    localStorage.removeItem('auth_token');
  }

  private loadCurrentUser(): void {
    const token = this.getToken();
    if (token) {
      this.getCurrentUser().subscribe({
        next: (user) => {
          this.currentUser.set(user);
          this.currentUserSubject.next(user);
        },
        error: () => {
          this.logout();
        }
      });
    }
  }

  // Authentication methods
  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/auth/login`, credentials)
      .pipe(
        tap(response => {
          this.setToken(response.token);
          this.currentUser.set(response);
          this.currentUserSubject.next(response);
        }),
        catchError(this.handleError)
      );
  }

  register(userData: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/auth/register`, userData)
      .pipe(
        tap(response => {
          this.setToken(response.token);
          this.currentUser.set(response);
          this.currentUserSubject.next(response);
        }),
        catchError(this.handleError)
      );
  }

  getCurrentUser(): Observable<AuthResponse> {
    return this.http.get<AuthResponse>(`${this.baseUrl}/auth/me`, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  logout(): void {
    this.removeToken();
    this.currentUser.set(null);
    this.currentUserSubject.next(null);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  // User methods
  getAllUsers(): Observable<UserDTO[]> {
    return this.http.get<UserDTO[]>(`${this.baseUrl}/users/`, { headers: this.getHeaders() })
      .pipe(
        tap(users => this.employees.set(users)),
        catchError(this.handleError)
      );
  }

  updateUserRole(userId: number, role: string): Observable<UserDTO> {
    return this.http.patch<UserDTO>(`${this.baseUrl}/users/${userId}/role`, 
      { role }, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  // Project methods
  getAllProjects(): Observable<ProjectDTO[]> {
    return this.http.get<ProjectDTO[]>(`${this.baseUrl}/projects/`, { headers: this.getHeaders() })
      .pipe(
        tap(projects => this.projects.set(projects)),
        catchError(this.handleError)
      );
  }

  createProject(projectData: CreateProjectRequest): Observable<ProjectDTO> {
    return this.http.post<ProjectDTO>(`${this.baseUrl}/projects/`, projectData, { headers: this.getHeaders() })
      .pipe(
        tap(project => {
          this.projects.update(projects => [...projects, project]);
        }),
        catchError(this.handleError)
      );
  }

  updateProject(projectId: number, projectData: UpdateProjectRequest): Observable<ProjectDTO> {
    return this.http.put<ProjectDTO>(`${this.baseUrl}/projects/${projectId}`, projectData, { headers: this.getHeaders() })
      .pipe(
        tap(updatedProject => {
          this.projects.update(projects => 
            projects.map(p => p.id === projectId ? updatedProject : p)
          );
        }),
        catchError(this.handleError)
      );
  }

  deleteProject(projectId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/projects/${projectId}`, { headers: this.getHeaders() })
      .pipe(
        tap(() => {
          this.projects.update(projects => projects.filter(p => p.id !== projectId));
        }),
        catchError(this.handleError)
      );
  }

  // Kudos methods
  sendKudos(kudosData: SendKudosRequest): Observable<KudosDTO> {
    return this.http.post<KudosDTO>(`${this.baseUrl}/kudos/send`, kudosData, { headers: this.getHeaders() })
      .pipe(
        tap(kudos => {
          this.kudosFeed.update(feed => [kudos, ...feed]);
          // Refresh current user to get updated kudos balance
          this.getCurrentUser().subscribe();
          this.notificationService.show('success');
        }),
        catchError(this.handleError)
      );
  }

  getKudosFeed(page: number = 0, size: number = 20): Observable<KudosDTO[]> {
    return this.http.get<KudosDTO[]>(`${this.baseUrl}/kudos/feed?page=${page}&size=${size}`, { headers: this.getHeaders() })
      .pipe(
        tap(feed => this.kudosFeed.set(feed)),
        catchError(this.handleError)
      );
  }

  getKudosLeaderboard(): Observable<UserDTO[]> {
    return this.http.get<UserDTO[]>(`${this.baseUrl}/kudos/leaderboard`, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  // Reward methods
  getAllRewards(): Observable<RewardDTO[]> {
    return this.http.get<RewardDTO[]>(`${this.baseUrl}/rewards/`, { headers: this.getHeaders() })
      .pipe(
        tap(rewards => this.rewards.set(rewards)),
        catchError(this.handleError)
      );
  }

  redeemReward(rewardId: number): Observable<RewardRedemptionDTO> {
    return this.http.post<RewardRedemptionDTO>(`${this.baseUrl}/rewards/${rewardId}/redeem`, {}, { headers: this.getHeaders() })
      .pipe(
        tap(() => {
          // Refresh current user to get updated kudos balance
          this.getCurrentUser().subscribe();
        }),
        catchError(this.handleError)
      );
  }

  // Computed properties
  public kudosLeaderboard = computed(() => {
    return this.employees().slice().sort((a, b) => b.kudosReceived - a.kudosReceived);
  });

  // Error handling
  private handleError(error: any): Observable<never> {
    console.error('API Error:', error);
    let errorMessage = 'An error occurred';
    
    if (error.error?.message) {
      errorMessage = error.error.message;
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    return throwError(() => new Error(errorMessage));
  }

  // Initialize data
  initializeData(): void {
    if (this.isAuthenticated()) {
      this.getAllUsers().subscribe();
      this.getAllProjects().subscribe();
      this.getAllRewards().subscribe();
      this.getKudosFeed().subscribe();
    }
  }
}
