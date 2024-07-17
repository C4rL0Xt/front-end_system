import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { FacturaService } from '../../services/factura-service/factura.service';
import { MatSnackBar } from '@angular/material/snack-bar';

export interface Estado {
  idEstado: number;
  estado: string;
}

@Component({
  selector: 'app-form-new-fac',
  templateUrl: './form-new-fac.component.html',
  styleUrl: './form-new-fac.component.css'
})
export class FormNewFacComponent implements OnInit{

  @Input() facturad: any;
  @Output() updateTableEvent = new EventEmitter<void>();

  agregarFacturaForm: FormGroup;

  estados: Estado[]= [
    {idEstado: 1,estado: "Pendiente"},
    {idEstado: 2,estado: "Pagado"},
    {idEstado: 3,estado: "Cancelado"}
  ]

  lastCode: string;

  constructor(
    private fb: FormBuilder,
    private facturaService: FacturaService,
    private snackBar: MatSnackBar
  ) {
    this.agregarFacturaForm = this.fb.group({
      idfactura: [{ value: '', disabled: true }],
      idpedido: [{ value: '', disabled: true }],
      idestadopago: [{ value: this.estados[0].estado, disabled: false}],
      fechalimite: [{ value: '', disabled: true }],
      fechapago: [''],
    });
  }

  ngOnInit(): void {
    this.loadLastCode();
    this.agregarFacturaForm.patchValue({
      idpedido: this.facturad.idPedido,
      fechalimite: this.facturad.fechaEntrega
    });
    console.log("Tabla cargada");
  }

  loadLastCode(): void {
    this.facturaService.getLastCodeFactura$().subscribe(code => {
      this.agregarFacturaForm.patchValue({ idfactura: code });
      this.generateCode(code);
      console.log('ultim Code:', code);
    });
    this.agregarFacturaForm.patchValue({ idfactura: this.lastCode });
  }

  generateCode(last_code: string): void {
    const lastCode = parseInt(last_code.substring(last_code.length - 3));
    const newCode = lastCode + 1;
    this.agregarFacturaForm.patchValue({ idfactura: `FV-00${newCode}` });
    this.agregarFacturaForm.get('idfactura').disable();
  }

  onSave() {
    if (this.agregarFacturaForm.valid) {
      const facturaData = this.agregarFacturaForm.getRawValue();

      const facturaModel = {
        idFactura: facturaData.idfactura,
        idPedido: facturaData.idpedido,
        idEstadoPago: this.getIdEstado(facturaData.idestadopago),
        fechaLimite: facturaData.fechalimite,
        fechaPago: facturaData.fechapago
      };

      console.log("El dto de factura: ",facturaModel);
      this.facturaService.createFactura(facturaModel).subscribe((response) => {
        console.log('Factura guardada exitosamente: ', response);
        this.agregarFacturaForm.reset();
        this.loadLastCode();
        this.updateTable();

      }, (error) => {
        console.error('Error al guardar la factura', error);
      }
      );

    } else {
      this.snackBar.open('Por favor completa el formulario correctamente', 'Cerrar', { duration: 2000 });

    }

    

  }



  onCancel() {
    this.agregarFacturaForm.reset();

  }

  onSubmit(): void {
    if (this.agregarFacturaForm.valid) {
      console.log('Factura guardado existosamente:', this.agregarFacturaForm.getRawValue());
    }
  }

  getEstadPago(id: number): string {
    const estado = this.estados.find(m => m.idEstado === id);
    return estado ? estado.estado : 'Desconocido';
  }


  getIdEstado(estadoi: string): number {
    const estado = this.estados.find(e => e.estado === estadoi);
    return estado.idEstado;
  }

  updateTable(){
    this.updateTableEvent.emit();
  }

}
