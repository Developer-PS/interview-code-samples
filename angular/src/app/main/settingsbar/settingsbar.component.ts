import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { WakelockService } from '../../services/wakelock.service';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FormsModule } from '@angular/forms';
import { ThemeSwitcherComponent } from './theme-switcher/theme-switcher.component';

@Component({
  selector: 'app-settingsbar',
  standalone: true,
  imports: [
    MatSidenavModule,
    MatButtonModule,
    MatSlideToggleModule,
    MatIconModule,
    CommonModule,
    FormsModule,
    ThemeSwitcherComponent
  ],
  templateUrl: './settingsbar.component.html',
  styleUrl: './settingsbar.component.scss',
})
export class SettingsbarComponent {
  constructor(public wakelockService: WakelockService) {}
}
