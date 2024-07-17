import { Component } from '@angular/core';

@Component({
  selector: 'app-documentos-page',
  templateUrl: './documentos-page.component.html',
  styleUrl: './documentos-page.component.css'
})
export class DocumentosPageComponent {
  selectOption: string = '';
  selectedTab: number = 1;

  tabs = [
    {
      label: 'Ordenes de Compra',
      route: '/documents/oc',
    },
    {
      label: 'Factura de Compra',
      route: '/documents/fc',
    }
  ];


  onTabSelected(route: string): void {
    this.selectOption = route;
    console.log(`Navigating to ${route}`);
  }
}
