import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FacturaService } from '../../services/factura-service/factura.service';

@Component({
  selector: 'app-form-edit-fac',
  templateUrl: './form-edit-fac.component.html',
  styleUrl: './form-edit-fac.component.css'
})
export class FormEditFacComponent implements OnInit {

  facturaForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private facturaService: FacturaService
  ) {
    this.facturaForm = this.fb.group({
      codigo: [''],
      codigopedido: [''],
      estadopago: [''],
      fechalimitedepago: [''],
      fechapago: [''],
    });
  }

  ngOnInit(): void {


    this.facturaService.selectedFactura$.subscribe(factura => {
      if (factura) {
        this.facturaForm.patchValue(factura);
      }
    });
  }

  onSubmit() {
    const factura = this.facturaForm.value;

  }

  onCancel() {
    this.facturaForm.reset();
  }

}
