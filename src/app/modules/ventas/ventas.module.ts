import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { VentasRoutingModule } from './ventas-routing.module';
import { PageClienteComponent } from './pages/page-cliente/page-cliente.component';
import { PagePedidoComponent } from './pages/page-pedido/page-pedido.component';
import { FacturaPageComponent } from './pages/factura-page/factura-page.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatDialogModule } from '@angular/material/dialog';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatListModule } from '@angular/material/list';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { FormCotizacionComponent } from './components/form-cotizacion/form-cotizacion.component';
import { DetalleCotizacionComponent } from './components/detalle-cotizacion/detalle-cotizacion.component';

import { FormPedidoComponent } from './components/form-pedido/form-pedido.component';
import { TablaCotizacionComponent } from './components/tabla-cotizacion/tabla-cotizacion.component';
import { FormNewFacComponent } from './components/form-new-fac/form-new-fac.component';
import { TableFacComponent } from './components/table-fac/table-fac.component';

@NgModule({
  declarations: [
    PageClienteComponent,
    PagePedidoComponent,
    FacturaPageComponent,
    FormCotizacionComponent,
    DetalleCotizacionComponent,
    FormPedidoComponent,
    TablaCotizacionComponent,
    FormNewFacComponent,
    TableFacComponent
  ],
  imports: [
    CommonModule,
    VentasRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    MatCardModule,
    MatFormFieldModule,
    MatAutocompleteModule,
    MatInputModule,
    MatButtonModule,
    MatTableModule,
    MatSelectModule,
    MatOptionModule,
    MatIconModule,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatGridListModule,
    MatSnackBarModule,
    MatSortModule,
    MatDialogModule,
    MatPaginatorModule
  ]
})
export class VentasModule { }
