import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, map, of, tap } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { FacturaVenta } from '../../../../core/models/facturaVenta.model';

@Injectable({
  providedIn: 'root'
})
export class FactCompraService {
  private readonly URL = environment.api_factura;
  constructor(private httpClient: HttpClient) { }

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
}
