
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageSeguimientoComponent } from './pages/page-seguimiento/page-seguimiento.component';


const routes: Routes = [
  { path: 'seguimiento', component: PageSeguimientoComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TransportistaRoutingModule { }
