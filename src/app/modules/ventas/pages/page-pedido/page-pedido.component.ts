import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { cotizacionVenta } from '../../../../core/models/cotizacionVenta';



// Define the interface for solicitudes
interface Departamento {
  id: number;
  nombre: string;
}

@Component({
  selector: 'app-page-pedido',
  templateUrl: './page-pedido.component.html',
  styleUrl: './page-pedido.component.css'
})
export class PagePedidoComponent implements OnInit {

  selectedTab: number = 1;
  selectOption: string = '';

  tabs = [
    {
      label: 'Generar Cotizacion',
      route: '/ventas/generarCotizacion',
    },
    {
      label: 'Cotizaciones',
      route: '/ventas/cotizaciones',
    },
    {
      label: 'Pedidos',
      route: '/ventas/pedidos',
    },
  ];

  constructor(private fb: FormBuilder) {
  }

  ngOnInit(): void {
  }  

  onTabSelected(route: string): void {
    this.selectOption = route;
    console.log(`Navigating to ${route}`);
  }

}
