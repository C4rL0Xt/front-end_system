import { Component } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AfterViewInit, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { FactCompraService } from '../../services/factura-compra-service/fact-compra.service';
import { FacturaCompra } from '../../../../core/models/facturasCompra.model';
@Component({
  selector: 'app-factura-compra',
  templateUrl: './factura-compra.component.html',
  styleUrl: './factura-compra.component.css'
})
export class FacturaCompraComponent implements OnInit {
  dataSource: MatTableDataSource<FacturaCompra> = new MatTableDataSource();
  filterForm: FormGroup;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  displayedColumns: string[] = ['codigofactura', 'codigoorden', 'fechalimite', 'fechapago'];

  facturas: FacturaCompra[] = [];

  constructor(
    private facturaService: FactCompraService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
  ) {
    this.filterForm = this.fb.group({
      codigoOrden: [''],
      fechalimite: ['']
    });
  }

  ngOnInit(): void {
    this.loadFacturasCompra();
  }

  loadFacturasCompra(): void {
    this.facturaService.getAllFacturasCompra().subscribe((response: FacturaCompra[]) => {

      this.facturas = response;

      this.dataSource = new MatTableDataSource(this.facturas = this.facturas.map(factura => {
        factura.fecha_limite = this.adjustDate(factura.fecha_limite);
        return factura;
      }));
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    })
  }

  applyFilter(event: any, column: string) {
    const filterValue = event.value ? event.value : (event.target as HTMLInputElement).value;
    this.dataSource.filterPredicate = (data: FacturaCompra, filter: string) => {
      const searchTerms = JSON.parse(filter);
      const fechaLimite = searchTerms.fechaLimite ? new Date(searchTerms.fechaLimite).toISOString().split('T')[0] : '';
      const dataFechaLimite = data.fecha_limite ? new Date(data.fecha_limite).toISOString().split('T')[0] : '';

      return (searchTerms.codigoOrden ? data.idOrdenCompra.toLowerCase().includes(searchTerms.codigoOrden) : true) &&
        (fechaLimite ? dataFechaLimite.includes(fechaLimite) : true);
    };

    const searchTerms = {
      codigoOrden: column === 'codigoOrden' ? filterValue.trim().toLowerCase() : '',
      fechaLimite: column === 'fechaLimite' ? new Date(filterValue).toISOString().split('T')[0] : ''
    };

    this.dataSource.filter = JSON.stringify(searchTerms);
  }

  resetFilters() {
    this.filterForm.reset();
    this.dataSource.filter = '';
  }

  adjustDate(date: Date): Date {
    const adjustdate = new Date(date);
    adjustdate.setMinutes(adjustdate.getMinutes() + adjustdate.getTimezoneOffset());
    return adjustdate;
  }

}
