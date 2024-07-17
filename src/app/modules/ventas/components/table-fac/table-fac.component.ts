import { PedidoService } from './../../services/pedido-service/pedido.service';
import { AfterViewInit, Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { FacturaService } from '../../services/factura-service/factura.service';
import { FacturaVenta } from '../../../../core/models/facturaVenta.model';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DatePipe } from '@angular/common';

export interface Estado {
  idEstado: number;
  estado: string;
}
@Component({
  selector: 'app-table-fac',
  templateUrl: './table-fac.component.html',
  styleUrl: './table-fac.component.css'
})
export class TableFacComponent implements OnInit,AfterViewInit,OnChanges {

  @Input() updateFlag: boolean;
  dataSource: MatTableDataSource<FacturaVenta> = new MatTableDataSource();
  editarFacturaForm: FormGroup;
  filterForm: FormGroup;
  estados: Estado[] = [
    { idEstado: 1, estado: "Pendiente" },
    { idEstado: 2, estado: "Pagado" },
    { idEstado: 3, estado: "Cancelado" }
  ]
  displayedColumns: string[] = ['codigo', 'codigopedido', 'estadopago', 'fechalimitedepago', 'fechapago', 'actions'];
  facturas: FacturaVenta[] = [];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  constructor(
    private facturaService: FacturaService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private pedidoService: PedidoService
  ) {
    this.filterForm = this.fb.group({
      codigoPedido: [''],
      estadoPago: [''],
      fechaPago: ['']
    });

    this.editarFacturaForm = this.fb.group({
      idfactura: [{ value: '', disabled: true }],
      idpedido: [{ value: '', disabled: true }],
      idestadopago: [{ value: this.estados[0].estado, disabled: false }],
      fechalimite: [{ value: '', disabled: true }],
      fechapago: [{value:'',disabled:true}],
    });
  }

  ngOnInit(): void {
    this.loadFacturas();
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log("Cambios detectados",changes);
        if (changes['updateFlag'] && changes['updateFlag'].previousValue !== changes['updateFlag'].currentValue) {
      this.loadFacturas();
    }
  }

  applyFilter(event: any, column: string) {
    const filterValue = event.value ? event.value : (event.target as HTMLInputElement).value;
    this.dataSource.filterPredicate = (data: FacturaVenta, filter: string) => {
      const searchTerms = JSON.parse(filter);
      return (searchTerms.codigopedido ? data.idPedido.toLowerCase().includes(searchTerms.codigopedido) : true)
        && (searchTerms.estadopago ? this.getEstado(data.idEstadoPago).toLowerCase().includes(searchTerms.estadopago) : true);// Convert to string before using includes
    };

    // Format date filter value if filtering by 'fechapago'

    const searchTerms = {
      codigopedido: column === 'codigopedido' ? filterValue.trim().toLowerCase() : '',
      estadopago: column === 'estadopago' ? filterValue.trim().toLowerCase() : ''
    };

    this.dataSource.filter = JSON.stringify(searchTerms);
  }

  loadFacturas(): void {
    this.facturaService.getAllFacturas().subscribe((response: FacturaVenta[]) => {

      this.facturas = response;
      console.log("Facturas: ", this.facturas);
      this.dataSource = new MatTableDataSource(this.facturas = this.facturas.map(factura => {
        factura.fechaLimite = this.adjustDate(factura.fechaLimite);
        if (factura.fechaPago) {
          factura.fechaPago = this.adjustDate(factura.fechaPago);
        }
        return factura;
      }));
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    })
  }

  adjustDate(date: Date): Date {
    const adjustdate = new Date(date);
    adjustdate.setMinutes(adjustdate.getMinutes() + adjustdate.getTimezoneOffset());
    return adjustdate;
  }

  ngAfterViewInit(){
    console.log("After view ejecutandose");
    this.facturas = [...this.facturas];
  }

  resetFilters() {
    this.filterForm.reset();
    this.dataSource.filter = '';
  }

  onRowClicked(factura: FacturaVenta): void {
    this.editarFacturaForm.patchValue({
      idfactura: factura.idFactura,
      idpedido: factura.idPedido,
      idestadopago: factura.idEstadoPago,
      fechalimite: factura.fechaLimite,
      fechapago: factura.fechaPago,
    });
  }

  cancel(): void {
    this.editarFacturaForm.reset();
  }

  onCancel() {
    this.resetFilters();
    this.editarFacturaForm.reset();
  }

  onSave() {
    if (this.editarFacturaForm.valid) {
      const facturaData = this.editarFacturaForm.getRawValue();

      const facturaModel = {
        idFactura: facturaData.idfactura,
        idPedido: facturaData.idpedido,
        idEstadoPago: this.getIdEstado(facturaData.idestadopago),
        fechaLimite: facturaData.fechalimite,
        fechaPago: facturaData.fechapago
      };

      console.log("El dto de factura: ", facturaModel);
      this.facturaService.updateFactura(facturaModel).subscribe((response) => {
        console.log('Factura actualizada exitosamente: ', response);

        if (facturaModel.idEstadoPago === 2) {
          this.updateEstadoEnvio(facturaModel.idPedido);
        }

        this.editarFacturaForm.reset();
        this.loadFacturas();

      }, (error) => {
        console.error('Error al actualizar la factura', error);
      }
      );

    } else {
      this.snackBar.open('Por favor completa el formulario correctamente', 'Cerrar', { duration: 2000 });

    }
  }

  updateEstadoEnvio(idPedido: string) {
    this.pedidoService.updateAListo(idPedido).subscribe((response) => {
      console.log('Estado de envío actualizado para el pedido', idPedido);
    }, (error) => {
      console.error('Error al actualizar el estado de envío del pedido', error);
    });
  }

  onSubmit(): void {
    if (this.editarFacturaForm.valid) {
      console.log('Factura actualizada exitosamente:', this.editarFacturaForm.getRawValue());
    }
  }

  getEstado(id: number): string {
    const estado = this.estados.find(m => m.idEstado === id);
    return estado ? estado.estado : 'Desconocido';
  }

  getIdEstado(estadoi: string): number {
    const estado = this.estados.find(e => e.estado === estadoi);
    return estado.idEstado;
  }
}
