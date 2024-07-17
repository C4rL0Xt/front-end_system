import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { HojaIngreso } from '../../../../core/models/hojaingreso.model';
import { Observable, catchError, map, of, tap, throwError } from 'rxjs';
import { Solicitud } from '../../../../core/models/solicitudCompra.model';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {

  private readonly URL = environment.api_almacen;
  private readonly URL_DOC = environment.api_documentos;

  constructor(
    private http: HttpClient
  ) { }


  createHojaIngreso(hoja: HojaIngreso): Observable<any> {
    return this.http.post(`${this.URL}/hoja/save`, hoja).pipe(
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
      ));
  }

  getAllHojaIngreso(): Observable<any[]> {
    return this.http.get(`${this.URL}/hoja/data`).pipe(
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
    );
  }

  getAllSolicitudCompra(): Observable<any[]> {
    return this.http.get(`${this.URL_DOC}/solicitud/listarconestado`).pipe(
      map((response: any) => {
        console.log("Respuesta completa de la API-compra: ", response);
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

  getAllGuiaRemision(): Observable<any[]> {
    return this.http.get(`${this.URL}/guias/listar`).pipe(
      map((response: any) => {
        console.log("Respuesta completa de la API-guia: ", response);
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

  getLastCodeSolicitud$(): Observable<string> {
    return this.http.get(`${this.URL_DOC}/solicitud/lastcode`, { responseType: 'text' }).pipe(
      tap((response: any) => {
        console.log('Last code de solicitud:', response);
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

  getLastCodeGuia$(): Observable<string> {
    return this.http.get(`${this.URL}/guias/lastcode`, { responseType: 'text' }).pipe(
      tap((response: any) => {
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



  createSolicitudCompra(solicitud: Solicitud): Observable<any> {
    return this.http.post(`${this.URL_DOC}/solicitud/guardar`, solicitud);
  }

  updateSolicitudCompra(solicitud: Solicitud): Observable<any> {
    return this.http.put(`${this.URL_DOC}/solicitud/actualizar`, solicitud);
  }

  createGuiaRemision(guia: any): Observable<any> {
    return this.http.post(`${this.URL}/guias/save`, guia);
  }

  updateGuiaRemision(guia: any): Observable<any> {
    return this.http.put(`${this.URL}/guias/update`, guia);
  }

  getAllSolicitudCompraPendiente$(): Observable<any[]> {
    return this.http.get(`${this.URL_DOC}/solicitud/listarpendientes`).pipe(
      map((response: any) => {
        console.log("Respuesta completa de la API-compra: ", response);
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
}
