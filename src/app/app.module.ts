import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule, provideHttpClient, withInterceptors } from '@angular/common/http'
import { resourceInterceptor } from './modules/auth/interceptors/resource.interceptor';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';


@NgModule({
  declarations: [
    AppComponent

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule],
  providers: [
    provideHttpClient(
      withInterceptors([resourceInterceptor])
    ),
    provideAnimationsAsync()
    //{provide: HTTP_INTERCEPTORS, useClass: resourceInterceptor, multi:true}
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
