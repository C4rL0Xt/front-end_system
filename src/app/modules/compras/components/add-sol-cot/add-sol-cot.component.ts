import { Component, OnInit, ViewChild } from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Observable } from 'rxjs';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { map, startWith } from 'rxjs/operators';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { SolicitudCotizacion } from '../../../../core/models/SolicitudCotizacion.model';
import { SolicitudCotizacionService } from '../../services/soli-coti-service/solicitud-cotizacion.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ProveedorService } from '../../services/proveedor-service/proveedor.service';
import { Proveedor } from '../../../../core/models/proveedor.model';
import { DocumentService } from '../../../productos/services/document-service/document.service';
import { Solicitud } from '../../../../core/models/solicitudCompra.model';
import { MatSnackBar } from '@angular/material/snack-bar';

interface PurchaseRequest {
  id: number;
  number: string;
  date: string;
  description: string;
}

@Component({
  selector: 'app-add-sol-cot',
  templateUrl: './add-sol-cot.component.html',
  styleUrl: './add-sol-cot.component.css',
  animations: [
    trigger('fadeInOut', [
      state('void', style({
        opacity: 0
      })),
      transition(':enter, :leave', [
        animate('600ms ease-in-out')
      ])
    ]),
    trigger('slideInOut', [
      state('void', style({
        transform: 'translateY(-30px)',
        opacity: 0
      })),
      transition(':enter, :leave', [
        animate('500ms ease-in-out')
      ])
    ])
  ]
})
export class AddSolCotComponent implements OnInit {

  form: FormGroup;

  purchaseRequests: Solicitud[] = [];
  //proveedores: string[] = ['Proveedor A', 'Proveedor B', 'Proveedor C', 'Proveedor D'];
  proveedores: Proveedor[] = [];
  // proveedoresFiltrados: Observable<string[]>;
  proveedoresFiltrados: Observable<Proveedor[]>;

  separatorKeysCodes: number[] = [ENTER, COMMA];
  proveedoresCtrl = new FormControl();
  //proveedoresSeleccionados: string[] = [];
  proveedoresSeleccionados: Proveedor[] = [];
  displayedColumns: string[] = ['solicitudcotizacion', 'solicitudcompra', 'fechacreacion'];


  solicitudesCotizacion: SolicitudCotizacion[] = [];
  dataSource: MatTableDataSource<SolicitudCotizacion>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;


  constructor(private fb: FormBuilder,
    private solicitudService: SolicitudCotizacionService,
    private proveedorService: ProveedorService,
    private documentService: DocumentService,
    private snackBar: MatSnackBar,
  ) {
    this.form = this.fb.group({
      selectedPurchaseRequest: ['', Validators.required],
      purchaseRequestNumber: [''],
      purchaseRequestDate: [''],
      purchaseRequestDescription: [''],
      proveedoresCtrl: this.proveedoresCtrl,
      proveedoresSeleccionados: [[]],
      quotationItems: this.fb.array([])
    });
  }

  ngOnInit() {
    this.loadAllSolicitudesCotizacion();
    this.loadAllProveedor();
    this.loadSolicitudCompra();

    this.proveedoresFiltrados = this.proveedoresCtrl.valueChanges.pipe(
      startWith(''),
      map((value: string | Proveedor | null) =>
        typeof value === 'string' ? this._filter(value) : this.proveedores.slice())
    );
  }

