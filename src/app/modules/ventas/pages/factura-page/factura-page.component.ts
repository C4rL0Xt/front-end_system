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
export class FacturaPageComponent implements OnInit{

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
    // Obtener los parámetros de la URL cuando se inicializa el componente
    this.route.params.subscribe(params => {
      this.idPedido = params['idpedido'];
      this.fechaEntrega = new Date(params['fechaentrega']);
    });
  }

  getFacturaData(): any {
    // Aquí podrías usar this.idPedido y this.fechaEntrega según lo necesario para tu lógica
    return {
      idPedido: this.idPedido,
      fechaEntrega: this.fechaEntrega
      // Otros datos de la factura si es necesario
    };
  }

  onUpdateTable(){
    this.updateFlag = !this.updateFlag;
  }


}
