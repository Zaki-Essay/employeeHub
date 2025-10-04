import { Injectable, signal, effect } from '@angular/core';

export type Theme = 'light' | 'dark';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private storageKey = 'employeehub_theme';
  theme = signal<Theme>('light');

  constructor() {
    this.loadThemeFromStorage();
    effect(() => {
      const currentTheme = this.theme();
      if (currentTheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      this.saveThemeToStorage(currentTheme);
    });
  }

  private loadThemeFromStorage() {
    if (typeof localStorage !== 'undefined') {
      const storedTheme = localStorage.getItem(this.storageKey) as Theme | null;
      // Default to dark theme if user has OS preference, otherwise light
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      this.theme.set(storedTheme || (prefersDark ? 'dark' : 'light'));
    }
  }

  private saveThemeToStorage(theme: Theme) {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(this.storageKey, theme);
    }
  }

  toggleTheme() {
    this.theme.update(current => current === 'light' ? 'dark' : 'light');
  }
}