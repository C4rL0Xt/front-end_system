import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Product } from '../../../../core/models/product.model';


@Component({
  selector: 'app-producto-page',
  templateUrl: './producto-page.component.html',
  styleUrl: './producto-page.component.css'
})
export class ProductoPageComponent implements OnInit {
  selectedTab: number = 1;

  selectOption: string = '';
  tabs = [
    {
      label: 'Nuevo Producto', route: '/producto/nuevo'
    }, {
      label: 'Editar Producto', route: '/producto/editar'
    }, {
      label: 'Tabla de productos', route: '/producto/all'
    }
  ]

  selectedProduct: Product | null = null;
  selectedOption: string = '/producto/all';
  /* Manejo de formulario */
  productForm: FormGroup = new FormGroup({});

  categories = ['Medicamento', 'Suplemento', 'Cosmetico'];
  forms = ['Tableta', 'Capsula', 'Liquido', 'Polvo'];
  products: any = [];  //pa mis productos ficticios
  lastProductId: string = 'PRO001';

  constructor(private fb: FormBuilder) {
    this.productForm = this.fb.group({
      id_producto: [{ value: '', disabled: true }],
      nombre: ['', Validators.required],
      categoria: ['', Validators.required],
      forma: ['', Validators.required],
      precio: ['', [Validators.required, Validators.min(0)]],
      concentracion: ['', Validators.required],
      presentacion: ['', Validators.required],
      descripcion: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.generateProductId();

  }



  onProductSelected(product: Product) {
    this.selectedProduct = product;

  }
  generateProductId(): void {
    const currentIdNumber = parseInt(this.lastProductId.slice(3)) + 1;
    const newId = 'PRO' + currentIdNumber.toString().padStart(3, '0');
    this.productForm.get('id_producto')?.setValue(newId);
  }

  onSubmit(): void {
    if (this.productForm.valid) {
      const productData = { ...this.productForm.value, id_producto: this.productForm.get('id_producto')?.value };
      this.products.push(productData);
      console.log('Producto agregado con exito', productData);
      this.lastProductId = productData.id_producto;
      this.generateProductId();
      this.productForm.reset();
      this.productForm.get('id_producto')?.setValue(this.lastProductId);
    } else {
      console.log('formulario invalido');
    }
  }
  onTabSelected(route: string): void {
    // Navigate to the selected route
    // This can be done using Angular Router, for example

    this.selectOption = route;
    console.log(`Navigating to ${route}`);
  }
}
