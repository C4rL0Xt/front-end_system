import { DatePipe } from '@angular/common';

import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Pedido } from '../../../../core/models/pedido.model';
import { PedidoService } from '../../services/pedido-service/pedido.service';
import { ClienteServiceService } from '../../services/cliente-service.service';
import { Cliente } from '../../../../core/models/cliente.model';
import { Transportista } from '../../../../core/models/transportista.model';

export interface MetodoPago {
  idMetodoPago: number;
  metodo: string;
}

export interface EstadoEnvio {
  idEstadoEnvio: number;
  estado: string;
}

@Component({
  selector: 'app-form-pedido',
  templateUrl: './form-pedido.component.html',
  styleUrl: './form-pedido.component.css'
})
export class FormPedidoComponent implements OnInit, OnChanges {

  @Input() idCotizacion: string;
  @Input() dni: string;

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


  selectedTab: number = 1;
  selectOption: string = '';

  tabs = [
    { label: 'Seguimiento de pedidos', route: '/seguimiento/start' }
  ]

  dataSource: MatTableDataSource<Pedido> = new MatTableDataSource();
  agregarPedidoForm: FormGroup;
  editarPedidoForm: FormGroup;
  lastCode: string;

  @Output() emitirDatosFact: EventEmitter<{ idpedido: string, fechaentrega: Date }> = new EventEmitter<{ idpedido: string, fechaentrega: Date }>();
  

  displayedColumns: string[] = ['idpedido', 'idcotizacion', 'idcliente', 'metodopago', 'estadoenvio', 'idempleado', 'fechaentrega', 'fechaemision','actions'];

