import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { Proveedor } from '../../../../core/models/proveedor.model';
import { map, Observable } from 'rxjs';

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


  constructor(private fb: FormBuilder) {

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
      rate: ['', Validators.required]

    });
  }

  ngOnInit() { }

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
  /*

  private _filter(value: string): Observable<Proveedor[]> {
    const filterValue = value ? value.toString().toLowerCase() : '';
    return this.productService.getAllProducts().pipe(
      map(products => products.filter(product => product.name.toLowerCase().includes(filterValue)))
    );
  }*/

  onSave(): void { }

  onCancel(): void { }
}
