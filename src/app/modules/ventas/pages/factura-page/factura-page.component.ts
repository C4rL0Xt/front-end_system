import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { FacturaService } from '../../services/factura-service/factura.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-factura-page',
  templateUrl: './factura-page.component.html',
  styleUrl: './factura-page.component.css'
})
export class FacturaPageComponent implements OnInit {

  updateFlag = false;

  selectedTab: number = 1;
  selectOption: string = '/factura/nuevo';

  tabs = [
    { label: 'Gestión de factura', route: '/factura/nuevo' }
  ];

  idPedido: string;
  fechaEntrega: Date;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private facturaService: FacturaService,
    private snackBar: MatSnackBar
  ) {

  }

  onTabSelected(router: string): void {
    this.selectOption = router;
    console.log(this.selectOption);

  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.idPedido = params['idpedido'];
      this.fechaEntrega = new Date(params['fechaentrega']);
    });
  }

  getFacturaData(): any {
    return {
      idPedido: this.idPedido,
      fechaEntrega: this.fechaEntrega
    };
  }

  onUpdateTable() {
    this.updateFlag = !this.updateFlag;
  }


}
