import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Order } from '../../../../core/models/ordenCompra.model';

@Injectable({
  providedIn: 'root'
})
export class OrdenCompraService {

  private readonly URL = environment.api_documentos;

  constructor(
    private http: HttpClient
  ) { }



  getOrdersCompra$(): Observable<any[]> {
    return this.http.get(`${this.URL}/ordencompra/all`).pipe(
      map((response: any) => {
        console.log('response de ordenes de compra', response);
        return response;
      }
      )
    );
  }

  createOrderCompra$(order: Order): Observable<any> {
    return this.http.post(`${this.URL}/ordencompra/save`, order).pipe(
      map((response: any) => {
        console.log('response de create orden compra', response);
        return response;
      })
    );
  }
}
