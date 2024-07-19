import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ProductoService } from '../../../services/product-service/producto.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Product } from '../../../../../core/models/product.model';
import { estadoOperativo } from '../../../../../core/models/estadoOperativo.model';
import { estadoDisponibilidad } from '../../../../../core/models/estadoDisponibilidad.model';
import { estadoSeguridad } from '../../../../../core/models/estadoSeguridad.model';
import { ProfileService } from '../../../../../shared/services/profile/profile.service';
import { DocumentService } from '../../../services/document-service/document.service';

@Component({
  selector: 'app-editproducto',
  templateUrl: './editproducto.component.html',
  styleUrl: './editproducto.component.css'
})
export class EditproductoComponent implements OnInit, OnChanges {
  productForm: FormGroup;
  totalQuantity: number;
  lots: FormGroup[] = [];
  estadoOperativo: estadoOperativo[] = [];
  estadoDisponibilidad: estadoDisponibilidad[] = [];
  estadoSeguridad: estadoSeguridad[] = [];
  lastCodeLote: string;
  estadoDisponibilidadSelected: any;

  @Input() product: Product | null = null;

  constructor(private fb: FormBuilder, private productService: ProductoService, private snackBar: MatSnackBar,
    private profileService: ProfileService, private documentService: DocumentService
  ) {
    this.productForm = this.fb.group({
      code: [{ value: '', disabled: true }],
      name: [{ value: '', disabled: true }, Validators.required],
      category: [{ value: '', disabled: true }, Validators.required],
      type: [{ value: '', disabled: true }, Validators.required],
      price: [{ value: '', disabled: true }, [Validators.required, Validators.min(0)]],
      concentracion: [{ value: '', disabled: true }, [Validators.required, Validators.min(0)]],
      presentation: ['', Validators.required],
      description: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.loadAllStates();
    console.log('Estado Disponibilidad auu no:');

  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['product'] && changes['product'].currentValue) {
      this.productForm.patchValue(changes['product'].currentValue);
      this.productForm.updateValueAndValidity();
    }
  }

  enableForm() {
    Object.keys(this.productForm.controls).forEach(control => {
      this.productForm.controls[control].enable();
    });
  }

  disableForm() {
    Object.keys(this.productForm.controls).forEach(control => {
      this.productForm.controls[control].disable();
    });
  }

  modifyProduct() {
    // Submit the form to update the product
    this.snackBar.open('Product updated successfully!', 'Close', {
      duration: 2000,
    });
  }

  cancel(): void {
    this.productForm.reset();
    this.lots = [];
  }

  addLots() {
    if (this.productForm.valid) {
      const productData = this.productForm.getRawValue();
      let lotsData = [];

      if (this.lots.length > 0) {
        lotsData = this.lots.map(lot => lot.getRawValue());
      }

      const productoPresentationDto = {
        code: productData.code,
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
            idproducto: productData.code,
            cantidad: this.totalQuantity
          }
        ]
      };


      console.log('ProductoPresentationDto:', productoPresentationDto);
      console.log('Hoja de ingreso:', hojaIngreso);
      let productSaved = false;
      this.productService.updateProduct(productoPresentationDto).subscribe(
        (response) => {
          console.log('Product Saved successfully:', response);
          productSaved = true;
          if (productSaved) {
            this.documentService.createHojaIngreso(hojaIngreso).subscribe((response) => {
              console.log('Hoja de ingreso guardada exitosamente:', response);
              this.snackBar.open('Productos y lotes guardados exitosamente!', 'Cerrar', { duration: 3000 });

            });
            this.productForm.reset();
            this.lots = [];
            this.totalQuantity = undefined;
          }

        },
        (error) => {
          console.error('Error al guardar el producto:', error);
          this.snackBar.open('Error al guardar el producto', 'Cerrar', { duration: 3000 });
        }
      );

    } else {
      this.snackBar.open('Por favor completa el formulario correctamente', 'Cerrar', { duration: 2000 });
    }
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

  generateLots(): void {
    this.estadoDisponibilidadSelected = this.estadoDisponibilidad[0];
    console.log('Estado Disponibilidad a -> ', this.estadoDisponibilidadSelected);

    this.lots = [];
    const totalLots = Math.ceil(this.totalQuantity / 200);
    const productName = this.productForm.get('name').value;

    this.productService.getLastCodeLote$().subscribe((lastCode) => {
      const defaultOperation = this.estadoOperativo[0].estado;
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

        this.lots[i].patchValue({
          operationalStatus: defaultOperation,
        });
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
}
