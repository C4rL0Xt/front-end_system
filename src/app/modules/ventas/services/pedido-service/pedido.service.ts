import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, map, of, tap } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Pedido } from '../../../../core/models/pedido.model';

@Injectable({
  providedIn: 'root'
})
export class PedidoService {

  private readonly URL = environment.api_pedido;
  private readonly URL2 = environment.api_empleado;

  constructor(private httpClient: HttpClient) { }

  getAllPedidos(): Observable<any[]> {
    return this.httpClient.get(`${this.URL}/pedido/pedidos`).pipe(
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

  getTransportistasActivos(): Observable<any[]> {
    return this.httpClient.get(`${this.URL2}/empleados/listarActivos`).pipe(
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

  createPedido(pedido: Pedido): Observable<any> {
    return this.httpClient.post(`${this.URL}/pedido/insertar`, pedido);
  }

  updatePedido(idPedido: string, pedido: Pedido): Observable<any> {
    return this.httpClient.put(`${this.URL}/pedido/actualizar/${idPedido}`, pedido);
  }

  updateAListo(idPedido: string): Observable<any> {
    return this.httpClient.put(`${this.URL}/pedido/actualizarAListo/${idPedido}`, {});
  }
  
  getLastCodePedido$(): Observable<string> {
    return this.httpClient.get(`${this.URL}/pedido/ultimoCodigo`, { responseType: 'text' }).pipe(
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
}
