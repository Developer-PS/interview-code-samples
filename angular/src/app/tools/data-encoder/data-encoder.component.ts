import { Component } from '@angular/core';
import { DataEncoderService } from '../../services/data-encoder.service';
import { AsyncPipe } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-data-encoder',
  standalone: true,
  imports: [
    AsyncPipe, 
    MatInputModule, 
    FormsModule
  ],
  templateUrl: './data-encoder.component.html',
  styleUrl: './data-encoder.component.scss'
})
export class DataEncoderComponent {
  encoding: string = ""
  decoding : string = ""
  
  constructor(public dataEncoder: DataEncoderService) {
    
  }

  encode() {
    this.dataEncoder.encode(this.encoding).subscribe(encoded => {
      this.decoding = encoded;
    })
  }

  decode() {
    this.dataEncoder.decode(this.decoding).subscribe(decoded => {
      this.encoding = decoded;
    })
  }
}
