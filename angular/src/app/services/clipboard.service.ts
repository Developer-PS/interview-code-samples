import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ClipboardService {

  // originally wanted to implement more functionality and check if clipboard is even available, but whatever...

  constructor() { }

  copyText(text: string) {
    console.log(text)
    navigator.clipboard.write([new ClipboardItem({ 'text/plain': text })])
  }

  copyImage(dataURL: string) {
    fetch(dataURL)
      .then(rsp => rsp.blob())
      .then(blob => navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]))
  }
}
