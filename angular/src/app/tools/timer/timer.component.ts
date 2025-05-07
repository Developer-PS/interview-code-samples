import { Component } from '@angular/core';
import { TextDisplayComponent } from '../../components/text-display/text-display.component';
import {
  MatFormField,
  MatFormFieldModule,
  MatLabel,
} from '@angular/material/form-field';
import { BrowserModule } from '@angular/platform-browser';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-timer',
  standalone: true,
  imports: [
    TextDisplayComponent,
    MatFormField,
    MatLabel,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './timer.component.html',
  styleUrl: './timer.component.scss',
})
export class TimerComponent {
  countdownForm: FormGroup;
  remainingTime: number = 0;
  intervalId: any;
  isRunning: boolean = false;

  constructor() {
    this.countdownForm = new FormGroup({
      time: new FormControl(30, [Validators.required, Validators.min(1)]),
    });
  }

  startTimer(): void {
    let inputTime = this.remainingTime;

    if (this.remainingTime == 0) {
      inputTime = this.countdownForm.get('time')?.value;
    }

    this.remainingTime = inputTime;
    this.isRunning = true;

    this.intervalId = setInterval(() => {
      if (this.remainingTime > 0) {
        this.remainingTime--;
      } else {
        this.stopTimer();
      }
    }, 1000);
  }

  stopTimer(): void {
    this.isRunning = false;
    clearInterval(this.intervalId);
  }

  resetTimer(): void {
    this.isRunning = false;
    clearInterval(this.intervalId);
    this.remainingTime = 0;
    this.countdownForm.reset({ time: 30 });
  }

  formatTime(timeInSeconds: number): string {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;

    const formattedMinutes = minutes < 10 ? '0' + minutes : minutes.toString();
    const formattedSeconds = seconds < 10 ? '0' + seconds : seconds.toString();

    return `${formattedMinutes}:${formattedSeconds}`;
  }
}
