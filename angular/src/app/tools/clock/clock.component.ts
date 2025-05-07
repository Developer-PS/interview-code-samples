import { Component, ElementRef } from '@angular/core';
import { TextDisplayComponent } from '../../components/text-display/text-display.component';

@Component({
  selector: 'app-clock',
  standalone: true,
  imports: [TextDisplayComponent],
  templateUrl: './clock.component.html',
  styleUrl: './clock.component.scss',
})
export class ClockComponent {
  currentTime: string = 'aaaaa';
  private timer: ReturnType<typeof setInterval> | null = null;

  constructor(private elRef: ElementRef) {}

  ngOnInit(): void {
    this.updateTime();
    this.timer = setInterval(() => {
      this.updateTime();
    }, 500);
  }

  ngOnDestroy(): void {
    clearInterval(this.timer!);
  }

  private setText(text: string) {
    document.title = text;
  }

  private updateTime(): void {
    const date = new Date();
    const hours = this.pad(date.getHours());
    const minutes = this.pad(date.getMinutes());
    const seconds = this.pad(date.getSeconds());

    this.currentTime = `${hours}:${minutes}:${seconds}`;
  }

  private pad(n: number): string {
    return n < 10 ? '0' + n : n.toString();
  }
  
  toggleFullscreen(event: Event): void {
    const elem = this.elRef.nativeElement; // Get the root element of the component

    if (!document.fullscreenElement) {
      // Enter fullscreen
      if (elem.requestFullscreen) {
        elem.requestFullscreen();
      } else if ((elem as any).webkitRequestFullscreen) {
        // Safari compatibility
        (elem as any).webkitRequestFullscreen();
      } else if ((elem as any).mozRequestFullScreen) {
        // Older Firefox compatibility
        (elem as any).mozRequestFullScreen();
      } else if ((elem as any).msRequestFullscreen) {
        // IE/Edge compatibility
        (elem as any).msRequestFullscreen();
      }
    } else {
      // Exit fullscreen
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if ((document as any).webkitExitFullscreen) {
        (document as any).webkitExitFullscreen();
      } else if ((document as any).mozCancelFullScreen) {
        (document as any).mozCancelFullScreen();
      } else if ((document as any).msExitFullscreen) {
        (document as any).msExitFullscreen();
      }
    }
  }
}
