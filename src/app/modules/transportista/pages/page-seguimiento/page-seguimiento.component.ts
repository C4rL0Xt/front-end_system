import { PedidoService } from './../../../ventas/services/pedido-service/pedido.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Pedido } from '../../../../core/models/pedido.model';
import { TransportistaService } from '../../service/transportista.service';
import { ProfileService } from '../../../../shared/services/profile/profile.service';

export interface MetodoPago {
  idMetodoPago: number;
  metodo: string;
}

export interface EstadoEnvio {
  idEstadoEnvio: number;
  estado: string;
}

@Component({
  selector: 'app-page-seguimiento',
  templateUrl: './page-seguimiento.component.html',
  styleUrl: './page-seguimiento.component.css'
})
export class PageSeguimientoComponent implements OnInit {

  metodosP: MetodoPago[] = [
    { idMetodoPago: 1, metodo: "Efectivo" },
    { idMetodoPago: 2, metodo: "BBVA" },
    { idMetodoPago: 3, metodo: "ScotiaBank" },
    { idMetodoPago: 4, metodo: "BCP" },
    { idMetodoPago: 5, metodo: "PayPal" }
  ]

  estadosE: EstadoEnvio[] = [
    { idEstadoEnvio: 1, estado: "En preparación" },
    { idEstadoEnvio: 2, estado: "En transito" },
    { idEstadoEnvio: 3, estado: "Entregado" },
    { idEstadoEnvio: 4, estado: "Listo para enviar" }
  ]

  idpedido: string;
  idcotizacion: string;
  idcliente: string;
  metodopago: string;
  estadoenvio: string;
  idempleado: string;
  fechaentrega: Date;
  fechaemision: Date;

  selectedTab: number = 1;
  selectOption: string = '';
  pedidos: Pedido[] = [];
  idEmpleado: String = '';

  tabs = [
    { label: 'Seguimiento de pedidos', route: '/seguimiento/start' }
  ]

  dataSource: MatTableDataSource<Pedido> = new MatTableDataSource();
  pedidoForm: FormGroup;
  displayedColumns: string[] = ['idpedido', 'idcotizacion', 'idcliente', 'metodopago', 'estadoenvio', 'idempleado', 'fechaentrega', 'fechaemision'];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private pedidoService: TransportistaService,
    private profileService: ProfileService
  ) { }

  ngOnInit(): void {
    this.loadPedidosListosYEnTransito();
  }

  onTabSelected(router: string): void {
    this.selectOption = router;
    console.log(this.selectOption);

  }



  pedidoEntregado(): void {
    this.loadIDEmpleado();
    this.pedidoService.marcarPedidoEntregado(this.pedidos, this.idpedido, this.idEmpleado).subscribe(
      response => {
        console.log('Pedido entregado:', response);
        console.log("Enviando id de trams: ", this.idEmpleado);
        this.snackBar.open('Pedidos actualizados a En tránsito', 'Cerrar', { duration: 3000 });
        this.loadPedidosListosYEnTransito();
      },
      error => {
        console.error('Error al actualizar pedidos:', error);
        this.snackBar.open('Error al actualizar pedidos', 'Cerrar', { duration: 3000 });
      }
    );
    this.idpedido = "";
  }

  iniciarEnvio(): void {
    this.loadIDEmpleado();
    this.pedidoService.updatePedidosEnTransito(this.pedidos, this.idEmpleado).subscribe(
      response => {
        console.log('Pedidos actualizados:', response);
        this.snackBar.open('Pedidos actualizados a En tránsito', 'Cerrar', { duration: 3000 });
        this.loadPedidosListosYEnTransito(); // Recargar la lista de pedidos
      },
      error => {
        console.error('Error al actualizar pedidos:', error);
        this.snackBar.open('Error al actualizar pedidos', 'Cerrar', { duration: 3000 });
      }
    );

  }

  loadIDEmpleado() {
    this.idEmpleado = this.profileService.getIdEmpleado();
  }

  loadPedidosListosYEnTransito() {
    this.pedidoService.getPedidosEnviar(localStorage.getItem('idempleado')).subscribe((response: Pedido[]) => {
      console.log("Pedidos recibidos:  ", response);
      this.pedidos = response;
      this.dataSource = new MatTableDataSource(this.pedidos);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    })
  }

  onRowClicked(pedido: Pedido): void {

    this.idpedido = pedido.idPedido,
      this.idcotizacion = pedido.idCotizacion,
      this.idcliente = pedido.idCliente,
      this.metodopago = this.getMetodoPago(pedido.idMetodoPago),
      this.estadoenvio = this.getEstadoEnvio(pedido.idEstadoEnvio),
      this.idempleado = pedido.idEmpleado,
      this.fechaentrega = pedido.fechaEntrega,
      this.fechaemision = pedido.fechaEmision
    console.log("Pedido seleccionado: ", this.idpedido);

  }

  getEstadoEnvio(id: number): string {
    const estado = this.estadosE.find(e => e.idEstadoEnvio === id);
    return estado ? estado.estado : 'Desconocido';
  }

  getMetodoPago(id: number): string {
    const metodo = this.metodosP.find(m => m.idMetodoPago === id);
    return metodo ? metodo.metodo : 'Desconocido';
  }

  getIdMetodoPago(metodoN: string): number {
    console.log("Metodos de pago: ", metodoN);
    const metodo = this.metodosP.find(m => m.metodo === metodoN);
    if (metodo) {
      return metodo.idMetodoPago;
    } else {
      console.warn(`Método de pago "${metodoN}" no encontrado.`);
      return 0; // O cualquier valor predeterminado que maneje el caso de error
    }
  }

  getIdEstadoEnvio(estadoN: string): number {
    const estado = this.estadosE.find(e => e.estado === estadoN);
    return estado.idEstadoEnvio;
  }
}
