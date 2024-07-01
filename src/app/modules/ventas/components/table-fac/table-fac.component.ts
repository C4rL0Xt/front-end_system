import { Component, OnInit, ViewChild } from '@angular/core';
import { FacturaService } from '../../services/factura-service/factura.service';
import { FacturaVenta } from '../../../../core/models/facturaVenta.model';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-table-fac',
  templateUrl: './table-fac.component.html',
  styleUrl: './table-fac.component.css'
})
export class TableFacComponent implements OnInit {
  dataSource: MatTableDataSource<FacturaVenta> = new MatTableDataSource();
  facturaForm: FormGroup;
  filterForm: FormGroup;
  estados = ['Pendiente', 'Pagado', 'Cancelado'];
  displayedColumns: string[] = ['codigo', 'codigopedido', 'estadopago', 'fechalimitedepago', 'fechapago', 'actions'];
  facturas: FacturaVenta[] = [
    {
      codigo: "FV-001",
      codigopedido: "CP-1001",
      estadopago: "Pendiente",
      fechalimitedepago: new Date('2024-07-15'),
      fechapago: new Date('2024-07-10')
    },
    {
      codigo: "FV-002",
      codigopedido: "CP-1002",
      estadopago: "Pagado",
      fechalimitedepago: new Date('2024-08-01'),
      fechapago: new Date('2024-07-30')
    },
    {
      codigo: "FV-003",
      codigopedido: "CP-1003",
      estadopago: "Pendiente",
      fechalimitedepago: new Date('2024-07-15'),
      fechapago: new Date('2024-07-01')
    },
    {
      codigo: "FV-004",
      codigopedido: "CP-1004",
      estadopago: "Pagado",
      fechalimitedepago: new Date('2024-07-11'),
      fechapago: new Date('2024-07-19')
    },
    {
      codigo: "FV-005",
      codigopedido: "CP-1005",
      estadopago: "Pendiente",
      fechalimitedepago: new Date('2024-07-25'),
      fechapago: new Date('2024-07-14')
    }
  ];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  constructor(
    private facturaService: FacturaService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    this.filterForm = this.fb.group({
      codigoPedido: [''],
      estadoPago: [''],
      fechaPago: ['']
    });

    this.facturaForm = this.fb.group({
      facturaCodigo: [''],
      pedidoCodigo: [''],
      estadoPago: ['Pendiente'],
      fechaLimite: [''],
      fechaPago: [''],
    });
  }

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource(this.facturas);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: any, column: string) {
    const filterValue = event.value ? event.value : (event.target as HTMLInputElement).value;
    this.dataSource.filterPredicate = (data: FacturaVenta, filter: string) => {
      const searchTerms = JSON.parse(filter);
      return (searchTerms.codigopedido ? data.codigopedido.toLowerCase().includes(searchTerms.codigopedido) : true)
        && (searchTerms.estadopago ? data.estadopago.toLowerCase().includes(searchTerms.estadopago) : true);// Convert to string before using includes
    };

    // Format date filter value if filtering by 'fechapago'

    const searchTerms = {
      codigopedido: column === 'codigopedido' ? filterValue.trim().toLowerCase() : '',
      estadopago: column === 'estadopago' ? filterValue.trim().toLowerCase() : ''
    };

    this.dataSource.filter = JSON.stringify(searchTerms);
  }

  resetFilters() {
    this.filterForm.reset();
    this.dataSource.filter = '';
  }

  onRowClicked(factura: FacturaVenta): void {
    this.facturaForm.patchValue({
      facturaCodigo: factura.codigo,
      pedidoCodigo: factura.codigopedido,
      estadoPago: factura.estadopago,
      fechaLimite: factura.fechalimitedepago,
      fechaPago: factura.fechapago,
    });
  }

  cancel(): void {
    this.facturaForm.reset();
  }

  onCancel() {
    this.resetFilters();
    this.facturaForm.reset();
  }

  onSave() {
    this.snackBar.open('Factura guardada exitosamente', 'Cerrar', {
      duration: 2000,
      panelClass: ['mat-toolbar', 'mat-primary'],
      verticalPosition: 'top',
      horizontalPosition: 'center'
    });
  }

  onSubmit(): void {
    if (this.facturaForm.valid) {
      console.log('Factura actualizada exitosamente:', this.facturaForm.getRawValue());
    }
  }
}
