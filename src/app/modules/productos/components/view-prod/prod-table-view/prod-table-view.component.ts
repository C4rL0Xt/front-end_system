import { Component, OnInit, Output, ViewChild, EventEmitter } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { Product } from '../../../../../core/models/product.model';
import { LotTableViewComponent } from '../lot-table-view/lot-table-view.component';
import { ProductoService } from '../../../services/product-service/producto.service';


@Component({
  selector: 'app-prod-table-view',
  templateUrl: './prod-table-view.component.html',
  styleUrl: './prod-table-view.component.css'
})
export class ProdTableViewComponent implements OnInit {
  displayedColumns: string[] = ['code', 'name', 'category', 'type', 'price', 'concentracion', 'presentation', 'description', 'actions'];
  dataSource: MatTableDataSource<Product> = new MatTableDataSource();

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  products: Product[] = []

  selectedProduct: Product | null = null;
  @Output() productSelected: EventEmitter<Product> = new EventEmitter<Product>();

  constructor(public dialog: MatDialog, private productService: ProductoService) { }
  ngOnInit() {
    this.loadProducts();
    //this.dataSource = new MatTableDataSource(this.products);

  }



  onProductSelected(product: Product) {
    this.selectedProduct = product;
    console.log('Producto seleccionado: ', product);
    if (this.selectedProduct) {
      this.productSelected.emit(this.selectedProduct);
    }
  }

  loadProducts(): void {
    this.productService.getAllProducts().subscribe(
      (response: Product[]) => {
        console.log("Productos resividos:  ", response);
        this.products = response;

        this.dataSource = new MatTableDataSource(this.products);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;

      })
  }

  showLots(product: Product) {
    const dialogRef = this.dialog.open(LotTableViewComponent, {
      width: '80%',
      data: product.lots
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }



}

/*

  products: Product[] = [
    {
      code: 'P001',
      category: 'Electronics',
      type: 'Mobile',
      name: 'Smartphone X',
      price: 999.99,
      concentracion: 0.5,
      presentation: 'Box',
      description: 'Latest model of Smartphone X with advanced features.',
      lots: [
        { code: 'L001', operativeStatus: 'Active', disponibilityState: 'Available', securityState: 'Secured', stock: 50, expiredDate: new Date('2024-12-31') },
        { code: 'L002', operativeStatus: 'Inactive', disponibilityState: 'Unavailable', securityState: 'Secured', stock: 0, expiredDate: new Date('2023-12-31') }
      ]
    },
    {
      code: 'P002',
      category: 'Home Appliance',
      type: 'Kitchen',
      name: 'Blender Pro',
      price: 129.99,
      concentracion: 2.3,
      presentation: 'Box',
      description: 'High-performance blender with multiple speed settings.',
      lots: [
        { code: 'L003', operativeStatus: 'Active', disponibilityState: 'Available', securityState: 'Secured', stock: 20, expiredDate: new Date('2025-12-31') },
        { code: 'L004', operativeStatus: 'Active', disponibilityState: 'Available', securityState: 'Secured', stock: 10, expiredDate: new Date('2024-12-31') }
      ]
    },
    {
      code: 'P003',
      category: 'Furniture',
      type: 'Living Room',
      name: 'Sofa Set',
      price: 799.99,
      concentracion: 30,
      presentation: 'Packaged',
      description: 'Comfortable and stylish sofa set.',
      lots: [
        { code: 'L005', operativeStatus: 'Active', disponibilityState: 'Available', securityState: 'Secured', stock: 5, expiredDate: new Date('2026-12-31') }
      ]
    }
  ];*/
