import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { map, Observable, startWith } from 'rxjs';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent, } from '@angular/material/chips';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

@Component({
  selector: 'app-cotizaciones-page',
  templateUrl: './cotizaciones-page.component.html',
  styleUrl: './cotizaciones-page.component.css'
})
export class CotizacionesPageComponent implements OnInit {
  selectOption: string = '';
  selectedTab: number = 1;



  tabs = [
    {
      label: 'Agregar Solicitud Cotizacion',
      route: '/cotizacion/new',
    },
    {
      label: 'Editar Solicitud Cotizacion',
      route: '/cotizacion/edit',
    }
  ];

  constructor(private fb: FormBuilder) {

  }

  ngOnInit() {

  }




  onTabSelected(route: string): void {
    this.selectOption = route;
    console.log(`Navigating to ${route}`);
  }
}
