import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VentasRoutingModule } from './ventas-routing.module';
import { PageClienteComponent } from './pages/page-cliente/page-cliente.component';
import { PagePedidoComponent } from './pages/page-pedido/page-pedido.component';
import { FacturaPageComponent } from './pages/factura-page/factura-page.component';
import { SeguimientoPageComponent } from './pages/seguimiento-page/seguimiento-page.component';


@NgModule({
  declarations: [
    PageClienteComponent,
    PagePedidoComponent,
    FacturaPageComponent,
    SeguimientoPageComponent
  ],
  imports: [
    CommonModule,
    VentasRoutingModule
  ]
})
export class VentasModule { }
