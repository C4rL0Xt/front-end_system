import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, map, of, tap } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { FacturaVenta } from '../../../../core/models/facturaVenta.model';

@Injectable({
  providedIn: 'root'
})
export class FacturaService {

  private readonly URL = environment.api_factura;

  private facturaSubject = new BehaviorSubject<FacturaVenta[]>([]);
  facturas$ = this.facturaSubject.asObservable();

  private selectedFacturaSubject = new BehaviorSubject<FacturaVenta>(null);
  selectedFactura$ = this.selectedFacturaSubject.asObservable();

  constructor(private httpClient: HttpClient) { }

  getAllFacturas(): Observable<any[]> {
    return this.httpClient.get(`${this.URL}/facturas/listar`).pipe(
      map((response: any) => {
        console.log("Respuesta completa de la API: ", response);
        return response;
      }),
      catchError((err) => {
        alert('Error de conexion');
        const { status, statusText } = err;
        console.log('Algo paso revisar', [status, statusText]);
        return of([]);
      })
    )
  }

  getAllFacturasCompra(): Observable<any[]> {
    return this.httpClient.get(`${this.URL}/facturasCompra/listar`).pipe(
      map((response: any) => {
        console.log("Respuesta completa de la API: ", response);
        return response;
      }),
      catchError((err) => {
        alert('Error de conexion');
        const { status, statusText } = err;
        console.log('Algo paso revisar', [status, statusText]);
        return of([]);
      })
    )
  }


  createFactura(factura: FacturaVenta): Observable<any> {
    return this.httpClient.post(`${this.URL}/facturas/crear`, factura);
  }

  updateFactura(factura:FacturaVenta): Observable<any> {
    return this.httpClient.put(`${this.URL}/facturas/actualizar`,factura);
  }

  getLastCodeFactura$(): Observable<string> {
    return this.httpClient.get(`${this.URL}/facturas/lastCode`, { responseType: 'text' }).pipe(
      tap((response: any) => {
        return response;
      }
      ),
      catchError((err) => {
        alert('Error de conexion');
        const { status, statusText } = err;
        console.log('Algo paso revisar', [status, statusText]);
        return of([]);
      })
    );
  }
  setFacturas(facturas: FacturaVenta[]) {
    this.facturaSubject.next(facturas);
  }

  selectFactura(factura: FacturaVenta) {
    this.selectedFacturaSubject.next(factura);
  }
}
