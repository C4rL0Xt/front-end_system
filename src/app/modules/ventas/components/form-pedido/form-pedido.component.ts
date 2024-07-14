import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Pedido } from '../../../../core/models/pedido.model';
import { PedidoService } from '../../services/pedido-service/pedido.service';

export interface MetodoPago{
  idMetodoPago: number;
  metodo: string;
}

export interface EstadoEnvio{
  idEstadoEnvio: number;
  estado: string;
}

@Component({
  selector: 'app-form-pedido',
  templateUrl: './form-pedido.component.html',
  styleUrl: './form-pedido.component.css'
})
export class FormPedidoComponent implements OnInit, OnChanges{

  @Input() idCotizacion: string;

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


  selectedTab: number = 1;
  selectOption: string = '';

  tabs = [
    { label: 'Seguimiento de pedidos', route: '/seguimiento/start' }
  ]

  dataSource: MatTableDataSource<Pedido> = new MatTableDataSource();
  agregarPedidoForm: FormGroup;
  lastCode: string;

  displayedColumns: string[] = ['idpedido', 'idcotizacion', 'idcliente', 'metodopago', 'estadoenvio', 'idempleado', 'fechaentrega', 'fechaemision'];
 
  pedidos: Pedido[] = []; 

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private pedidoService: PedidoService
  ) {
    this.agregarPedidoForm = this.fb.group({
      idpedido: [{ value: '', disabled: true }],
      idcotizacion: [{ value: '', disabled: true }],
      idcliente: ['',Validators.required],
      metodopago: ['',Validators.required],
      estadoenvio: [{ value: this.estadosE[0], disabled: true }],
      idempleado: [''],
      fechaentrega: ['',Validators.required],
      fechaemision: ['',Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadLastCode();
    this.loadPedidos();
    console.log("Tabla cargada");
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['idCotizacion'] && changes['idCotizacion'].currentValue) {
      this.updatePedidoForm(this.idCotizacion);
    }
  }

  onTabSelected(router: string): void {
    this.selectOption = router;
    console.log(this.selectOption);

  }

  loadLastCode(): void {
    this.pedidoService.getLastCodePedido$().subscribe(code => {
      this.agregarPedidoForm.patchValue({ idcodigo: code });    
      this.generateCode(code);
      console.log('ultim Code:', code);
    });

    this.agregarPedidoForm.patchValue({ idpedido: this.lastCode });
  }

  generateCode(last_code: string): void {
    const lastCode = parseInt(last_code.substring(last_code.length - 3));
    const newCode = lastCode + 1;
    this.agregarPedidoForm.patchValue({ idpedido: `PE-00${newCode}` });
    this.agregarPedidoForm.get('idpedido').disable();
  }

  loadPedidos(): void {
    this.pedidoService.getAllPedidos().subscribe((response: Pedido[]) => {
      console.log("Pedidos recibidos:  ", response);
      this.pedidos = response;
      this.dataSource = new MatTableDataSource(this.pedidos);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    })
  }

  onRowClicked(pedido: Pedido): void {
    this.agregarPedidoForm.patchValue({
      idpedido: pedido.idPedido,
      idcotizacion: pedido.idCotizacion,
      idcliente: pedido.idCliente,
      metodopago: pedido.idMetodoPago,
      estadoenvio: pedido.idEstadoEnvio,
      idempleado: pedido.idEmpleado,
      fechaentrega: pedido.fechaEntrega,
      fechaemision: pedido.fechaEmision
    });
  }

  onCancel(): void {
    this.agregarPedidoForm.reset();
  }

  onSave(): void {
    if (this.agregarPedidoForm.valid) {
      const pedidoData = this.agregarPedidoForm.getRawValue();
      const pedidoModel = {
        idPedido: pedidoData.idpedido,
        idCotizacion: pedidoData.idcotizacion,
        idCliente: pedidoData.idcliente,
        idMetodoPago: this.getIdMetodoPago(pedidoData.metodopago),
        idEstadoEnvio: this.getIdEstadoEnvio(pedidoData.esstadoenvio),
        idEmpleado: pedidoData.idempleado,
        fechaEntrega: pedidoData.fechaentrega,
        fechaEmision: pedidoData.fechaemision
      };

      console.log(pedidoModel);
      this.pedidoService.createPedido(pedidoModel).subscribe((response) => {
        console.log('Pedido save exitosamente: ', response);
        this.agregarPedidoForm.reset();
        this.loadLastCode();

      }, (error) => {
        console.error('Error al guardar el pedido', error);
      }
    );

    }else {
      this.snackBar.open('Por favor completa el formulario correctamente', 'Cerrar', { duration: 2000 });

    }
  }

  actualizar(): void {
    this.snackBar.open('Pedido actualizado exitosamente', 'Cerrar', {
      duration: 2000,
      panelClass: ['mat-toolbar', 'mat-primary'],
      verticalPosition: 'top',
      horizontalPosition: 'center'
    });
  }

  onSubmit(): void {
    if (this.agregarPedidoForm.valid) {
      console.log('Pedido guardado exitosamente:', this.agregarPedidoForm.getRawValue());
    }
  }

  private updatePedidoForm(idCotizacion: string): void {
      this.agregarPedidoForm.patchValue({
        idcotizacion: idCotizacion
      });
  }

  getMetodoPago(id: number): string {
    const metodo = this.metodosP.find(m => m.idMetodoPago === id);
    return metodo ? metodo.metodo : 'Desconocido';
  }

  getEstadoEnvio(id: number): string {
    const estado = this.estadosE.find(e => e.idEstadoEnvio === id);
    return estado ? estado.estado : 'Desconocido';
  }

  getIdMetodoPago(metodoN: string): number {
    const metodo = this.metodosP.find(m => m.metodo === metodoN);
    return metodo.idMetodoPago;
  }

  getIdEstadoEnvio(estadoN: string): number {
    const estado = this.estadosE.find(e => e.estado === estadoN);
    return estado.idEstadoEnvio;
  }

}
