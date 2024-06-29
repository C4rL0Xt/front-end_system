import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
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

import { ProductosRoutingModule } from './productos-routing.module';
import { ProductoPageComponent } from './pages/producto-page/producto-page.component';
import { SharedModule } from '../../shared/shared.module';
import { HomeProductoComponent } from './pages/home-producto/home-producto.component';
import { DocumentsComponent } from './pages/documents/documents.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProductoFormComponent } from './components/forms-p/producto-form/producto-form.component';
import { MatListModule } from '@angular/material/list';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { LotTableViewComponent } from './components/view-prod/lot-table-view/lot-table-view.component';
import { ProdTableViewComponent } from './components/view-prod/prod-table-view/prod-table-view.component';
import { SearchComponent } from './components/product-search/search/search.component';
import { EditproductoComponent } from './components/edit-p/editproducto/editproducto.component';


@NgModule({
  declarations: [
    ProductoPageComponent,
    DocumentsComponent,
    HomeProductoComponent,
    ProductoFormComponent,
    LotTableViewComponent,
    ProdTableViewComponent,
    SearchComponent,
    EditproductoComponent
  ],
  imports: [
    CommonModule,
    ProductosRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
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
export class ProductosModule { }
