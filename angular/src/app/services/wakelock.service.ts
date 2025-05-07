import { Injectable } from '@angular/core';
import NoSleep from 'nosleep.js';

@Injectable({
  providedIn: 'root'
})
export class WakelockService {

  noSleep = new NoSleep();
  localStorageKey = "megaprism.nosleep.enabled"

  constructor() {
    console.log("constructor called")
    if(localStorage.getItem(this.localStorageKey) === "true") {
      console.log("wakelock enabled in constructor")
      this.noSleep.enable()
    } else {
      console.log("wakelock disabled in constructor")
      this.noSleep.disable()
    }
  }

  activate() {
    localStorage.setItem(this.localStorageKey, "true")
    this.noSleep.enable()
  }

  deactivate() {
    localStorage.setItem(this.localStorageKey, "false")
    this.noSleep.disable()
  }

  set active(value: boolean) {
    if(value) {
      this.activate()
    } else {
      this.deactivate()
    }
  }

  get active() : boolean {
    return this.noSleep.isEnabled
  }
}
