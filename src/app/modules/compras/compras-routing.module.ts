import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProveedorPageComponent } from './pages/proveedor-page/proveedor-page.component';
import { CotizacionesPageComponent } from './pages/cotizaciones-page/cotizaciones-page.component';
import { DocumentosPageComponent } from './pages/documentos-page/documentos-page.component';

const routes: Routes = [
  { path: 'proveedor', component: ProveedorPageComponent },
  { path: 'cotizacion', component: CotizacionesPageComponent },
  { path: 'documents', component: DocumentosPageComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ComprasRoutingModule { }
