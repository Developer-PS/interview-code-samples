import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

type ShapeDimensions = {
  diameter?: number;
  height?: number;
  width?: number;
  length?: number;
  outerDiameter?: number;
  innerDiameter?: number;
  volume?: number;
};

@Component({
  selector: 'app-cakecalculator',
  standalone: true,
  imports: [
    FormsModule,
    MatSelectModule,
    MatInputModule,
    MatCheckboxModule,
    CommonModule,
  ],
  templateUrl: './cakecalculator.component.html',
  styleUrl: './cakecalculator.component.scss'
})
export class CakecalculatorComponent {
  hideHeight = false;

  inputs = [
    { shape: 'round', dimensions: {} as ShapeDimensions, volume: 0, title: "Cake Tin in Recipe" },
    { shape: 'round', dimensions: {} as ShapeDimensions, volume: 0, title: "Cake Tin you have" }
  ];

  shapeOptions = ['round', 'rectangle', 'ring', 'custom'];

  onShapeChange(index: number) {
    this.inputs[index].dimensions = {};
    this.calculateVolume(index);
  }

  onDimensionChange(index: number) {
    this.calculateVolume(index);
  }

  calculateVolume(index: number) {
    const { shape, dimensions } = this.inputs[index];
    let volume = 0;

    switch (shape) {
      case 'round':
        if (dimensions.diameter && (!this.hideHeight && dimensions.height)) {
          const radius = dimensions.diameter / 2;
          const height = this.hideHeight ? 1 : dimensions.height;
          volume = Math.PI * Math.pow(radius, 2) * height;
        }
        break;
      case 'rectangle':
        if (dimensions.width && dimensions.length && (!this.hideHeight && dimensions.height)) {
          const height = this.hideHeight ? 1 : dimensions.height;
          volume = dimensions.width * dimensions.length * height;
        }
        break;
      case 'ring':
        if (dimensions.outerDiameter && dimensions.innerDiameter && (!this.hideHeight && dimensions.height)) {
          const outerRadius = dimensions.outerDiameter / 2;
          const innerRadius = dimensions.innerDiameter / 2;
          const height = this.hideHeight ? 1 : dimensions.height;
          volume = Math.PI * height * (Math.pow(outerRadius, 2) - Math.pow(innerRadius, 2));
        }
        break;
      case 'custom':
        if (dimensions.volume) {
          volume = dimensions.volume;
        }
        break;
    }

    this.inputs[index].volume = volume || 0;
  }

  get volumeFactor(): number {
    const v1 = this.inputs[0].volume || 1;
    const v2 = this.inputs[1].volume || 0;
    return v2 / v1;
  }
}
