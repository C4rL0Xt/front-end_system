import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map, switchMap } from 'rxjs/operators';
import { ProductoService } from '../../../services/product-service/producto.service';
import { Product } from '../../../../../core/models/product.model';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent implements OnInit {

  productControl = new FormControl();
  filteredProducts: Observable<Product[]>;
  selectedProducto: Product | null = null;

  @Output() productSelected: EventEmitter<Product> = new EventEmitter<Product>();

  constructor(private productService: ProductoService) {

  }

  ngOnInit(): void {

    this.filteredProducts = this.productControl.valueChanges.pipe(
      startWith(''),
      switchMap(value => this._filter(value))
    );

  }

  private _filter(value: string): Observable<Product[]> {
    const filterValue = value ? value.toString().toLowerCase() : '';
    return this.productService.getAllProducts().pipe(
      map(products => products.filter(product => product.name.toLowerCase().includes(filterValue)))
    );
  }


  onProductSelected(product: Product) {
    this.selectedProducto = product;
    this.productControl.setValue(product.name);
    console.log('Producto seleccionado: ', product);
    //this.productService.selectProduct(product);
  }

  sendProduct() {
    if (this.selectedProducto) {
      this.productSelected.emit(this.selectedProducto);
      this.clean();
    }
  }

  clean(): void {
    this.productControl.reset();
  }

}
