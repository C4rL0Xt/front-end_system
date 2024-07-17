import { Component, Inject, OnInit } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import confetti from 'canvas-confetti';
import { Caracteristica } from '../../../../core/models/caracterisitca.model';

@Component({
  selector: 'app-rate-proveedor-dialog',
  templateUrl: './rate-proveedor-dialog.component.html',
  styleUrl: './rate-proveedor-dialog.component.css',
  animations: [
    trigger('fadeInOut', [
      state('void', style({
        opacity: 0,
        transform: 'scale(0.9) rotate(-5deg)'
      })),
      transition(':enter', [
        animate('600ms ease-out', style({
          opacity: 1,
          transform: 'scale(1) rotate(0)'
        }))
      ]),
      transition(':leave', [
        animate('600ms ease-in', style({
          opacity: 0,
          transform: 'scale(0.9) rotate(-5deg)'
        }))
      ])
    ]),
    trigger('slideInOut', [
      state('void', style({
        opacity: 0,
        transform: 'translateY(-20px)'
      })),
      transition(':enter', [
        animate('500ms ease-out', style({
          opacity: 1,
          transform: 'translateY(0)'
        }))
      ]),
      transition(':leave', [
        animate('500ms ease-in', style({
          opacity: 0,
          transform: 'translateY(-20px)'
        }))
      ])
    ])
  ]
})
export class RateProveedorDialogComponent {
  calidad = 0;
  precio = 0;
  cumplimiento = 0;

  disabled = false;
  max = 100;
  min = 0;
  showTicks = false;
  step = 1;
  thumbLabel = false;
  value = 0;

  constructor(
    public dialogRef: MatDialogRef<RateProveedorDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Caracteristica
  ) {
    if (data) {
      this.calidad = data.calidad || 0;
      this.precio = data.precio || 0;
      this.cumplimiento = data.cumplimiento || 0;
    }
  }

  ngAfterViewInit() {
    //this.checkForConfetti();
  }

  formatLabel(value: number): string {
    if (value >= 10) {
      return Math.round(value / 10) + 'k';
    }

    return `${value}`;
  }

  checkForConfetti() {
    const averageRate = (this.calidad + this.precio + this.cumplimiento) / 3;
    if (averageRate === 10) {
      //his.launchConfetti();
    }
  }

  launchConfetti() {
    confetti({
      particleCount: 300,
      spread: 100,
      origin: { y: 0.6 }
    });
  }

  onSave(): void {
    const averageRate = Math.round((this.calidad + this.precio + this.cumplimiento) / 3);
    if (averageRate === 10) {
      this.launchConfetti();
    }
    this.dialogRef.close({
      calidad: this.calidad,
      precio: this.precio,
      cumplimiento: this.cumplimiento,
      rate: averageRate
    });
  }
}
