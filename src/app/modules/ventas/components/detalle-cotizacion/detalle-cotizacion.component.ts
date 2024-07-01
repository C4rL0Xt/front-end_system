import { cotizacionVenta } from './../../../../core/models/cotizacionVenta';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DetalleCotizacionVenta } from '../../../../core/models/detalleCotizacionVenta';

@Component({
  selector: 'app-detalle-cotizacion',
  templateUrl: './detalle-cotizacion.component.html',
  styleUrl: './detalle-cotizacion.component.css'
})
export class DetalleCotizacionComponent {

  detalleForm: FormGroup = new FormGroup({});
  detalles: DetalleCotizacionVenta[] = [];

  constructor(private fb: FormBuilder, public dialogRef: MatDialogRef<DetalleCotizacionComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
    this.detalleForm = this.fb.group({
      idCotizacion: [{ value: data.cotizacionId, disabled: true }],
      idproducto: ['', Validators.required],
      cantidad: ['', Validators.required]
    });
  }

  agregarDetalle(): void {
    if (this.detalleForm.valid) {
      const detalleData = { ...this.detalleForm.value, idCotizacion: this.data.cotizacionId };
      this.detalles.push(detalleData);
      console.log('Detalle agregado con exito', detalleData);
      this.detalleForm.reset();
    } else {
      console.log('Formulario de detalle inválido.');
    }
  }

  cerrarPanel(): void {
    this.dialogRef.close();
  }

}
