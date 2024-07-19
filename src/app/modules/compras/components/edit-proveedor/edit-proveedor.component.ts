import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { Proveedor } from '../../../../core/models/proveedor.model';
import { map, Observable } from 'rxjs';
import { ProveedorService } from '../../services/proveedor-service/proveedor.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { RateProveedorDialogComponent } from '../rate-proveedor-dialog/rate-proveedor-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-edit-proveedor',
  templateUrl: './edit-proveedor.component.html',
  styleUrl: './edit-proveedor.component.css'
})
export class EditProveedorComponent implements OnInit {
  proveedorForm: FormGroup;
  dataSource: MatTableDataSource<Proveedor>;
  selectedProveedor: Proveedor;
  filterForm: FormGroup;
  filteredOptions: Observable<Proveedor[]>[] = [];

  displayedColumns: string[] = ['idproveedor', 'empresa', 'direccion', 'telefono', 'email', 'ruc', 'rate'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;


  constructor(private fb: FormBuilder,
    private proveedorService: ProveedorService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {

    this.filterForm = this.fb.group({
      //agregas filtro para tus busquedas
      //guiate de tabla-cotizacion en ventas/components
      idproveedor: [''],
      empresa: [''],

    });

    this.proveedorForm = this.fb.group({
      idproveedor: [{ value: '', disabled: true }],
      empresa: ['', Validators.required],
      direccion: ['', Validators.required],
      telefono: ['', Validators.required],
      email: ['', Validators.required],
      ruc: ['', Validators.required],
      rate: [{ value: '', disabled: true }]

    });
  }

  ngOnInit() {
    this.getAllProveedores();
  }

  getAllProveedores(): void {
    this.proveedorService.getProveedores$().subscribe(proveedores => {
      this.dataSource = new MatTableDataSource(proveedores);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  onRowClicked(proveedor: Proveedor): void {
    this.selectedProveedor = proveedor;


    // Asegurarse de que la fecha esté en el formato correcto (YYYY-MM-DD)


    this.proveedorForm.patchValue({
      idproveedor: proveedor.idproveedor,
      empresa: proveedor.empresa,
      direccion: proveedor.direccion,
      telefono: proveedor.telefono,
      email: proveedor.email,
      ruc: proveedor.ruc,
      rate: proveedor.rate
    });


    console.log('Cotizacion seleccionada:', proveedor);

  }

  openRateDialog(): void {
    const dialogRef = this.dialog.open(RateProveedorDialogComponent, {
      width: '400px',
      data: { rate: this.selectedProveedor }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.proveedorForm.patchValue({ rate: result.rate });
        if (this.selectedProveedor) {
          this.selectedProveedor.rate = result.rate;
        }
      }
    });
  }



  onSave(): void {
    if (this.proveedorForm.valid) {
      const proveedor = this.proveedorForm.getRawValue() as Proveedor;
      console.log('Proveedor a guardar:', proveedor);

      this.proveedorService.updateProveedor$(proveedor).subscribe((response) => {
        console.log('Proveedor guardado:', response);
        this.snackBar.open('Proveedor actualizado', 'Cerrar', { duration: 3000 });
        this.getAllProveedores();
        this.resetForm();
      },
        (error) => {
          console.error('Error al actualizar proveedor', error);
          this.snackBar.open('Error al actualizar proveedor', 'Cerrar', { duration: 3000 });
        });
    } else {
      this.snackBar.open('Por favor completa el formulario correctamente', 'Cerrar', { duration: 2000 });
    }
  }

  onCancel(): void {
    this.resetForm();
  }

  resetForm(): void {
    this.proveedorForm.reset();
    Object.keys(this.proveedorForm.controls).forEach(key => {
      this.proveedorForm.get(key).setErrors(null);
      this.proveedorForm.get(key).markAsPristine();
      this.proveedorForm.get(key).markAsUntouched();
    });
  }
}


/*

 private _filter(value: string): Observable<Proveedor[]> {
   const filterValue = value ? value.toString().toLowerCase() : '';
   return this.productService.getAllProducts().pipe(
     map(products => products.filter(product => product.name.toLowerCase().includes(filterValue)))
   );
 }*/
