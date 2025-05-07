import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatExpansionModule } from '@angular/material/expansion';
import { Colord, colord, extend } from "colord";
import cmykPlugin from "colord/plugins/cmyk";
import namesPlugin from "colord/plugins/names";
import hwbPlugin from "colord/plugins/hwb";
import labPlugin from "colord/plugins/lab";
import lchPlugin from "colord/plugins/lch";
import xyzPlugin from "colord/plugins/xyz";

extend([namesPlugin]);
extend([cmykPlugin]);
extend([hwbPlugin]);
extend([labPlugin]);
extend([lchPlugin]);
extend([xyzPlugin]);

@Component({
  selector: 'app-colorpicker',
  standalone: true,
  imports: [
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatExpansionModule,
    CommonModule,
  ],
  templateUrl: './colorpicker.component.html',
  styleUrl: './colorpicker.component.scss'
})
export class ColorpickerComponent {
  apiAvailable = 'EyeDropper' in window;
  abortController = new AbortController();
  color = "#000000"

  async sampleColorFromScreen(abortController: AbortController) {
    const eyeDropper = new (window as any).EyeDropper();
    try {
      const result = await eyeDropper.open({signal: abortController.signal});
      this.color = result.sRGBHex;
    } catch (e) {
    }
  }

  colord_cons(color: string) : Colord {
    return colord(color)
  }
}
