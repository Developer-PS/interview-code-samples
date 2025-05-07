import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

const upper = "ABCDEFGHJKLMNPQRSTUVWXYZ";
const lower = "abcdefghijkmnpqrstuvwxyz";
const numbers = "123456789";
const symbols = "!#*+-:=?_";

@Component({
  selector: 'app-passwordgenerator',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './passwordgenerator.component.html',
  styleUrl: './passwordgenerator.component.scss'
})
export class PasswordgeneratorComponent {
  useUppercase = true;
  useLowercase = true;
  useNumbers = true;
  useSymbols = true;
  useCustomChars = false;
  password_length = 20;
  password = "WuD9s*N7Qgsy7sL2A8Ch"
  
  constructor() {
    this.generatePW()
  }

  copyPW() {
    navigator.clipboard.writeText(this.password)
  }

  generatePW() {
    
  }

  printPW() {
    let newWin = window.open('','Print-Window');
    newWin?.document.open();
    newWin?.document.write('<html><body onload="window.print()">' + this.password + '</body><style>html{word-break: break-all;}</style></html>');
    newWin?.document.close();
    setTimeout(function(){newWin?.close();},10);
  }
}
