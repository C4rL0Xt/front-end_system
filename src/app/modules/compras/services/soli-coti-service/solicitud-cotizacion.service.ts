import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, of } from 'rxjs';
import { SolicitudCotizacion } from '../../../../core/models/SolicitudCotizacion.model';

@Injectable({
  providedIn: 'root'
})
export class SolicitudCotizacionService {

  private readonly URL = environment.api_coti;


  constructor(private http: HttpClient) { }

  getAllSolicitudesCotizacion$(): Observable<any[]> {
    return this.http.get(`${this.URL}/coti-c/all-dto`).pipe(
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

  createSolicitudCotizacion$(solicitudCotizacion: SolicitudCotizacion): Observable<any> {
    return this.http.post(`${this.URL}/coti-c/create`, solicitudCotizacion);
  }
}
