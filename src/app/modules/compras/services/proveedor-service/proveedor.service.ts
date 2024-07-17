import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, of } from 'rxjs';
import { Proveedor } from '../../../../core/models/proveedor.model';

@Injectable({
  providedIn: 'root'
})
export class ProveedorService {

  private readonly URL = environment.api_proveedor;

  constructor(
    private http: HttpClient
  ) { }


  getProveedores$(): Observable<any[]> {
    return this.http.get(`${this.URL}/proveedor/listarOrden`).pipe(
      map((response: any) => {
        console.log("Respues de la API PROVEEDOR", response);
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

  createProveedor$(proveedor: Proveedor): Observable<any> {
    return this.http.post(`${this.URL}/proveedor/create`, proveedor);

  }


  updateProveedor$(proveedor: Proveedor): Observable<any> {
    return this.http.put(`${this.URL}/proveedor/save`, proveedor);
  }
}
