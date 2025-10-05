import { Routes, UrlTree, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from './services/auth.service';
import { AuthComponent } from './components/auth/auth.component';
import { ShellComponent } from './components/shell/shell.component';

// Guards
const authGuard = (): boolean | UrlTree => {
  const auth = inject(AuthService);
  const router = inject(Router);
  // If not authenticated, redirect to login
  return auth.isLoggedIn() ? true : router.createUrlTree(['/login']);
};

const guestGuard = (): boolean | UrlTree => {
  const auth = inject(AuthService);
  const router = inject(Router);
  // If already authenticated, redirect to dashboard
  return auth.isLoggedIn() ? router.createUrlTree(['/dashboard']) : true;
};

const rootRedirectGuard = (): UrlTree => {
  const auth = inject(AuthService);
  const router = inject(Router);
  return auth.isLoggedIn() ? router.createUrlTree(['/dashboard']) : router.createUrlTree(['/login']);
};

export const routes: Routes = [
  // Decide where to go on root based on auth state
  { path: '', pathMatch: 'full', canActivate: [rootRedirectGuard], children: [] },

  // Public auth route; bounce authenticated users to dashboard
  { path: 'login', component: AuthComponent, canActivate: [guestGuard] },
  {
    path: '',
    component: ShellComponent,
    canActivate: [authGuard],
    children: [
      { path: 'dashboard', loadComponent: () => import('./components/dashboard/dashboard.component').then(m => m.DashboardComponent) },
      { path: 'employees', loadComponent: () => import('./components/employees/employees.component').then(m => m.EmployeesComponent) },
      { path: 'projects', loadComponent: () => import('./components/projects/projects.component').then(m => m.ProjectsComponent) },
      { path: 'rewards', loadComponent: () => import('./components/rewards/rewards.component').then(m => m.RewardsComponent) },
      { path: 'profile', loadComponent: () => import('./components/profile/profile.component').then(m => m.ProfileComponent) },
    ]
  },
  // Fallback: send unknown routes to login; authenticated users will be redirected onward by guestGuard when hitting /login
  { path: '**', redirectTo: 'login' }
];
