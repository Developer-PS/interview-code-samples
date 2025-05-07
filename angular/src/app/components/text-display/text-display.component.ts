import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-text-display',
  standalone: true,
  imports: [],
  templateUrl: './text-display.component.html',
  styleUrl: './text-display.component.scss',
})
export class TextDisplayComponent {
  @Input() text: string = '';

  setText(text: string) {
    this.text = text;
    document.title = text;
  }
}
