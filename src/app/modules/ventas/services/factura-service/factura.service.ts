import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { FacturaVenta } from '../../../../core/models/facturaVenta.model';

@Injectable({
  providedIn: 'root'
})
export class FacturaService {

  private facturaSubject = new BehaviorSubject<FacturaVenta[]>([]);
  facturas$ = this.facturaSubject.asObservable();

  private selectedFacturaSubject = new BehaviorSubject<FacturaVenta>(null);
  selectedFactura$ = this.selectedFacturaSubject.asObservable();

  constructor() { }

  setFacturas(facturas: FacturaVenta[]) {
    this.facturaSubject.next(facturas);
  }

  selectFactura(factura: FacturaVenta) {
    this.selectedFacturaSubject.next(factura);
  }
}
