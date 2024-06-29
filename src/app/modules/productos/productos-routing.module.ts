import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeProductoComponent } from './pages/home-producto/home-producto.component';
import { ProductoPageComponent } from './pages/producto-page/producto-page.component';
import { DocumentsComponent } from './pages/documents/documents.component';


const routes: Routes = [
  {
    path:'', redirectTo: 'inicio', pathMatch:'full'
  },{
    path:'inicio',component:HomeProductoComponent
  },{
    path:'productos',component:ProductoPageComponent
  },{
    path:'documentos', component:DocumentsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductosRoutingModule { }
