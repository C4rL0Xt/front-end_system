import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup } from '@angular/forms';
import { EditSolCotComponent } from '../edit-sol-cot/edit-sol-cot.component';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { CotizacionCompraService } from '../../services/coti-compra-service/cotizacion-compra.service';
import { CotiBySoli } from '../../../../core/models/cotiBySoli.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DocumentService } from '../../../productos/services/document-service/document.service';
import { Solicitud } from '../../../../core/models/solicitudCompra.model';

@Component({
  selector: 'app-edit-det-sol-cot',
  templateUrl: './edit-det-sol-cot.component.html',
  styleUrl: './edit-det-sol-cot.component.css',
  animations: [
    trigger('fadeInOut', [
      state('void', style({
        opacity: 0
      })),
      transition(':enter, :leave', [
        animate(500)
      ])
    ])
  ]
})
export class EditDetSolCotComponent {

  form: FormGroup;
  estados: { value: string, viewValue: string }[] = [
    { value: 'accepted', viewValue: 'Aceptado' },
    { value: 'rejected', viewValue: 'Rechazado' },
    { value: 'pending', viewValue: 'Pendiente' }
  ];

  constructor(
    public dialogRef: MatDialogRef<EditDetSolCotComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private cotizacionService: CotizacionCompraService,
    private snackBar: MatSnackBar,
    private documentService: DocumentService
  ) {
    console.log('Data received in dialog:', data.quotation);
    this.form = this.fb.group({
      idsolicitudcompra: [data.quotation.idsolicitudcompra],
      nombreProveedor: [{ value: data.quotation.nombreProveedor, disabled: true }],
      fechaEntregaCotizacion: [{ value: new Date(data.quotation.fechaEntregaCotizacion).toISOString().substring(0, 10), disabled: true }],
      monto: [{ value: data.quotation.monto, disabled: true }],
      estado: [data.quotation.estado],
      rate: [{ value: data.quotation.rate, disabled: true }]
    });

    console.log('Form initialized with values:', this.form.value);
  }



  onSave(): void {

    const cotizacion: CotiBySoli = this.form.getRawValue();
    console.log('Saving with values:', cotizacion);
    this.cotizacionService.updateCotizacionCompra$(cotizacion).subscribe(
      (response: any) => {
        console.log('Response from update cotizacion compra:', response);
        this.snackBar.open('Cotizacion de compra actualizada', 'Cerrar', {
          duration: 3000,
        });

        this.dialogRef.close(response);
        this.dialogRef.close({ ...this.data.quotation, ...this.form.getRawValue() });
      },
      (error: any) => {
        console.error('Error updating cotizacion compra:', error);
        this.dialogRef.close(error);
      }
    );

  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
