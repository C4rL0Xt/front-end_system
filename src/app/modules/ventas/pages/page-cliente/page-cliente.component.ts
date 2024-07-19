import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Cliente } from '../../../../core/models/cliente.model';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { ClienteServiceService } from '../../services/cliente-service.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Department } from '../../../../core/models/departamento.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { startWith, map, switchMap } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { CotiVentaService } from '../../services/cotizacion-v-service/coti-venta.service';
import { cotizacionVenta } from '../../../../core/models/cotizacionVenta';
@Component({
  selector: 'app-page-cliente',
  templateUrl: './page-cliente.component.html',
  styleUrl: './page-cliente.component.css',
})
export class PageClienteComponent implements OnInit, AfterViewInit {
  selectOption: string = '/clientes/agregarCliente';
  selectedTab: number = 1;
  clienteEncontrado: any = null;
  selectedCliente: Cliente | null = null;
  clientControl = new FormControl();
  filteredClients: Observable<Cliente[]>;
  idcoti: string;
  cotizacionRecibida: cotizacionVenta;
  tabs = [
    {
      label: 'Agregar cliente',
      route: '/clientes/agregarCliente',
    },
    {
      label: 'Editar cliente',
      route: '/clientes/actualizarCliente',
    },
    {
      label: 'Clientes',
      route: '/clientes/tablaClientes',
    },
  ];

  forms = [
    {
      label: 'Empresa',
      input: 'empresa',
      type: 'string',
    },
    {
      label: 'Representante',
      input: 'representante',
      type: 'string',
    },
    {
      label: 'DNI',
      input: 'dni',
      type: 'string',
    },
    {
      label: 'Email',
      input: 'email',
      type: 'string',
    },
    {
      label: 'Telefono',
      input: 'telefono',
      type: 'string',
    },
    {
      label: 'Direccion',
      input: 'direccion',
      type: 'string',
    },
  ];

  displayedColumns: string[] = [
    'idcliente',
    'empresa',
    'representante',
    'dni',
    'email',
    'telefono',
    'direccion',
    'iddepartamento',
  ];

