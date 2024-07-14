
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { PedidoService } from '../../services/pedido-service/pedido.service';
import { Pedido } from '../../../../core/models/pedido.model';


export interface MetodoPago{
  idMetodoPago: number;
  metodo: string;
}

export interface EstadoEnvio{
  idEstadoEnvio: number;
  estado: string;
}

@Component({
  selector: 'app-view-pedido',
  templateUrl: './view-pedido.component.html',
  styleUrl: './view-pedido.component.css'
})
export class ViewPedidoComponent {

  metodosP: MetodoPago[] = [
    {
      idMetodoPago: 1,
      metodo: "Efectivo",  
    },
    {
      idMetodoPago: 2,
      metodo: "BBVA",  
    },   
    {
      idMetodoPago: 3,
      metodo: "ScotiaBank",  
    },   
    {
      idMetodoPago: 4,
      metodo: "BCP",  
    }
    ,
    {
      idMetodoPago: 5,
      metodo: "PayPal",  
    }
  ]

  estadosE: EstadoEnvio[] = [
    {
      idEstadoEnvio: 1,
      estado: "En preparación",  
    },
    {
      idEstadoEnvio: 2,
      estado: "En transito",  
    },
    {
      idEstadoEnvio: 3,
      estado: "Entregado",  
    },
    {
      idEstadoEnvio: 4,
      estado: "Listo para enviar",  
    }
  ]

  displayedColumns: string[] = ['idpedido', 'idcotizacion', 'idcliente', 'metodopago', 'estadoenvio', 'idempleado', 'fechaentrega', 'fechaemision'];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  pedidos: Pedido[] = []; 
 
  dataSource: MatTableDataSource<Pedido> = new MatTableDataSource();
  selectOption: string = '';

  constructor(private pedidoService: PedidoService){}

  loadPedidos(): void {
    this.pedidoService.getAllPedidos().subscribe((response: Pedido[]) => {
      console.log("Pedidos recibidos:  ", response);
      this.pedidos = response;
      this.dataSource = new MatTableDataSource(this.pedidos);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    })
  }

  onTabSelected(router: string): void {
    this.selectOption = router;
    console.log(this.selectOption);

  }
}