  loadAllSolicitudesCotizacion() {
    this.solicitudService.getAllSolicitudesCotizacion$().subscribe((response: any) => {
      console.log("Respuesta completa de la API-coti: ", response);
      this.solicitudesCotizacion = response;
      this.dataSource = new MatTableDataSource(this.solicitudesCotizacion);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  loadAllProveedor() {
    this.proveedorService.getProveedores$().subscribe((response: Proveedor[]) => {
      console.log("Respues de la API PROVEEDOR", response);
      this.proveedores = response;
    });
  }

  loadSolicitudCompra() {
    this.documentService.getAllSolicitudCompra().subscribe((response: any) => {
      console.log("Respuesta completa de la API-compra: ", response);
      this.purchaseRequests = response;
    });
  }





  private _filter(value: string): Proveedor[] {
    const filterValue = value.toLowerCase();
    return this.proveedores.filter(proveedor => proveedor.empresa.toLowerCase().includes(filterValue));
  }

  displayProveedor(proveedor?: Proveedor): string | undefined {
    return proveedor ? proveedor.empresa : undefined;
  }

  onPurchaseRequestSelectionChange(event: any): void {
    const selectedId = event.value;
    const selectedRequest = this.purchaseRequests.find(req => req.id_solicitud === selectedId);
    if (selectedRequest) {
      this.form.patchValue({
        purchaseRequestNumber: selectedRequest.id_solicitud,
        purchaseRequestDate: this.formatDate(selectedRequest.plazoEntrega),
        purchaseRequestDescription: selectedRequest.nombreProducto
      });
    }
  }

  formatDate(date: Date): string {
    const d = new Date(date);
    const month = `${d.getMonth() + 1}`.padStart(2, '0');
    const day = `${d.getDate()}`.padStart(2, '0');
    const year = d.getFullYear();
    return [year, month, day].join('-');
  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    if (value) {
      const selectedProveedor = this.proveedores.find(prov => prov.empresa === value);
      if (selectedProveedor && !this.proveedoresSeleccionados.includes(selectedProveedor)) {
        this.proveedoresSeleccionados.push(selectedProveedor);
      }
    }

    event.chipInput!.clear();

    this.proveedoresCtrl.setValue(null);
  }

  remove(proveedor: Proveedor): void {
    const index = this.proveedoresSeleccionados.indexOf(proveedor);

    if (index >= 0) {
      this.proveedoresSeleccionados.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    const selectedProveedor = event.option.value as Proveedor;
    if (!this.proveedoresSeleccionados.includes(selectedProveedor)) {
      this.proveedoresSeleccionados.push(selectedProveedor);
    }
    this.proveedoresCtrl.setValue(null);
  }

  submit() {

    if (this.form.valid) {
      const formValues = this.form.value;
      const fechaCreacion = new Date();

      const formattedFechaCreacion = `${fechaCreacion.getFullYear()}-${(fechaCreacion.getMonth() + 1).toString().padStart(2, '0')}-${fechaCreacion.getDate().toString().padStart(2, '0')}`;

      const solicitudCotizacion: SolicitudCotizacion = {
        idsolicitudcotizacion: '', // Asignar el ID según corresponda
        idsolicitudcompra: formValues.purchaseRequestNumber,
        fechacreacion: formattedFechaCreacion as any as Date, // Formato yyyy-mm-dd
        detalles: this.proveedoresSeleccionados.map(proveedor => ({
          idsolicitudcotizacion: '', // Asignar el ID según corresponda
          idproveedor: proveedor.idproveedor
        }))
      };

      let solicitud = false;

      this.solicitudService.createSolicitudCotizacion$(solicitudCotizacion).subscribe((response: any) => {
        console.log('Respuesta de la API-coti', response);
        this.loadAllSolicitudesCotizacion();
        solicitud = true;
        if (solicitud) {
          this.snackBar.open('Productos y lotes guardados exitosamente!', 'Cerrar', {
            duration: 3000,
            panelClass: ['snack-bar-success'],
            verticalPosition: 'top',
            horizontalPosition: 'center',
          });

          this.form.reset();
          this.limpiarSeleccion();

        }

      }, (error) => {
        console.error('Error al guardar el producto y los lotes', error);
        this.snackBar.open('Error al guardar el producto y los lotes', 'Cerrar', { duration: 3000 });
      });
    } else {
      this.snackBar.open('Por favor completa el formulario correctamente', 'Cerrar', { duration: 2000 });
    }
  }

  limpiarSeleccion() {
    this.proveedoresSeleccionados = [];
    this.proveedoresCtrl.setValue(null);
    this.form.get('proveedoresSeleccionados').setValue([]);
  }


}
