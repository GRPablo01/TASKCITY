import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  // stocke le mode actuel
  private darkMode$ = new BehaviorSubject<boolean>(localStorage.getItem('theme') === 'dark');

  // observable pour s'abonner depuis les composants
  darkModeObservable = this.darkMode$.asObservable();

  // getter pour accéder au mode actuel
  get isDarkMode(): boolean {
    return this.darkMode$.value;
  }

  // toggle du thème
  toggleTheme(): void {
    const newMode = !this.darkMode$.value;
    localStorage.setItem('theme', newMode ? 'dark' : 'light');
    this.darkMode$.next(newMode);

    document.body.classList.toggle('dark', newMode);
    document.documentElement.classList.toggle('dark', newMode);
  }
}
