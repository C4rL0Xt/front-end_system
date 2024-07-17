import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map, Observable, of, throwError } from 'rxjs';
import { CotiBySoli } from '../../../../core/models/cotiBySoli.model';

@Injectable({
  providedIn: 'root'
})
export class CotizacionCompraService {

  private readonly URL = environment.api_coti;

  constructor(
    private http: HttpClient
  ) { }

  getCotiBySoli(idSolicitud: string): Observable<any> {
    return this.http.get(`${this.URL}/coti-c/dto/${idSolicitud}`).pipe(
      map((response: any) => {
        console.log('response de dto cotis compra', response);
        return response;
      })
    );
  }

  updateCotizacionCompra$(cotizacion: CotiBySoli): Observable<any> {
    return this.http.post(`${this.URL}/coti-c/update`, cotizacion).pipe(
      map((response: any) => {
        console.log('response de update cotizacion compra', response);
        return response;
      }),
      catchError((error: HttpErrorResponse) => {
        console.error('Error updating cotizacion compra', error);
        return throwError(error);
      })
    );
  }

}
