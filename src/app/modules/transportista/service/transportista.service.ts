import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, map, of, tap } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Transportista } from '../../../core/models/transportista.model';

@Injectable({
  providedIn: 'root'
})
export class TransportistaService {
  private readonly URL = environment.api_pedido;

  constructor(private httpClient: HttpClient) { }

  getPedidosEnviar(idempleado: string): Observable<any[]> {
    return this.httpClient.get(`${this.URL}/pedido/pedidosenviar/${idempleado}`).pipe(
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

  updatePedidosEnTransito(pedidos: any[], idEmpleado: String): Observable<any> {
    return this.httpClient.post(`${this.URL}/pedido/actualizarAEnTransito`, { pedidos, idEmpleado }).pipe(
      map((response: any) => {
        console.log("Pedidos actualizados: ", response);
        return response;
      }),
      catchError((err) => {
        alert('Error de conexion');
        const { status, statusText } = err;
        console.log('Algo paso revisar', [status, statusText]);
        return of({ msg: 'Error al actualizar pedidos' });
      })
    );
  }

  marcarPedidoEntregado(pedidos: any[], idpedido: String, idEmpleado: String): Observable<any> {
    return this.httpClient.post(`${this.URL}/pedido/pedidoEntregado`, { pedidos, idpedido, idEmpleado }).pipe(
      map((response: any) => {
        console.log("Pedido actualizado: ", response);
        return response;
      }),
      catchError((err) => {
        alert('Error de conexion');
        const { status, statusText } = err;
        console.log('Algo paso revisar', [status, statusText]);
        return of({ msg: 'Error al actualizar pedidos' });
      })
    );
  }



}
