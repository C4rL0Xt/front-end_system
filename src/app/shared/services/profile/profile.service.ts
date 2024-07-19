import { Injectable, OnInit } from '@angular/core';
import { TokenService } from '../../../modules/auth/services/token-service/token.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Observable, catchError, map, of } from 'rxjs';
import { Empleado } from '../../../core/models/empleado.model';

@Injectable({
  providedIn: 'root'
})
export class ProfileService implements OnInit {

  email_user: any;
  private readonly URL = environment.api_empleado;

  constructor(
    private tokenService: TokenService,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    this.email_user = localStorage.getItem('email');
    console.log('Desde el servicio profile -> ', this.email_user);
  }

  getEmployeeData(email: string): Observable<any> {
    return this.http.get(`${this.URL}/empleados/data/${email}`).pipe(
      map((response: any) => {
        this.setIdEmpleado(response.idempleado);
        localStorage.setItem('idempleado', response.idempleado);
        this.getIdEmpleado()
        console.log('Respuesta completa de la API: ', response);
        return response;
      }), catchError((err) => {
        alert('Error de conexion');
        const { status, statusText } = err;
        console.log('Algo paso revisar', [status, statusText]);
        return of([]);
      })
    )
  }

  setIdEmpleado(id: string): void {
    this.email_user = id;
  }

  getIdEmpleado(): string {
    return this.email_user;
  }
}
