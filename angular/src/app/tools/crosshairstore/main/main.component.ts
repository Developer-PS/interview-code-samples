import { Component } from '@angular/core';
import { CrosshairpreviewComponent } from '../crosshairpreview/crosshairpreview.component';
import { CrosshairConvars, CrosshairCode } from '../crosshair';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-main',
  standalone: true,
  imports: [
    CrosshairpreviewComponent,
    FormsModule
  ],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss'
})
export class CrosshairstoreMainComponent {
  codes : CrosshairCode[] = [
    new CrosshairCode("CSGO-O4Jsi-V36wY-rTMGK-9w7qF-jQ8WB")
  ]

  constructor() {
  }
}
