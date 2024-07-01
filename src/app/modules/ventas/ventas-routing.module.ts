import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FacturaPageComponent } from './pages/factura-page/factura-page.component';
import { SeguimientoPageComponent } from './pages/seguimiento-page/seguimiento-page.component';

const routes: Routes = [{
  path: 'facturas',
  component: FacturaPageComponent
}, {
  path: 'seguimiento',
  component: SeguimientoPageComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VentasRoutingModule { }
