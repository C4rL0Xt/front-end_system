import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DetalleCotizacionComponent } from '../detalle-cotizacion/detalle-cotizacion.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CotiVentaService } from '../../services/cotizacion-v-service/coti-venta.service';
import { ProfileService } from '../../../../shared/services/profile/profile.service';
import { Product } from '../../../../core/models/product.model';
import { ProductoService } from '../../../productos/services/product-service/producto.service';
import { map, Observable, startWith, switchMap } from 'rxjs';
import { cotizacionVenta } from '../../../../core/models/cotizacionVenta';

interface Departamento {
  id: number;
  nombre: string;
}

@Component({
  selector: 'app-form-cotizacion',
  templateUrl: './form-cotizacion.component.html',
  styleUrl: './form-cotizacion.component.css'
})
export class FormCotizacionComponent implements OnInit {
  cotizacionForm: FormGroup;
  last_code: string;

  productos: Product[] = [];
  filteredProducts: Observable<Product[]>;
  filteredOptions: Observable<Product[]>[] = [];
  selectedProducto: Product | null = null;

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

  estados = ['Pendiente', 'Pagado', 'Cancelado'];

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private cotizacionService: CotiVentaService,
    private profileService: ProfileService,
    private productService: ProductoService
  ) {
    this.cotizacionForm = this.fb.group({
      idcotizacion: [{ value: '', disabled: true }],
      idempleado: [{ value: '', disabled: true }],
      estado: [{ value: 'Pendiente', disabled: true }],
      nombrecliente: ['', Validators.required],
      montoproducto: [{ value: '', disabled: true }],
      fechaemision: ['', Validators.required],
      email: ['', Validators.required],
      montoimpuesto: [{ value: '', disabled: true }],
      montototal: [{ value: '', disabled: true }],
      departamento: ['', Validators.required],
      dni: ['', Validators.required],
      detalles: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.initDataForm();
    this.getProductos();

  }

  private _filter(value: string): Observable<Product[]> {
    const filterValue = value ? value.toString().toLowerCase() : '';
    return this.productService.getAllProducts().pipe(
      map(products => products.filter(product => product.name.toLowerCase().includes(filterValue)))
    );
  }

  onProductSelected(product: Product) {
    this.selectedProducto = product;

    console.log('Producto seleccionado: ', product);
  }

  getProductos(): void {
    this.productService.getAllProducts().subscribe(products => {
      this.productos = products;
      console.log('Productos:', products);
    });
  }


  initDataForm(): void {
    this.getLastCodeCotiVenta();
    this.setCurretEmisionDate();
    this.setCodigoEmpleado();
  }

  setCurretEmisionDate(): void {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = ('0' + (currentDate.getMonth() + 1)).slice(-2); // Añade 1 al mes ya que los meses son base 0
    const day = ('0' + currentDate.getDate()).slice(-2);

    const formattedDate = `${year}-${month}-${day}`;
    this.cotizacionForm.patchValue({ fechaemision: formattedDate });
  }

  setCodigoEmpleado(): void {
    const id_emp = this.profileService.getIdEmpleado();
    this.cotizacionForm.patchValue({ idempleado: id_emp });
    this.cotizacionForm.patchValue({ estado: 'Pendiente' });
  }

  getLastCodeCotiVenta(): void {
    this.cotizacionService.getLastCodeCotiVenta$().subscribe(code => {
      this.cotizacionForm.patchValue({ idcotizacion: code });
      this.generateCode(code);
      console.log('Codigo de cotizacion:', code);
    });
  }

  generateCode(lastCode: string): void {
    const prefix = lastCode.slice(0, 3);
    const numberPart = lastCode.slice(3);
    const nextNumber = parseInt(numberPart, 10) + 1;
    const nextNumberPadded = nextNumber.toString().padStart(numberPart.length, '0');
    const nextCode = `${prefix}${nextNumberPadded}`;
    this.cotizacionForm.patchValue({ idcotizacion: nextCode });
    this.cotizacionForm.get('idcotizacion').disable();
  }

  get detalles() {
    return this.cotizacionForm.get('detalles') as FormArray;
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

    productoControl.valueChanges.subscribe(value => {
      const selectedProduct = this.productos.find(producto => producto.name === value);
      if (selectedProduct) {
        detalleFormGroup.patchValue({
          concentracion: selectedProduct.concentracion
        });
        console.log('Producto seleccionado 22:', selectedProduct);
      }
    });


    return detalleFormGroup;
  }

  addDetalle(): void {
    this.detalles.push(this.initDetalle());
  }

  removeDetalle(index: number): void {
    this.detalles.removeAt(index);
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

  saveEverything(): void {

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
      let cotizacionSaved = false;
      this.cotizacionService.createCotizacionVenta(cotizacionVentaDto).subscribe((response) => {
        console.log('Cotizacion guardada exitosamente:', response);
        cotizacionSaved = true;
        if (cotizacionSaved) {
          this.snackBar.open('Productos y lotes guardados exitosamente!', 'Cerrar', {
            duration: 3000,
            panelClass: ['snack-bar-success'],
            verticalPosition: 'top',
            horizontalPosition: 'center',
          });

          this.cotizacionForm.reset();
          this.detalles.clear();
          this.initDataForm();
        }
      },
        (error) => {
          console.error('Error al guardar el producto y los lotes', error);
          this.snackBar.open('Error al guardar el producto y los lotes', 'Cerrar', { duration: 3000 });
        });
    } else {
      this.snackBar.open('Por favor completa el formulario correctamente', 'Cerrar', { duration: 2000 });
    }


  }

  cancel(): void {
    this.cotizacionForm.reset();
  }

  onSubmit(): void {
    if (this.cotizacionForm.valid) {
      console.log('Producto guardado existosamente:', this.cotizacionForm.getRawValue());
    }
  }

}