  pedidos: Pedido[] = [];
  clientes: Cliente[] = [];
  transActivos: Transportista[] = [];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;



  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private pedidoService: PedidoService,
    private clienteService: ClienteServiceService
  ) {
    this.agregarPedidoForm = this.fb.group({
      idpedido: [{ value: '', disabled: true }],
      idcotizacion: [{ value: '', disabled: true }],
      idcliente: [{value:'', disabled: true}],
      metodopago: ['', Validators.required],
      estadoenvio: [{ value: this.estadosE[0].estado, disabled: true }],
      idempleado: [''],
      fechaentrega: ['', Validators.required],
      fechaemision: ['', Validators.required]
    });
    this.editarPedidoForm = this.fb.group({
      idpedido: [{ value: '', disabled: true }],
      idcotizacion: [{ value: '', disabled: true }],
      idcliente: [{value:'', disabled: true}],
      metodopago: [''],
      estadoenvio: [''],
      idempleado: [''],
      fechaentrega: [{value:'', disabled: true}],
      fechaemision: [{value:'', disabled: true}],
    });
  }

  ngOnInit(): void {
    this.loadTransportistas();
    this.loadLastCode();
    this.loadPedidos();
    console.log("Tabla cargada");
  }

  ngOnChanges(changes: SimpleChanges): void {

    if (changes['idCotizacion'] && changes['idCotizacion'].currentValue) {
      this.updatePedidoForm(this.idCotizacion, this.dni);
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
      console.log("Pedidos en el arreglo de pedidos: ",this.pedidos);
      this.dataSource = new MatTableDataSource(this.pedidos = this.pedidos.map(pedido => {
        pedido.fechaEmision = this.adjustDate(pedido.fechaEmision);
        pedido.fechaEntrega = this.adjustDate(pedido.fechaEntrega);
        return pedido;
      }));
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    })
  }

  adjustDate(date: Date): Date  {
    const adjustdate = new Date(date);
    adjustdate.setMinutes(adjustdate.getMinutes() + adjustdate.getTimezoneOffset());
    return adjustdate;
  }

  loadTransportistas(): void {
    this.pedidoService.getTransportistasActivos().subscribe((response: Transportista[]) => {
      console.log("Transportista recibidos:  ", response);
      this.transActivos = response;
    })
  }

  onRowClicked(pedido: Pedido): void {
    this.editarPedidoForm.patchValue({
      idpedido: pedido.idPedido,
      idcotizacion: pedido.idCotizacion,
      idcliente: pedido.idCliente,
      metodopago: this.getMetodoPago(pedido.idMetodoPago),
      estadoenvio: this.getEstadoEnvio(pedido.idEstadoEnvio),
      idempleado: pedido.idEmpleado,
      fechaentrega: pedido.fechaEntrega,
      fechaemision: pedido.fechaEmision
    });
  }

  onCancel(): void {
    this.agregarPedidoForm.reset();
    this.editarPedidoForm.reset();
  }

  onSave(): void {
    if (this.agregarPedidoForm.valid) {
      const pedidoData = this.agregarPedidoForm.getRawValue();
      const pedidoModel = {
        idPedido: pedidoData.idpedido,
        idCotizacion: pedidoData.idcotizacion,
        idCliente: pedidoData.idcliente,
        idMetodoPago: this.getIdMetodoPago(pedidoData.metodopago),
        idEstadoEnvio: this.getIdEstadoEnvio(pedidoData.estadoenvio),
        idEmpleado: pedidoData.idempleado,
        fechaEntrega: pedidoData.fechaentrega,
        fechaEmision: pedidoData.fechaemision
      };

      console.log("El dto de pedido: ",pedidoModel);
      this.pedidoService.createPedido(pedidoModel).subscribe((response) => {
        console.log('Pedido save exitosamente: ', response);
        this.agregarPedidoForm.reset();
        this.loadLastCode();
        this.loadPedidos();

      }, (error) => {
        console.error('Error al guardar el pedido', error);
      }
      );

    } else {
      this.snackBar.open('Por favor completa el formulario correctamente', 'Cerrar', { duration: 2000 });

    }
  }

  actualizar(): void {
    if (this.editarPedidoForm.valid) {
      const pedidoData = this.editarPedidoForm.getRawValue();
      const idPedido = pedidoData.idpedido;
      const pedidoModelA = {
        idPedido: pedidoData.idpedido,
        idCotizacion: pedidoData.idcotizacion,
        idCliente: pedidoData.idcliente,
        idMetodoPago: this.getIdMetodoPago(pedidoData.metodopago),
        idEstadoEnvio: this.getIdEstadoEnvio(pedidoData.estadoenvio),
        idEmpleado: pedidoData.idempleado,
        fechaEntrega: pedidoData.fechaentrega,
        fechaEmision: pedidoData.fechaemision
      };

      console.log("El dto de pedido: ",pedidoModelA);
      this.pedidoService.updatePedido(idPedido,pedidoModelA).subscribe((response) => {
        console.log('Pedido save exitosamente: ', response);
        this.editarPedidoForm.reset();
        this.loadPedidos();

      }, (error) => {
        console.error('Error al actualizar el pedido', error);
      }
      );

    } else {
      this.snackBar.open('Por favor completa el formulario correctamente', 'Cerrar', { duration: 2000 });

    }
  }

  onSubmit(): void {
    if (this.agregarPedidoForm.valid) {
      console.log('Pedido guardado exitosamente:', this.agregarPedidoForm.getRawValue());
    }
  }

  updatePedidoForm(idCotizacion: string, dni: string): void {
    this.clienteService.getAllClients().subscribe((response: Cliente[]) => {
      this.clientes = response;
      console.log("Clientes cargados: ", this.clientes);
      const cliente = this.clientes.find(c => c.dni === dni);
      if (cliente) {
        this.agregarPedidoForm.patchValue({
          idcotizacion: idCotizacion,
          idcliente: cliente.id_cliente,
        });
      } else {
        console.error(`No se encontró cliente con DNI ${dni}`);
        // Puedes manejar esta situación de alguna manera apropiada, por ejemplo, mostrando un mensaje al usuario.
      }
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
    console.log("Metodos de pago: ",metodoN);
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

  goToFacturas(idpedido: string,fechaentrega: Date){
    this.emitirDatosFact.emit({idpedido: idpedido,fechaentrega: fechaentrega})
    
  }

}
