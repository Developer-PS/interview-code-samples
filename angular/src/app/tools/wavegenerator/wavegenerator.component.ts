import { Component, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-wavegenerator',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './wavegenerator.component.html',
  styleUrl: './wavegenerator.component.scss'
})
export class WavegeneratorComponent implements OnDestroy {
  private audioCtx?: AudioContext;
  private oscillator?: OscillatorNode;
  private gainNode?: GainNode;
  private analyser?: AnalyserNode;
  private animationId?: number;

  isPlaying = false;
  volume = 0.5;
  frequency = 440;
  waveform = 'sine';
  waveforms = ['sine', 'square', 'triangle', 'sawtooth'];

  canvas!: HTMLCanvasElement;
  canvasCtx!: CanvasRenderingContext2D;

  toggleSound(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.canvasCtx = canvas.getContext('2d')!;

    if (!this.isPlaying) {
      this.startSound();
    } else {
      this.stopSound();
    }
  }

  private startSound() {
    this.audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    this.oscillator = this.audioCtx.createOscillator();
    this.gainNode = this.audioCtx.createGain();
    this.analyser = this.audioCtx.createAnalyser();

    this.oscillator.type = this.waveform as OscillatorType;
    this.oscillator.frequency.setValueAtTime(this.frequency, this.audioCtx.currentTime);
    this.gainNode.gain.setValueAtTime(this.volume, this.audioCtx.currentTime);

    this.oscillator.connect(this.gainNode);
    this.gainNode.connect(this.analyser);
    this.analyser.connect(this.audioCtx.destination);

    this.oscillator.start();
    this.isPlaying = true;

    this.visualize();
  }

  private stopSound() {
    this.oscillator?.stop();
    this.audioCtx?.close();
    this.isPlaying = false;

    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
  }

  onVolumeChange(value: number) {
    this.volume = value;
    this.gainNode?.gain.setValueAtTime(value, this.audioCtx!.currentTime);
  }

  onFrequencyChange(value: number) {
    this.frequency = value;
    this.oscillator?.frequency.setValueAtTime(value, this.audioCtx!.currentTime);
  }

  onWaveformChange(value: string) {
    this.waveform = value;
    if (this.oscillator) {
      this.oscillator.type = value as OscillatorType;
    }
  }

  private visualize() {
    const bufferLength = this.analyser!.fftSize = 2048;
    const dataArray = new Uint8Array(this.analyser!.frequencyBinCount);
    let canvas_bg = window.getComputedStyle(document.documentElement).getPropertyValue('--md-sys-color-surface-container-high')
    let canvas_fg = window.getComputedStyle(document.documentElement).getPropertyValue('--md-sys-color-primary')
    const draw = () => {
      this.animationId = requestAnimationFrame(draw);

      this.analyser!.getByteTimeDomainData(dataArray);

      this.canvasCtx.fillStyle = canvas_bg;
      this.canvasCtx.fillRect(0, 0, this.canvas.width, this.canvas.height);

      this.canvasCtx.lineWidth = 1;
      this.canvasCtx.strokeStyle = canvas_fg;

      this.canvasCtx.beginPath();

      const sliceWidth = this.canvas.width / bufferLength;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0;
        const y = v * this.canvas.height / 2;

        if (i === 0) {
          this.canvasCtx.moveTo(x, y);
        } else {
          this.canvasCtx.lineTo(x, y);
        }

        x += sliceWidth;
      }

      this.canvasCtx.lineTo(this.canvas.width, this.canvas.height / 2);
      this.canvasCtx.stroke();
    };

    draw();
  }

  ngOnDestroy(): void {
    this.stopSound();
  }
}