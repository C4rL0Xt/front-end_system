import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ComprasRoutingModule } from './compras-routing.module';
import { CotizacionesPageComponent } from './pages/cotizaciones-page/cotizaciones-page.component';
import { DocumentosPageComponent } from './pages/documentos-page/documentos-page.component';
import { ProveedorPageComponent } from './pages/proveedor-page/proveedor-page.component';
import { SharedModule } from '../../shared/shared.module';
import { AddProveedorComponent } from './components/add-proveedor/add-proveedor.component';
import { MatCardModule } from '@angular/material/card';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
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
import { MatChipsModule, MatChipInputEvent } from '@angular/material/chips';
import { EditProveedorComponent } from './components/edit-proveedor/edit-proveedor.component';
import { AddSolCotComponent } from './components/add-sol-cot/add-sol-cot.component';
import { EditSolCotComponent } from './components/edit-sol-cot/edit-sol-cot.component';
import { EditDetSolCotComponent } from './components/edit-det-sol-cot/edit-det-sol-cot.component';
import { OrdenCompraComponent } from './components/orden-compra/orden-compra.component';
import { FacturaCompraComponent } from './components/factura-compra/factura-compra.component';
import { RateProveedorDialogComponent } from './components/rate-proveedor-dialog/rate-proveedor-dialog.component';
import { MatSliderModule } from '@angular/material/slider';

@NgModule({
  declarations: [
    CotizacionesPageComponent,
    DocumentosPageComponent,
    ProveedorPageComponent,
    AddProveedorComponent,
    EditProveedorComponent,
    AddSolCotComponent,
    EditSolCotComponent,
    EditDetSolCotComponent,
    OrdenCompraComponent,
    FacturaCompraComponent,
    RateProveedorDialogComponent
  ],
  imports: [
    CommonModule,
    ComprasRoutingModule,
    MatChipsModule,
    FormsModule,
    MatSliderModule,
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
export class ComprasModule { }
