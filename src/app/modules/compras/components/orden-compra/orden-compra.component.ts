import { Component, OnInit, ViewChild } from '@angular/core';
import { trigger, state, style, animate, transition, keyframes } from '@angular/animations';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Solicitud } from '../../../../core/models/solicitudCompra.model';
import { CotiBySoli } from '../../../../core/models/cotiBySoli.model';
import { Order } from '../../../../core/models/ordenCompra.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DocumentService } from '../../../productos/services/document-service/document.service';
import { CotizacionCompraService } from '../../services/coti-compra-service/cotizacion-compra.service';
import { OrdenCompraService } from '../../services/orden-compra-service/orden-compra.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-orden-compra',
  templateUrl: './orden-compra.component.html',
  styleUrl: './orden-compra.component.css',
  animations: [
    trigger('fadeInOut', [
      state('void', style({
        opacity: 0
      })),
      transition(':enter, :leave', [
        animate(500)
      ])
    ]),
    trigger('slideInOut', [
      state('void', style({
        transform: 'translateY(-20px)',
        opacity: 0
      })),
      transition(':enter, :leave', [
        animate('300ms ease-in-out')
      ])
    ]),
    trigger('bounceIn', [
      transition('void => *', [
        animate('1s', keyframes([
          style({ opacity: 0, transform: 'translateY(-100px)', offset: 0 }),
          style({ opacity: 1, transform: 'translateY(15px)', offset: 0.6 }),
          style({ transform: 'translateY(0)', offset: 1.0 })
        ]))
      ])
    ])
  ]
})
export class OrdenCompraComponent implements OnInit {

  form: FormGroup;
  purchaseRequests: Solicitud[] = [];
  quotations: CotiBySoli[] = [];
  orders: Order[] = [];
  displayedColumns: string[] = ['id_orden_compra', 'id_solicitud_cotizacion', 'id_proveedor', 'fecha_emision'];
  dataSource: MatTableDataSource<Order>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private documentService: DocumentService,
    private cotizacionService: CotizacionCompraService,
    private orderService: OrdenCompraService
  ) {
    this.form = this.fb.group({
      selectedPurchaseRequest: ['', Validators.required],
      selectedQuotation: ['', Validators.required],
      id_solicitud_cotizacion: [{ value: '', disabled: true }, Validators.required],
      id_proveedor: [{ value: '', disabled: true }, Validators.required],
      fecha_emision: [{ value: this.formatDate(new Date()), disabled: false }, Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadPurchaseRequests();
    this.loadOrders();
  }

  loadPurchaseRequests(): void {
    this.documentService.getAllSolicitudCompra().subscribe((solicitudes: Solicitud[]) => {

      this.purchaseRequests = solicitudes.filter(s => s.estado === 'Aceptado');
    },
      error => {
        console.error('Error loading purchase requests', error);
        this.snackBar.open('Error al cargar las solicitudes de compra', 'Cerrar', {
          duration: 3000,
        });
      });
  }


  loadOrders(): void {

    this.orderService.getOrdersCompra$().subscribe(
      (orders: Order[]) => {
        this.orders = orders;
        this.dataSource = new MatTableDataSource(orders);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error => {
        console.error('Error loading orders', error);
        this.snackBar.open('Error al cargar las órdenes de compra', 'Cerrar', {
          duration: 3000,
        });
      });
  }

  onPurchaseRequestSelectionChange(event: any): void {
    const selectedId = event.value;
    this.cotizacionService.getCotiBySoli(selectedId).subscribe(
      (quotations: CotiBySoli[]) => {
        this.quotations = quotations.filter(q => q.estado === 'Aceptado');
      },
      error => {
        console.error('Error loading quotations', error);
        this.snackBar.open('Error al cargar las cotizaciones. Por favor, intente nuevamente más tarde.', 'Cerrar', {
          duration: 3000,
        });
      }
    );
  }
  onQuotationSelectionChange(event: any): void {
    const selectedQuotation = this.quotations.find(q => q.idsolicitudcompra === event.value);
    if (selectedQuotation) {
      this.form.patchValue({
        id_solicitud_cotizacion: selectedQuotation.idsolicitudcompra,
        id_proveedor: selectedQuotation.nombreProveedor,
        fecha_emision: this.formatDate(new Date())
      });
    }
  }

  onSaveOrder(): void {
    if (this.form.valid) {
      const newOrder: Order = this.form.getRawValue();
      const ordenCompra = {
        id_orden_compra: newOrder.id_orden_compra,
        id_solicitud_cotizacion: newOrder.id_solicitud_cotizacion,
        id_proveedor: newOrder.id_proveedor,
        fecha_emision: new Date()
      };
      console.log('orden de compra', ordenCompra);
      this.orderService.createOrderCompra$(ordenCompra).subscribe(
        (response: any) => {
          console.log('response de guardar orden de compra', response);
          this.snackBar.open('Orden de compra creada correctamente', 'Cerrar', {
            duration: 3000,
          });
          this.loadOrders();
        },
        error => {
          console.error('Error saving order', error);
          this.snackBar.open('Error al guardar la orden de compra. Por favor, intente nuevamente más tarde.', 'Cerrar', {
            duration: 3000,
          });
        }
      );


    }
  }

  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }

}
