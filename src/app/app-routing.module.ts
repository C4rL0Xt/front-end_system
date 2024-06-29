import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TesthomeComponent } from './modules/home/pages/home-test/testhome/testhome.component';
import { LoginPageComponent } from './modules/auth/pages/login-page/login-page.component';
import { AuthPageComponent } from './modules/auth/pages/auth-page/auth-page.component';
import { HomePageComponent } from './modules/home/pages/home-page/home-page.component';

import { LogoutPageComponent } from './modules/auth/pages/logout-page/logout-page/logout-page.component';
import { HomeComponent } from './components/home/home.component';

const routes: Routes = [{
  path: 'home',
  component: HomePageComponent,
  loadChildren: () => import('./modules/home/home.module').then(m => m.HomeModule),
}, {
  path: 'main',
  component: LoginPageComponent,
  loadChildren: () => import('./modules/auth/auth.module').then(m => m.AuthModule)
}, {
  path: 'authorized', component: AuthPageComponent,
  loadChildren: () => import('./modules/auth/auth.module').then(m => m.AuthModule)
}, {
  path: 'access-denied',
  component: HomeComponent
}, {
  path: '',
  redirectTo: '/main',
  pathMatch: 'full'
}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
