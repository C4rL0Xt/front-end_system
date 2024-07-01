import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

export interface Pedido {
  idpedido: string;
  idcotizacion: string;
  idcliente: string;
  metodopago: string;
  estadoenvio: string;
  idempleado: string;
  fechaentrega: Date;
  fechaemision: Date;
}



@Component({
  selector: 'app-seguimiento-page',
  templateUrl: './seguimiento-page.component.html',
  styleUrl: './seguimiento-page.component.css'
})
export class SeguimientoPageComponent implements OnInit {


  pedidos: Pedido[] = [
    {
      idpedido: "PED-001",
      idcotizacion: "COT-001",
      idcliente: "CLI-001",
      metodopago: "Tarjeta de crédito",
      estadoenvio: "En preparacion",
      idempleado: "EMP-001",
      fechaentrega: new Date('2024-07-15'),
      fechaemision: new Date('2024-07-01')
    },
    {
      idpedido: "PED-002",
      idcotizacion: "COT-002",
      idcliente: "CLI-002",
      metodopago: "Transferencia bancaria",
      estadoenvio: "Entregado",
      idempleado: "EMP-002",
      fechaentrega: new Date('2024-07-20'),
      fechaemision: new Date('2024-07-05')
    },
    {
      idpedido: "PED-003",
      idcotizacion: "COT-003",
      idcliente: "CLI-003",
      metodopago: "Efectivo",
      estadoenvio: "Listo para enviar",
      idempleado: "EMP-003",
      fechaentrega: new Date('2024-07-25'),
      fechaemision: new Date('2024-07-10')
    },
    {
      idpedido: "PED-004",
      idcotizacion: "COT-004",
      idcliente: "CLI-002",
      metodopago: "Tarjeta de débito",
      estadoenvio: "Entregado",
      idempleado: "EMP-001",
      fechaentrega: new Date('2024-07-30'),
      fechaemision: new Date('2024-07-15')
    },
    {
      idpedido: "PED-005",
      idcotizacion: "COT-005",
      idcliente: "CLI-001",
      metodopago: "Cheque",
      estadoenvio: "Entregado",
      idempleado: "EMP-002",
      fechaentrega: new Date('2024-08-01'),
      fechaemision: new Date('2024-07-20')
    }
  ];

  selectedTab: number = 1;
  selectOption: string = '';

  tabs = [
    { label: 'Seguimiento de pedidos', route: '/seguimiento/start' }
  ]

  dataSource: MatTableDataSource<Pedido> = new MatTableDataSource();
  pedidoForm: FormGroup;
  metodos = ['Cheque', 'Efectivo', 'Tarjeta de crédito', 'Tarjeta de débito', 'Transferencia bancaria'];
  estados = ['En preparacion', 'En transito', 'Entregado', 'Listo para enviar', 'En proceso'];
  displayedColumns: string[] = ['idpedido', 'idcotizacion', 'idcliente', 'metodopago', 'estadoenvio', 'idempleado', 'fechaentrega', 'fechaemision'];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    this.pedidoForm = this.fb.group({
      idpedido: [''],
      idcotizacion: [''],
      idcliente: [''],
      metodopago: [''],
      estadoenvio: [''],
      idempleado: [''],
      fechaentrega: [''],
      fechaemision: ['']
    });
  }

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource(this.pedidos);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  onTabSelected(router: string): void {
    this.selectOption = router;
    console.log(this.selectOption);

  }

  onRowClicked(pedido: Pedido): void {
    this.pedidoForm.patchValue({
      idpedido: pedido.idpedido,
      idcotizacion: pedido.idcotizacion,
      idcliente: pedido.idcliente,
      metodopago: pedido.metodopago,
      estadoenvio: pedido.estadoenvio,
      idempleado: pedido.idempleado,
      fechaentrega: pedido.fechaentrega,
      fechaemision: pedido.fechaemision
    });
  }

  onCancel(): void {
    this.pedidoForm.reset();
  }

  onSave(): void {
    this.snackBar.open('Pedido actualizado exitosamente', 'Cerrar', {
      duration: 2000,
      panelClass: ['mat-toolbar', 'mat-primary'],
      verticalPosition: 'top',
      horizontalPosition: 'center'
    });
  }

  onSubmit(): void {
    if (this.pedidoForm.valid) {
      console.log('Pedido actualizada exitosamente:', this.pedidoForm.getRawValue());
    }
  }

}
