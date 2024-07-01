import { Component } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { FacturaService } from '../../services/factura-service/factura.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-form-new-fac',
  templateUrl: './form-new-fac.component.html',
  styleUrl: './form-new-fac.component.css'
})
export class FormNewFacComponent {

  facturaForm: FormGroup;

  estados = ['Pendiente', 'Pagado', 'Cancelado']
  constructor(
    private fb: FormBuilder,
    private facturaService: FacturaService,
    private snackBar: MatSnackBar
  ) {
    this.facturaForm = this.fb.group({
      facturaCodigo: [''],
      pedidoCodigo: [''],
      estadoPago: ['Pendiente'],
      fechaLimite: [''],
      fechaPago: [''],
    });
  }

  onSave() {
    this.snackBar.open('Factura guardada', 'Cerrar', {
      duration: 2000,
      panelClass: ['mat-toolbar', 'mat-primary'],
      verticalPosition: 'top',
      horizontalPosition: 'center'
    });


  }
  onCancel() {
    this.facturaForm.reset();

  }

  onSubmit(): void {
    if (this.facturaForm.valid) {


      console.log('Factura guardado existosamente:', this.facturaForm.getRawValue());
    }


  }


}
