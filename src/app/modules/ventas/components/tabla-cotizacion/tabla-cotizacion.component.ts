import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { cotizacionVenta } from '../../../../core/models/cotizacionVenta';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DetalleCotizacionVenta } from '../../../../core/models/detalleCotizacionVenta';
import { CotiVentaService } from '../../services/cotizacion-v-service/coti-venta.service';
import { ProductoService } from '../../../productos/services/product-service/producto.service';
import { map, Observable, startWith, switchMap } from 'rxjs';
import { Product } from '../../../../core/models/product.model';
import { Estado } from '../../../../core/models/estado.model';
import { ClienteServiceService } from '../../services/cliente-service.service';
import { Cliente } from '../../../../core/models/cliente.model';

interface Departamento {
  id: number;
  nombre: string;
}

@Component({
  selector: 'app-tabla-cotizacion',
  templateUrl: './tabla-cotizacion.component.html',
  styleUrl: './tabla-cotizacion.component.css'
})
export class TablaCotizacionComponent implements OnInit {
  index_size: number
  dataSource: MatTableDataSource<cotizacionVenta>;
  cotizacionForm: FormGroup;
  filterForm: FormGroup;

  isNewButtonEnabled = false;

  @Output() emitirIdDeCotizacion: EventEmitter<string> = new EventEmitter<string>();

  cotizacionControl = new FormControl();
  selectedCotizacion: cotizacionVenta | null = null;
  displayedColumns: string[] = ['idcotizacion', 'idempleado', 'estado', 'dni', 'nombrecliente', 'montoproducto', 'fechaemision', 'email', 'montoimpuesto', 'montototal', 'departamento', 'actions'];
  productos: Product[] = [];
  selectedProducto: Product | null = null;
  filteredOptions: Observable<Product[]>[] = [];
  cotizacionesFalsas: cotizacionVenta[] = [];
  clientes: Cliente[] = [];

  departamentos: Departamento[] = [
    { id: 1, nombre: 'MOQUEGUA' },
    { id: 2, nombre: 'LA LIBERTAD' },
    { id: 3, nombre: 'LIMA' },
    { id: 4, nombre: 'AREQUIPA' },
    { id: 5, nombre: 'LORETO' },
    { id: 6, nombre: 'PIURA' },
    { id: 7, nombre: 'AYACUCHO' },
    { id: 8, nombre: 'JUNIN' },
    { id: 9, nombre: 'ICA' },
    { id: 10, nombre: 'LAMBAYAQUE' },
    { id: 11, nombre: 'CAJARMACA' },
    { id: 12, nombre: 'UCAYALI' },
    { id: 13, nombre: 'ANCASH' },
    { id: 14, nombre: 'HUANCAVELICA' },
    { id: 15, nombre: 'TUMBES' },
    { id: 16, nombre: 'PUNO' },
    { id: 17, nombre: 'TACNA' },
    { id: 18, nombre: 'SAN MARTIN' },
    { id: 19, nombre: 'AMAZONAS' },
    { id: 20, nombre: 'PASCO' },
    { id: 21, nombre: 'APURIMAC' },
    { id: 22, nombre: 'MADRE DE DIOS' },
    { id: 23, nombre: 'CUZCO' },
    { id: 24, nombre: 'HUANUCO' }
  ];

  @Output() navigateToPedidos: EventEmitter<{ idcotizacion: string, dni: string }> = new EventEmitter<{ idcotizacion: string, dni: string }>();

