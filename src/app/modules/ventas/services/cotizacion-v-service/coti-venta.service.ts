import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, map, of, catchError, tap, throwError } from 'rxjs';
import { cotizacionVenta } from '../../../../core/models/cotizacionVenta';

@Injectable({
  providedIn: 'root'
})
export class CotiVentaService {

  private readonly URL = environment.api_coti;

  constructor(private http: HttpClient) { }


  getAllCotizacionesVenta$(): Observable<any[]> {
    return this.http.get(`${this.URL}/coti-v/details-full`).pipe(
      map((response: any) => {
        console.log("Respuesta completa de la API-coti: ", response);
        return response;
      }),
      catchError((err) => {
        alert('Error de conexion');
        const { status, statusText } = err;
        console.log('Algo paso revisar', [status, statusText]);
        return of([]);
      })
    );

  }

  getLastCodeCotiVenta$(): Observable<string> {
    return this.http.get(`${this.URL}/coti-v/last-code`, { responseType: 'text' }).pipe(
      tap((response: any) => {
        console.log("Codigo de lote ultimo: ", response);
        return response;
      }),
      catchError((err) => {
        alert('Error de conexion');
        const { status, statusText } = err;
        console.log('Algo paso revisar con la coticode', [status, statusText]);
        return of([]);

      })
    );
  }

  getMontoCotizacionVenta(cotizacionVenta: cotizacionVenta): Observable<cotizacionVenta> {
    return this.http.post<cotizacionVenta>(`${this.URL}/coti-v/calculate`, cotizacionVenta);
  }

  createCotizacionVenta(cotizacion: cotizacionVenta): Observable<any> {
    return this.http.post(`${this.URL}/coti-v/create`, cotizacion).pipe(
      catchError((err: HttpErrorResponse) => {
        let errorMessage = '';
        if (err.error instanceof ErrorEvent) {
          errorMessage = `Error: ${err.error.message}`;
        } else {
          errorMessage = `Error: ${err.status} ${err.message}`;
        }

        console.log(errorMessage);
        return throwError(() => new Error(errorMessage));
      }
      )
    );
  }


}
