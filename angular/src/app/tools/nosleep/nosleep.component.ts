import { Component } from '@angular/core';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { WakelockService } from '../../services/wakelock.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-nosleep',
  standalone: true,
  imports: [MatSlideToggleModule, FormsModule],
  templateUrl: './nosleep.component.html',
  styleUrl: './nosleep.component.scss',
})
export class NosleepComponent {
  
  constructor(public wakelockService: WakelockService) {
    
  }

}
