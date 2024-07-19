import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FacturaPageComponent } from './pages/factura-page/factura-page.component';
import { PageClienteComponent } from './pages/page-cliente/page-cliente.component';
import { PagePedidoComponent } from './pages/page-pedido/page-pedido.component';

import { FormCotizacionComponent } from './components/form-cotizacion/form-cotizacion.component';

const routes: Routes = [
  { path: 'clientes', component: PageClienteComponent },
  { path: 'clientes/:idcoti', component: PageClienteComponent },
  { path: 'pedidos', component: PagePedidoComponent },
  { path: 'facturas', component: FacturaPageComponent },
  { path: 'facturas/:idpedido/:fechaentrega', component: FacturaPageComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VentasRoutingModule { }
