import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private isDarkTheme = new BehaviorSubject<boolean>(true); // Standard ist dunkel
  isDarkTheme$ = this.isDarkTheme.asObservable();

  constructor() {
    // Beim Start den aktuellen Theme-Status laden
    const savedTheme = localStorage.getItem('darkTheme');
    if (savedTheme !== null) {
      this.setDarkTheme(savedTheme === 'true');
    } else {
      // Wenn keine Einstellung gespeichert ist, System-Präferenzen überprüfen
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      this.setDarkTheme(prefersDark);
    }
  }

  setDarkTheme(isDark: boolean): void {
    this.isDarkTheme.next(isDark);
    localStorage.setItem('darkTheme', isDark.toString());

    if (isDark) {
      document.documentElement.classList.add('dark-theme');
      document.documentElement.classList.remove('light-theme');

      document.documentElement.classList.add('cc--darkmode');
      document.documentElement.classList.remove('cc--lightmode');
    } else {
      document.documentElement.classList.add('light-theme');
      document.documentElement.classList.remove('dark-theme');

      document.documentElement.classList.add('cc--lightmode');
      document.documentElement.classList.remove('cc--darkmode');
    }
  }

  toggleTheme(): void {
    this.setDarkTheme(!this.isDarkTheme.value);
  }
}