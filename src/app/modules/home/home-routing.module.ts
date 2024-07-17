import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminPageComponent } from '../admin/pages/admin-page/admin-page.component';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { ProductoPageComponent } from '../productos/pages/producto-page/producto-page.component';
import { TesthomeComponent } from './pages/home-test/testhome/testhome.component';
import { roleGuard } from '../../core/guards/role.guard';
import { VentasModule } from '../ventas/ventas.module';



const routes: Routes = [
  {
    path: 'user',
    component: TesthomeComponent,
    loadChildren: () => import('./home.module').then(m => m.HomeModule)
  }, {
    path: 'admin',
    component: AdminPageComponent,
    loadChildren: () => import('../admin/admin.module').then(m => m.AdminModule),
    canActivate: [roleGuard],
    data: { expectedRole: 'ROLE_ADMIN' }
  },
  {
    path: 'almacen',
    loadChildren: () => import('../productos/productos.module').then(m => m.ProductosModule),
    canActivate: [roleGuard],
    data: { expectedRole: 'ROL_ALMACEN' }
  }, {
    path: 'ventas',
    loadChildren: () => import('../ventas/ventas.module').then(m => m.VentasModule),
    canActivate: [roleGuard],
    data: { expectedRole: 'ROL_VENTA' }
  }, {
    path: 'compras',
    loadChildren: () => import('../compras/compras.module').then(m => m.ComprasModule),
    canActivate: [roleGuard],
    data: { expectedRole: 'ROL_COMPRA' }
  }, {
    path: 'transportistas',
    loadChildren: () => import('../transportista/transportista.module').then(m => m.TransportistaModule),
    canActivate: [roleGuard],
    data: { expectedRole: 'ROL_TRANSPORTISTA' }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
