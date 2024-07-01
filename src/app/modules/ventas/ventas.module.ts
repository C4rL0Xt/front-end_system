import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { VentasRoutingModule } from './ventas-routing.module';
import { PageClienteComponent } from './pages/page-cliente/page-cliente.component';
import { PagePedidoComponent } from './pages/page-pedido/page-pedido.component';
import { FacturaPageComponent } from './pages/factura-page/factura-page.component';
import { SeguimientoPageComponent } from './pages/seguimiento-page/seguimiento-page.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatNativeDateModule } from '@angular/material/core';
import { SharedModule } from '../../shared/shared.module';
import { FormNewFacComponent } from './components/form-new-fac/form-new-fac.component';
import { FormEditFacComponent } from './components/form-edit-fac/form-edit-fac.component';
import { TableFacComponent } from './components/table-fac/table-fac.component';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';

@NgModule({
  declarations: [
    PageClienteComponent,
    PagePedidoComponent,
    FacturaPageComponent,
    SeguimientoPageComponent,
    FormNewFacComponent,
    FormEditFacComponent,
    TableFacComponent
  ],
  imports: [
    CommonModule,
    VentasRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatGridListModule,
    MatNativeDateModule,
    MatCardModule,
    SharedModule,
    MatTableModule,
    MatIconModule,
    MatPaginatorModule
  ]
})
export class VentasModule { }