  agregarClienteForm: FormGroup;
  buscarClienteForm: FormGroup;
  editarClienteForm: FormGroup;
  clients: Cliente[] = [];
  departments: string[] = [];
  lastClientId: string = 'CL0001';
  dataSource: MatTableDataSource<Cliente> = new MatTableDataSource();

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private clienteService: ClienteServiceService,
    private route: ActivatedRoute,
    private cotiService: CotiVentaService
  ) {
    this.agregarClienteForm = this.fb.group({
      idcliente: [{ value: '', disabled: true }],
      empresa: ['', Validators.required],
      representante: ['', Validators.required],
      dni: ['', Validators.required],
      email: ['', Validators.required],
      telefono: ['', Validators.required],
      direccion: ['', Validators.required],
      nombre_departamento: ['', Validators.required],
    });

    this.buscarClienteForm = this.fb.group({
      idcliente: ['', Validators.required],
    });

    this.editarClienteForm = this.fb.group({
      id_cliente: [{ value: '', disabled: true }],
      empresa: [{ value: '', disabled: true }],
      representante: ['', Validators.required],
      dni: ['', Validators.required],
      email: ['', Validators.required],
      telefono: ['', Validators.required],
      direccion: ['', Validators.required],
      nombre_departamento: ['', Validators.required],
    });
  }

  onSubmit(): void { }

  onBuscarCliente(): void {
    const codigo = this.buscarClienteForm.get('idcliente')?.value;
    const cliente = this.clients.find((c: any) => c.idcliente === codigo);
    if (cliente) {
      this.clienteEncontrado = cliente;
      this.editarClienteForm.patchValue(cliente);
      console.log('Cliente encontrado', cliente);
    } else {
      this.clienteEncontrado = null;
      console.log('Cliente no encontrado');
    }
  }

  onUpdate(): void {
    if (this.editarClienteForm.valid) {
      Object.assign(this.clienteEncontrado, this.editarClienteForm.value);
      console.log('Cliente actualizado con éxito', this.clienteEncontrado);
      this.clienteEncontrado = null;
      this.buscarClienteForm.reset();
      this.editarClienteForm.reset();
    } else {
      console.log('Formulario invalido');
    }
  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.idcoti = params['idcoti'];
    });

    this.cargarDatosDeCotizacion(this.idcoti);

    this.generateRandomCode();
    this.loadDepartamentos();
    this.loadClientes();

    this.filteredClients = this.clientControl.valueChanges.pipe(
      startWith(''),
      switchMap((value) => this._filter(value))
    );
  }

  cargarDatosDeCotizacion(id: string): void {
    this.cotiService.getCotizacionById(id).subscribe((response: any) => {
      console.log('Datos de cotización recibidos: ', response);
      this.cotizacionRecibida = response;
      this.agregarClienteForm.patchValue({
        representante: this.cotizacionRecibida.nombrecliente,
        dni: this.cotizacionRecibida.dni,
        email: this.cotizacionRecibida.email,
        nombre_departamento: this.cotizacionRecibida.departamento
      })
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadClientes(): void {
    this.clienteService.getAllClients().subscribe((response: Cliente[]) => {
      console.log('Clientes recibidos:  ', response);
      this.clients = response;
      this.dataSource.data = this.clients;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  loadDepartamentos(): void {
    this.clienteService.getAllDepartments().subscribe((response: string[]) => {
      this.departments = response;
      console.log('Hola dep', response);
    });
  }

  generateRandomCode() {
    const randomNumber = Math.floor(Math.random() * 100000);
    const randomCode = `C${randomNumber.toString().padStart(5, '0')}`;
    this.agregarClienteForm.patchValue({ idcliente: randomCode });
  }

  saveCliente(): void {
    if (this.agregarClienteForm.valid) {
      const clienteData = this.agregarClienteForm.getRawValue();
      const clientePresentation = {
        id_cliente: clienteData.idcliente,
        empresa: clienteData.empresa,
        representante: clienteData.representante,
        dni: clienteData.dni,
        email: clienteData.email,
        telefono: clienteData.telefono,
        direccion: clienteData.direccion,
        departamento: clienteData.nombre_departamento,
      };

      console.log(clientePresentation);
      this.clienteService.createClient(clientePresentation).subscribe(
        (response) => {
          this.snackBar.open('Cliente registrado exitosamente', 'Cerrar', { duration: 3000 });
          this.resetForm();
          this.generateRandomCode();
          this.loadClientes();
        },
        (error) => {
          console.error('Error al guardar el cliente', error);
        }
      );
    } else {
      this.snackBar.open(
        'Por favor completa el formulario correctamente',
        'Cerrar',
        { duration: 2000 }
      );
    }
  }

  resetForm(): void {
    this.agregarClienteForm.reset();
    Object.keys(this.agregarClienteForm.controls).forEach(key => {
      this.agregarClienteForm.get(key).setErrors(null);
      this.agregarClienteForm.get(key).markAsPristine();
      this.agregarClienteForm.get(key).markAsUntouched();
    });
  }

  actualizarCliente(): void {
    if (this.editarClienteForm.valid) {
      const clienteAData = this.editarClienteForm.getRawValue();
      const clienteAPresentation = {
        id_cliente: clienteAData.id_cliente,
        empresa: clienteAData.empresa,
        representante: clienteAData.representante,
        dni: clienteAData.dni,
        email: clienteAData.email,
        telefono: clienteAData.telefono,
        direccion: clienteAData.direccion,
        departamento: clienteAData.nombre_departamento,
      };
      console.log(clienteAPresentation);

      this.clienteService.updateClient(clienteAPresentation).subscribe(
        (response) => {
          console.log('Cliente actualizado exitosamente: ', response);
          this.editarClienteForm.reset();
        },
        (error) => {
          console.error('Error al actualizar el cliente', error);
        }
      );
    } else {
      this.snackBar.open(
        'Por favor completa el formulario correctamente',
        'Cerrar',
        { duration: 2000 }
      );
    }
  }

  private _filter(value: string): Observable<Cliente[]> {
    const filterValue = value ? value.toString().toLowerCase() : '';
    return this.clienteService
      .getAllClients()
      .pipe(
        map((clients) =>
          clients.filter((client) =>
            client.empresa.toLowerCase().includes(filterValue)
          )
        )
      );
  }

  onClientSelected(client: Cliente) {
    this.selectedCliente = client;
    this.clientControl.setValue(client.empresa);
    console.log('Cliente seleccionado: ', client);
    this.editarClienteForm.patchValue(client);
  }

  onTabSelected(route: string): void {
    this.selectOption = route;
    console.log(`Navigating to ${route}`);
  }

  onCancel(): void {
    this.agregarClienteForm.reset();
    this.editarClienteForm.reset();
    this.clientControl.reset();
    this.generateRandomCode();
  }
}
