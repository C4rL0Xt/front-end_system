import { Component } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { FacturaService } from '../../services/factura-service/factura.service';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-factura-page',
  templateUrl: './factura-page.component.html',
  styleUrl: './factura-page.component.css'
})
export class FacturaPageComponent {


  selectedTab: number = 1;
  selectOption: string = '';

  tabs = [
    { label: 'Nueva Factura', route: '/factura/nuevo' },
    { label: 'Editar Factura', route: '/factura/editar' }
  ]

  constructor(
    private fb: FormBuilder,
    private facturaService: FacturaService,
    private snackBar: MatSnackBar
  ) {

  }

  onTabSelected(router: string): void {
    this.selectOption = router;
    console.log(this.selectOption);

  }


}
