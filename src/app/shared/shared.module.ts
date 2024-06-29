import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SideBarComponent } from './components/side-bar/side-bar.component';
import { HeaderUserComponent } from './components/header-user/header-user.component';
import { TabBarComponent } from './components/tab-bar/tab-bar.component';
import { RouterModule } from '@angular/router';
import { HeaderMainComponent } from './components/header-main/header-main.component';



@NgModule({
  declarations: [
    SideBarComponent,
    HeaderUserComponent,
    TabBarComponent,
    HeaderMainComponent
  ],
  imports: [
    CommonModule,
    RouterModule
  ],
  exports: [
    HeaderUserComponent,
    SideBarComponent,
    TabBarComponent,
    HeaderMainComponent
  ]
})
export class SharedModule { }
