import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { MatSnackBar } from '@angular/material/snack-bar';
import { ProductoService } from '../../../services/product-service/producto.service';
import { Category } from '../../../../../core/models/category.model';
import { Forma } from '../../../../../core/models/forma.model';
import { estadoOperativo } from '../../../../../core/models/estadoOperativo.model';
import { estadoDisponibilidad } from '../../../../../core/models/estadoDisponibilidad.model';
import { estadoSeguridad } from '../../../../../core/models/estadoSeguridad.model';
import { Product } from '../../../../../core/models/product.model';
import { DocumentService } from '../../../services/document-service/document.service';
import { ProfileService } from '../../../../../shared/services/profile/profile.service';
import { DetalleHoja } from '../../../../../core/models/detallhoja.model';

@Component({
  selector: 'app-producto-form',
  templateUrl: './producto-form.component.html',
  styleUrl: './producto-form.component.css'
})
export class ProductoFormComponent implements OnInit {
  productForm: FormGroup;
  lots: FormGroup[] = [];
  totalQuantity: number;
  estadoOperativo: estadoOperativo[] = [];
  estadoDisponibilidad: estadoDisponibilidad[] = [];
  estadoSeguridad: estadoSeguridad[] = [];
  categories: Category[] = []
  types: Forma[] = []
  lastCode: string;
  lastCodeLote: string;

  constructor(private fb: FormBuilder, private snackBar: MatSnackBar, private productService: ProductoService, private documentService: DocumentService, private profileService: ProfileService) {
    this.productForm = this.fb.group({
      codigo: [{ value: '', disabled: true }],
      name: ['', Validators.required],
      category: ['', Validators.required],
      type: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(0)]],
      weight: ['', [Validators.required, Validators.min(0)]],
      presentation: ['', Validators.required],
      description: ['', Validators.required]
    });

  }



  ngOnInit(): void {
    this.loadAllCategories();
    this.loadAllTypes();
    this.loadLastCode();
    this.loadAllStates();
  }

  loadLastCode(): void {
    this.productService.getLastCode$().subscribe(code => {
      this.productForm.patchValue({ codigo: code });
      this.generateCode(code);
      console.log('ultim Code:', code);
    });

    this.productForm.patchValue({ codigo: this.lastCode });
  }

  generateCode(last_code: string): void {
    const lastCode = parseInt(last_code.substring(last_code.length - 3));
    const newCode = lastCode + 1;
    this.productForm.patchValue({ codigo: `PRO${newCode}` });
    this.productForm.get('codigo').disable();
  }


  loadAllCategories(): void {
    this.productService.getAllCategories$().subscribe((response: Category[]) => {
      this.categories = response;
    }
    )
  }

  loadAllTypes(): void {
    this.productService.getAllForms$().subscribe((response: Forma[]) => {
      this.types = response;
    })
  }

  loadAllStates(): void {
    this.productService.getAllEstadoDisponibilidad$().subscribe((response: estadoDisponibilidad[]) => {
      this.estadoDisponibilidad = response;
    })

    this.productService.getAllEstadoOperativo$().subscribe((response: estadoOperativo[]) => {
      this.estadoOperativo = response;
    })

    this.productService.getAllEstadoSeguridad$().subscribe((response: estadoSeguridad[]) => {
      this.estadoSeguridad = response;
    })

  }

  onSubmit(): void {
    if (this.productForm.valid) {


      console.log('Producto guardado existosamente:', this.productForm.getRawValue());
    }


  }

  generateLots(): void {
    this.lots = [];
    const totalLots = Math.ceil(this.totalQuantity / 200);
    const productName = this.productForm.get('name').value;

    this.productService.getLastCodeLote$().subscribe(lastCode => {

      let nextCodeNumber = this.extractNumberFromCode(lastCode) + 1;
      for (let i = 0; i < totalLots; i++) {
        const quantity = (i === totalLots - 1 && this.totalQuantity % 200 !== 0) ? this.totalQuantity % 200 : 200;
        const nextCode = this.generateNextCode(nextCodeNumber);
        this.lots.push(this.fb.group({
          code: [{ value: nextCode, disabled: true }, Validators.required],
          operationalStatus: ['', Validators.required],
          availabilityStatus: ['', Validators.required],
          securityStatus: ['', Validators.required],
          productName: [{ value: productName, disabled: true }],
          quantity: [{ value: quantity, disabled: true }, [Validators.required, Validators.min(1), Validators.max(200)]],
          expirationDate: ['', Validators.required]
        }));
        nextCodeNumber++;
      }
      error => {
        console.error('Error al obtener el último código de lote', error);
        // Manejo de errores, por ejemplo, mostrar una alerta al usuario
        this.snackBar.open('Error al obtener el último código de lote', 'Cerrar', { duration: 3000 });
      }

    });



  }

  private extractNumberFromCode(code: string): number {
    // Extraer el número del código del último lote (por ejemplo, de 'L00100' extraer 100)
    return parseInt(code.replace(/^L0*/, ''), 10);
  }

  private generateNextCode(number: number): string {
    // Generar el próximo código de lote con el número proporcionado
    return `L${number.toString().padStart(5, '0')}`; // Ajusta el formato del número como L00100
  }

  saveEverything(): void {
    if (this.productForm.valid && this.lots.every(lot => lot.valid)) {
      const productData = this.productForm.getRawValue();
      const lotsData = this.lots.map(lot => lot.getRawValue());

      const productoPresentationDto = {
        code: productData.codigo,
        category: productData.category,
        type: productData.type,
        name: productData.name,
        price: productData.price,
        concentracion: productData.concentracion,
        presentation: productData.presentation,
        description: productData.description,
        lots: lotsData.map(lot => ({
          code: lot.code,
          operativeStatus: lot.operationalStatus,
          disponibilityState: lot.availabilityStatus,
          securityState: lot.securityStatus,
          stock: lot.quantity,
          expiredDate: lot.expirationDate
        }))
      };

      const hojaIngreso = {
        idhoja: 'a',
        idempleado: this.profileService.getIdEmpleado(),
        fechaingreso: new Date(),
        detalles: [
          {
            idproducto: productData.codigo,
            cantidad: this.totalQuantity
          }
        ]
      };

      let productSaved = false;
      this.productService.createProduct(productoPresentationDto).subscribe((response) => {
        console.log('Product Saved successfully:', response);

        productSaved = true;

        // Solo si el producto se guardó correctamente, intentamos guardar la hoja de ingreso
        if (productSaved) {
          this.documentService.createHojaIngreso(hojaIngreso).subscribe((response) => {
            console.log('Hoja de ingreso guardada exitosamente:', response);
            this.snackBar.open('Productos y lotes guardados exitosamente!', 'Cerrar', {
              duration: 3000,
              panelClass: ['snack-bar-success'],
              verticalPosition: 'top',
              horizontalPosition: 'center',
            });
            this.productForm.reset();
            this.loadLastCode();
            this.lots = [];
            this.totalQuantity = undefined;
          }, (error) => {
            console.error('Error al guardar la hoja de ingreso', error);
            this.snackBar.open('Error al guardar la hoja de ingreso', 'Cerrar', { duration: 3000 });
          });
        }

      }, (error) => {
        console.error('Error al guardar el producto y los lotes', error);
        this.snackBar.open('Error al guardar el producto y los lotes', 'Cerrar', { duration: 3000 });
      });

    } else {
      this.snackBar.open('Por favor completa el formulario correctamente', 'Cerrar', { duration: 2000 });
    }
  }

  cancel(): void {
    this.productForm.reset();
    this.lots = [];
  }
}
