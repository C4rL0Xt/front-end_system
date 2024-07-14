import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-proveedor-page',
  templateUrl: './proveedor-page.component.html',
  styleUrl: './proveedor-page.component.css'
})
export class ProveedorPageComponent implements OnInit {

  selectOption: string = '';
  selectedTab: number = 1;

  tabs = [
    {
      label: 'Agregar Proveedor',
      route: '/proveedor/new',
    },
    {
      label: 'Editar Proveedor',
      route: '/proveedor/edit',
    }
  ];

  constructor() { }

  ngOnInit() {

  }

  onTabSelected(route: string): void {
    this.selectOption = route;
    console.log(`Navigating to ${route}`);
  }

}
