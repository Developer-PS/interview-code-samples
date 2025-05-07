import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-crosshairpreview',
  standalone: true,
  imports: [
    MatIconModule
  ],
  templateUrl: './crosshairpreview.component.html',
  styleUrl: './crosshairpreview.component.scss'
})
export class CrosshairpreviewComponent {
  @Input() code: string = ""
  
  //@ViewChild('canvas') canvas: HTMLCanvasElement;
}