  estados: Estado[] = [{
    id: 1,
    nombre: 'Pendiente'
  }, {
    id: 2,
    nombre: 'Aceptado'
  }, {
    id: 3,
    nombre: 'Rechazado'
  }];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private cotizacionService: CotiVentaService,
    private productService: ProductoService,
    private clienteService: ClienteServiceService
  ) {

    this.filterForm = this.fb.group({
      idcotizacion: [''],
      estado: [''],
      dni: [''],
      fechaemision: [''],
    });

    this.cotizacionForm = this.fb.group({
      idcotizacion: [{ value: '', disabled: true }],
      idempleado: [{ value: '', disabled: true }],
      estado: ['', Validators.required],
      nombrecliente: ['', Validators.required],
      montoproducto: [{ value: '', disabled: true }],
      fechaemision: [{ value: '', disabled: true }],
      email: ['', Validators.required],
      montoimpuesto: [{ value: '', disabled: true }],
      montototal: [{ value: '', disabled: true }],
      departamento: ['', Validators.required],
      dni: ['', Validators.required],
      detalles: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.getProductos();
    this.getClientes();
    this.getAllCotizaciones();

  }

  private _filter(value: string): Observable<Product[]> {
    const filterValue = value ? value.toString().toLowerCase() : '';
    return this.productService.getAllProducts().pipe(
      map(products => products.filter(product => product.name.toLowerCase().includes(filterValue)))
    );
  }

  getProductos(): void {
    this.productService.getAllProducts().subscribe(products => {
      this.productos = products;
      console.log('Productos:', products);
    });
  }

  getClientes(): void {
    this.clienteService.getAllClients().subscribe(clients => {
      this.clientes = clients;
      console.log('Clientes:', clients);
    });
  }

  onProductSelected(product: Product) {
    this.selectedProducto = product;

    console.log('Producto seleccionado: ', this.selectedProducto);
  }

  getAllCotizaciones(): void {
    this.cotizacionService.getAllCotizacionesVenta$().subscribe((cotizaciones: cotizacionVenta[]) => {
      console.log('Cotizaciones recibido en el ts: ', cotizaciones);
      this.cotizacionesFalsas = cotizaciones;
      this.dataSource = new MatTableDataSource(this.cotizacionesFalsas);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }


  get detalles(): FormArray {
    return this.cotizacionForm.get('detalles') as FormArray;
  }

  setDetalles(detalles: DetalleCotizacionVenta[]) {
    const detalleFormArray = this.cotizacionForm.get('detalles') as FormArray;
    detalleFormArray.clear();
    this.filteredOptions = []; // Clear the filtered options array

    detalles.forEach(detalle => {
      const detalleFormGroup = this.fb.group({
        idcotizacion: [{ value: detalle.idcotizacion, disabled: true }],
        producto: [detalle.producto, Validators.required],
        concentracion: [detalle.concentracion],
        cantidad: [detalle.cantidad, Validators.required],
        total: [{ value: detalle.total, disabled: true }]
      });

      const productoControl = detalleFormGroup.get('producto');
      this.filteredOptions.push(productoControl.valueChanges.pipe(
        startWith(''),
        switchMap(value => this._filter(value))
      ));

      productoControl.valueChanges.subscribe(value => {
        const selectedProduct = this.productos.find(producto => producto.name === value);
        if (selectedProduct) {
          detalleFormGroup.patchValue({
            concentracion: selectedProduct.concentracion
          });
        }
      });

      detalleFormArray.push(detalleFormGroup);
    });
  }

  initDetalle(): FormGroup {
    const detalleFormGroup = this.fb.group({
      idcotizacion: [{ value: this.cotizacionForm.get('idcotizacion').value, disabled: true }],
      producto: ['', Validators.required],
      concentracion: [''],
      cantidad: ['', Validators.required],
      total: [{ value: '', disabled: true }]
    });

    const productoControl = detalleFormGroup.get('producto');
    this.filteredOptions.push(productoControl.valueChanges.pipe(
      startWith(''),
      switchMap(value => this._filter(value))
    ));
    console.log('Entro a initDetalle');
    productoControl.valueChanges.subscribe(value => {
      const selectedProduct = this.productos.find(producto => producto.name === value);

      if (selectedProduct) {

        detalleFormGroup.patchValue({
          concentracion: selectedProduct.concentracion
        });
        console.log('Concentracion:', selectedProduct.concentracion);
      }
    });

    return detalleFormGroup;
  }


  addDetalle(): void {

    this.detalles.push(this.initDetalle());
  }



  removeDetalle(index: number) {
    const detalleFormArray = this.cotizacionForm.get('detalles') as FormArray;
    const detalle = {
      idcotizacion: this.cotizacionForm.get('idcotizacion').value,
      producto: detalleFormArray.at(index).get('producto').value,
      cantidad: detalleFormArray.at(index).get('cantidad').value,
      concentracion: detalleFormArray.at(index).get('concentracion').value,
      total: detalleFormArray.at(index).get('total').value
    }
    console.log('Eliminando detalle en el indice:', detalle);
    this.cotizacionService.deleteDetalleCotizacionVenta(detalle).subscribe((response) => {
      console.log('Detalle eliminado exitosamente:', response);
    });
    detalleFormArray.removeAt(index);
  }

  onCotizacionSelected(cotizacion: cotizacionVenta) {
    this.selectedCotizacion = cotizacion;
    this.cotizacionControl.setValue(cotizacion.nombrecliente);
    console.log('Cotizacion seleccionada: ', cotizacion);
  }



  resetFilters() {
    this.filterForm.reset();
    this.dataSource.filter = '';
  }

  onRowClicked(cotizacion: cotizacionVenta): void {
    this.selectedCotizacion = cotizacion;

    // Asegurarse de que la fecha esté en el formato correcto (YYYY-MM-DD)
    const fechaEmision = new Date(cotizacion.fechaemision).toISOString().split('T')[0];

    // Encontrar los valores correspondientes en los arrays de estados y departamentos
    const estadoSeleccionado = this.estados.find(estado => estado.nombre === cotizacion.estado);
    const departamentoSeleccionado = this.departamentos.find(departamento => departamento.nombre === cotizacion.departamento);

    this.cotizacionForm.patchValue({
      idcotizacion: cotizacion.idcotizacion,
      idempleado: cotizacion.idempleado,
      estado: estadoSeleccionado ? estadoSeleccionado.nombre : '',
      nombrecliente: cotizacion.nombrecliente,
      montoproducto: cotizacion.montoproducto,
      fechaemision: fechaEmision,
      email: cotizacion.email,
      dni: cotizacion.dni,
      montoimpuesto: cotizacion.montoimpuesto,
      montototal: cotizacion.montototal,
      departamento: departamentoSeleccionado ? departamentoSeleccionado.nombre : ''
    });

    this.setDetalles(cotizacion.detalles);
    this.index_size = cotizacion.detalles.length;
    console.log('Cotizacion seleccionada:', this.index_size);
    this.isNewButtonEnabled = true;
  }


  onSave() {
    if (this.cotizacionForm.valid) {
      console.log('Hola');
      const cotizacionData = this.cotizacionForm.getRawValue();
      const cotizacionVentaDto = {
        idcotizacion: cotizacionData.idcotizacion,
        idempleado: cotizacionData.idempleado,
        estado: cotizacionData.estado,
        nombrecliente: cotizacionData.nombrecliente,
        montoproducto: cotizacionData.montoproducto,
        fechaemision: cotizacionData.fechaemision,
        email: cotizacionData.email,
        montoimpuesto: cotizacionData.montoimpuesto,
        montototal: cotizacionData.montototal,
        departamento: cotizacionData.departamento,
        dni: cotizacionData.dni,
        detalles: cotizacionData.detalles
      };

      this.cotizacionService.updateCotizacionVenta(cotizacionVentaDto).subscribe(
        (response) => {

          console.log('Respuesta', response);
          this.snackBar.open('Factura guardada exitosamente', 'Cerrar', {
            duration: 2000,
            panelClass: ['mat-toolbar', 'mat-primary'],
            verticalPosition: 'top',
            horizontalPosition: 'center'
          });

          console.log('Cotizacion guardada:', cotizacionVentaDto);
          this.cotizacionForm.reset();
          this.getAllCotizaciones();
          this.clearDetalles();

          this.isNewButtonEnabled = false;
        }
      );
    } else {
      this.snackBar.open('Por favor completa el formulario correctamente', 'Cerrar', { duration: 2000 });
    }
  }

  applyFilter(event: any, column: string) {
    const filterValue = event.value ? event.value : (event.target as HTMLInputElement).value;
    this.dataSource.filterPredicate = (data: cotizacionVenta, filter: string) => {
      const searchTerms = JSON.parse(filter);
      return (searchTerms.idcotizacion ? data.idcotizacion.toLowerCase().includes(searchTerms.idcotizacion) : true)
        && (searchTerms.estado ? data.estado.toLowerCase().includes(searchTerms.estado) : true)
        && (searchTerms.dni ? data.dni.toLowerCase().includes(searchTerms.dni) : true)
        && (searchTerms.fechaemision ? new Date(data.fechaemision).toDateString() === new Date(searchTerms.fechaemision).toDateString() : true);
    };

    const searchTerms = {
      idcotizacion: column === 'idcotizacion' ? filterValue.trim().toLowerCase() : '',
      estado: column === 'estado' ? filterValue.trim().toLowerCase() : '',
      dni: column === 'dni' ? filterValue.trim().toLowerCase() : '',
      fechaemision: column === 'fechaemision' ? new Date(filterValue).toISOString() : ''
    };

    this.dataSource.filter = JSON.stringify(searchTerms);
  }

  onSubmit(): void {
    if (this.cotizacionForm.valid) {
      console.log('Factura actualizada exitosamente:', this.cotizacionForm.getRawValue());
    }
  }

  asignarDetalles(): void {

  }

  calculateTotal(): void {
    if (this.cotizacionForm.valid) {
      const cotizacionData = this.cotizacionForm.getRawValue();
      console.log('Cotizacion data:', cotizacionData);

      const cotizacionVentaDto = {
        idcotizacion: cotizacionData.idcotizacion,
        idempleado: cotizacionData.idempleado,
        estado: cotizacionData.estado,
        nombrecliente: cotizacionData.nombrecliente,
        montoproducto: cotizacionData.montoproducto,
        fechaemision: cotizacionData.fechaemision,
        email: cotizacionData.email,
        montoimpuesto: cotizacionData.montoimpuesto,
        montototal: cotizacionData.montototal,
        departamento: cotizacionData.departamento,
        dni: cotizacionData.dni,
        detalles: cotizacionData.detalles
      };

      console.log('Esto envio', cotizacionVentaDto);

      this.cotizacionService.getMontoCotizacionVenta(cotizacionVentaDto).subscribe(
        (response: cotizacionVenta) => {
          console.log('Cotizacion con montos:', response);
          this.cotizacionForm.patchValue({
            montoproducto: response.montoproducto,
            montoimpuesto: response.montoimpuesto,
            montototal: response.montototal,
            detalles: response.detalles
          });
        });


      this.snackBar.open('Calculamos montos!', 'Cerrar', {
        duration: 3000,
        panelClass: ['snack-bar-success'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    }
  }



  clearDetalles() {
    const detalleFormArray = this.cotizacionForm.get('detalles') as FormArray;
    while (detalleFormArray.length !== 0) {
      detalleFormArray.removeAt(0);
    }
  }
  onCancel() {
    this.resetFilters();
    this.cotizacionForm.reset();
    this.clearDetalles();
    this.isNewButtonEnabled = false;
  }

  goToPedidos(idcotizacion: string, dni: string) {

    const clienteEncontrado = this.clientes.find(cliente => cliente.dni === dni);

    if (clienteEncontrado) {
      this.navigateToPedidos.emit({ idcotizacion: idcotizacion, dni: dni });
    } else {
      this.emitirIdDeCotizacion.emit(idcotizacion);
      this.snackBar.open('El cliente no está registrado.', 'Cerrar', {
        duration: 3000,
        panelClass: ['snack-bar-warning'],
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    }
  }

  getCotizacionPdf(idcotizacion: string) {
    this.cotizacionService.getCotizacionPdf(idcotizacion).subscribe(
      (response) => {
        console.log('Respuesta:', response);
        const blob = new Blob([response], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        window.open(url);
      },
      (error) => {
        console.error('Error al obtener el PDF de la cotización', error);
      }
    );
  }

}
