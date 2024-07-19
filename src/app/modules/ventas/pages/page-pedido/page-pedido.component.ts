import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { cotizacionVenta } from '../../../../core/models/cotizacionVenta';
import { Router } from '@angular/router';

interface Departamento {
  id: number;
  nombre: string;
}

interface Tab {
  label: string;
  route: string;
}

@Component({
  selector: 'app-page-pedido',
  templateUrl: './page-pedido.component.html',
  styleUrl: './page-pedido.component.css'
})
export class PagePedidoComponent implements OnInit {

  @Output() seleccionado = new EventEmitter<Tab>();
  @Output() irAlSide = new EventEmitter<String>();

  selectedTab: number = 1;
  selectOption: string = '';
  idCotizacion: string = '';
  dni: string = '';

  tabs = [
    {
      label: 'Generar Cotizacion',
      route: '/ventas/pedidos/generarCotizacion',
    },
    {
      label: 'Cotizaciones',
      route: '/ventas/pedidos/cotizaciones',
    },
    {
      label: 'Pedidos',
      route: '/ventas/pedidos/pedidos',
    }
  ];

  constructor(private fb: FormBuilder, private router: Router) {
  }

  ngOnInit(): void {
  }

  onTabSelected(route: string): void {
    this.selectOption = route;
    console.log(`Navigating to ${route}`);
  }

  seleccionarTab(tab: { label: string, route: string }): void {
    this.seleccionado.emit(tab); // Emitir el evento con el objeto tab seleccionado
  }

  onNavigateToPedidos(event: { idcotizacion: string, dni: string }) {
    this.idCotizacion = event.idcotizacion;
    this.dni = event.dni;
    this.onTabSelected('/ventas/pedidos/pedidos');
    this.seleccionarTab({ label: 'Pedidos', route: '/ventas/pedidos/pedidos' });
  }


  onNavigateToFacturas(event: { idpedido: string, fechaentrega: Date }) {
    const idpedido = event.idpedido;
    const fechaentrega = event.fechaentrega;
    const route = `/home/ventas/facturas/${idpedido}/${fechaentrega.toISOString().split('T')[0]}`;
    this.router.navigate([route]);
  }

  navigateToClientes(event: string) {
    const idcoti = event;
    const route = `/home/ventas/clientes/${idcoti}`;
    this.router.navigate([route]);
  }
}
