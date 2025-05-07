import { Component, OnInit } from '@angular/core';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { ThemeService } from '../../../services/theme.service';

@Component({
  selector: 'app-theme-switcher',
  standalone: true,
  imports: [
    CommonModule,
    MatSlideToggleModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule
  ],
  template: `
    <div class="theme-switcher">
      <button
        mat-button
        [matTooltip]="(isDarkTheme$ | async) ? 'Switch to light theme' : 'Switch to dark theme'"
        (click)="toggleTheme()">
        <mat-icon>{{ (isDarkTheme$ | async) ? 'dark_mode' : 'light_mode' }}</mat-icon>
        {{ (isDarkTheme$ | async) ? 'Dark Mode' : 'Light Mode' }}
      </button>
    </div>
  `,
  styles: [`
    .theme-switcher {
      display: flex;
      align-items: center;
      padding: 0 10px;
    }
  `]
})
export class ThemeSwitcherComponent implements OnInit {
  isDarkTheme$!: Observable<boolean>;

  constructor(private themeService: ThemeService) {}

  ngOnInit(): void {
    this.isDarkTheme$ = this.themeService.isDarkTheme$;
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }
}