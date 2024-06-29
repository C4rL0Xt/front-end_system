import { Injectable } from '@angular/core';
import { Product } from '../../../../core/models/product.model';
import { BehaviorSubject, Observable, catchError, map, of, tap } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { ProfileService } from '../../../../shared/services/profile/profile.service';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {

  private readonly URL = environment.api_almacen;


  private selectedProductSource = new BehaviorSubject<Product>(null);
  selectedProduct$ = this.selectedProductSource.asObservable();

  constructor(private httpClient: HttpClient, private profileService: ProfileService) {

  }



  getAllProducts(): Observable<any[]> {
    //obtener id de empleado logeado -> console.log('Desde el servicio de productos', this.profileService.getIdEmpleado());

    return this.httpClient.get(`${this.URL}/producto/pro-lot`).pipe(
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

  getAllCategories$(): Observable<any> {
    return this.httpClient.get(`${this.URL}/categorias/cat-com`).pipe(
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

  getAllForms$(): Observable<any> {
    return this.httpClient.get(`${this.URL}/formas/for-com`).pipe(
      map((response: any) => {
        console.log('Formas:', response);
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

  getLastCode$(): Observable<string> {
    return this.httpClient.get(`${this.URL}/producto/last-code`, { responseType: 'text' }).pipe(
      tap((response: any) => {
        console.log('Last Code:', response);
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

  getLastCodeLote$(): Observable<string> {
    return this.httpClient.get(`${this.URL}/lotes/last-code`, { responseType: 'text' }).pipe(
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

  createProduct(product: Product): Observable<any> {
    return this.httpClient.post(`${this.URL}/producto/guardar-p`, product);
  }

  updateProduct(product: Product): Observable<any> {
    return this.httpClient.put(`${this.URL}/producto/actualizar-p`, product);
  }

  getAllEstadoDisponibilidad$(): Observable<any> {
    return this.httpClient.get(`${this.URL}/estado/d-listar`).pipe(
      map((response: any) => {
        console.log('Estado Disponibilidad:', response);
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

  getAllEstadoOperativo$(): Observable<any> {
    return this.httpClient.get(`${this.URL}/estado/o-listar`).pipe(
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

  getAllEstadoSeguridad$(): Observable<any> {
    return this.httpClient.get(`${this.URL}/estado/s-listar`).pipe(
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


  selectProduct(product: Product) {
    this.selectedProductSource.next(product);
  }


}
