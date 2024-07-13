import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, map, of, tap } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Cliente } from '../../../core/models/cliente.model';

@Injectable({
  providedIn: 'root'
})
export class ClienteServiceService {

  private readonly URL = environment.api_cliente;

    constructor(private httpClient: HttpClient) {
  }

  getAllClients(): Observable<any[]> {
    return this.httpClient.get(`${this.URL}/clientes/listarDto`).pipe(
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

  getAllDepartments(): Observable<any> {
    return this.httpClient.get(`${this.URL}/departamentos/listar`).pipe(
      map((response: any) => {
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

  createClient(client: Cliente): Observable<any> {
    return this.httpClient.post(`${this.URL}/clientes/insertar`, client);
  }

  updateClient(client: Cliente): Observable<any> {
    return this.httpClient.put(`${this.URL}/clientes/actualizar`, client);
  }


}

