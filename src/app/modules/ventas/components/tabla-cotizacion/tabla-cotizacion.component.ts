import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { cotizacionVenta } from '../../../../core/models/cotizacionVenta';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DetalleCotizacionVenta } from '../../../../core/models/detalleCotizacionVenta';
import { CotiVentaService } from '../../services/cotizacion-v-service/coti-venta.service';

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

  cotizacionControl = new FormControl();
  selectedCotizacion: cotizacionVenta | null = null;
  estados = ['Pendiente', 'Pagado', 'Cancelado'];
  displayedColumns: string[] = ['idcotizacion', 'idempleado', 'estado', 'nombrecliente', 'montoproducto', 'fechaemision', 'email', 'montoimpuesto', 'montototal', 'departamento', 'actions'];

  cotizacionesFalsas: cotizacionVenta[] = [];

  departamentos: Departamento[] = [
    { id: 1, nombre: 'Lima' },
    { id: 2, nombre: 'Cusco' },
    { id: 3, nombre: 'Arequipa' }
  ];

  @Output() navigateToPedidos: EventEmitter<string> = new EventEmitter<string>();

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private cotizacionService: CotiVentaService
  ) {

    this.filterForm = this.fb.group({
      idcotizacion: [''],
      estado: [''],
      nombrecliente: [''],
      fechaemision: [''],
    });

    this.cotizacionForm = this.fb.group({
      idcotizacion: [''],
      idempleado: [''],
      estado: ['Pendiente'],
      nombrecliente: [''],
      montoproducto: [''],
      fechaemision: [''],
      email: [''],
      montoimpuesto: [''],
      montototal: [''],
      departamento: [''],
      detalles: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.getAllCotizaciones();

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
    detalles.forEach(detalle => {
      detalleFormArray.push(this.fb.group({
        producto: detalle.producto,
        cantidad: detalle.cantidad
      }));
    });
  }

  addDetalle(): void {
    const detalleFormGroup = this.fb.group({
      producto: [''],
      cantidad: ['']
    });
    this.detalles.push(detalleFormGroup);
  }

  removeDetalle(index: number) {
    const detalleFormArray = this.cotizacionForm.get('detalles') as FormArray;
    detalleFormArray.removeAt(index);
  }

  onCotizacionSelected(cotizacion: cotizacionVenta) {
    this.selectedCotizacion = cotizacion;
    this.cotizacionControl.setValue(cotizacion.nombrecliente);
    console.log('Cotizacion seleccionada: ', cotizacion);
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  resetFilters() {
    this.filterForm.reset();
    this.dataSource.filter = '';
  }

  onRowClicked(cotizacion: cotizacionVenta): void {
    this.cotizacionForm.patchValue({
      idcotizacion: cotizacion.idcotizacion,
      idempleado: cotizacion.idempleado,
      estado: cotizacion.estado,
      nombrecliente: cotizacion.nombrecliente,
      montoproducto: cotizacion.montoproducto,
      fechaemision: cotizacion.fechaemision,
      email: cotizacion.email,
      montoimpuesto: cotizacion.montoimpuesto,
      montototal: cotizacion.montototal,
      departamento: cotizacion.departamento
    });


    this.setDetalles(cotizacion.detalles);
    this.index_size = cotizacion.detalles.length;
    console.log('Cotizacion seleccionada:', this.index_size);
  }

  onSave() {
    this.snackBar.open('Factura guardada exitosamente', 'Cerrar', {
      duration: 2000,
      panelClass: ['mat-toolbar', 'mat-primary'],
      verticalPosition: 'top',
      horizontalPosition: 'center'
    });
  }

  applyFilter(event: any, column: string) {
    const filterValue = event.value ? event.value : (event.target as HTMLInputElement).value;
    this.dataSource.filterPredicate = (data: cotizacionVenta, filter: string) => {
      const searchTerms = JSON.parse(filter);
      return (searchTerms.idcotizacion ? data.idcotizacion.toLowerCase().includes(searchTerms.idcotizacion) : true)
        && (searchTerms.estado ? data.estado.toLowerCase().includes(searchTerms.estado) : true)
        && (searchTerms.nombrecliente ? data.nombrecliente.toLowerCase().includes(searchTerms.nombrecliente) : true)
        && (searchTerms.fechaemision ? new Date(data.fechaemision).toDateString() === new Date(searchTerms.fechaemision).toDateString() : true);
    };

    const searchTerms = {
      idcotizacion: column === 'idcotizacion' ? filterValue.trim().toLowerCase() : '',
      estado: column === 'estado' ? filterValue.trim().toLowerCase() : '',
      nombrecliente: column === 'nombrecliente' ? filterValue.trim().toLowerCase() : '',
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

  cancel(): void {
    this.cotizacionForm.reset();
    this.clearDetalles();

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
  }

  goToPedidos(idcotizacion: string){
    this.navigateToPedidos.emit(idcotizacion);
  }

}
