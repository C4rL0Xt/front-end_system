import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, map, of, catchError, tap, throwError } from 'rxjs';
import { cotizacionVenta } from '../../../../core/models/cotizacionVenta';
import { DetalleCotizacionVenta } from '../../../../core/models/detalleCotizacionVenta';

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

  getCotizacionById(id: string): Observable<any> {
    return this.http.get(`${this.URL}/coti-v/buscar-coti-dto/${id}`).pipe(
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

  updateCotizacionVenta(cotizacion: cotizacionVenta): Observable<any> {
    return this.http.put(`${this.URL}/coti-v/update`, cotizacion);
  }

  deleteDetalleCotizacionVenta(detalle: DetalleCotizacionVenta): Observable<any> {
    return this.http.delete(`${this.URL}/coti-v/delete/detalle`, { body: detalle });
  }


  getCotizacionPdf(id: string): Observable<any> {
    return this.http.get(`${this.URL}/coti-v/pdf/${id}`, { responseType: 'blob' });
  }

}
