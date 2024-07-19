import { Component, Input, OnInit } from '@angular/core';
import { ElementRef } from '@angular/core';
import { TokenService } from '../../../modules/auth/services/token-service/token.service';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrl: './side-bar.component.css'
})
export class SideBarComponent implements OnInit {

  //? TEST DE ROL
  userRole: string = 'ROL_ALMACEN';
  menuOptions: any[] = [];
  @Input() rutaSide: string;

  constructor(
    private elementRef: ElementRef,
    private tokenService: TokenService
  ) {
    this.userRole = tokenService.getRolUser();
    this.setMenuItemsBasedOnRole();
  }

  ngOnInit() {
    const menuItems = this.elementRef.nativeElement.querySelectorAll('.menu-item') as NodeListOf<HTMLElement>;
    menuItems.forEach((menuItem: HTMLElement) => {
      menuItem.addEventListener('click', () => {
        // Elimina la clase 'active' de todos los elementos del menú
        menuItems.forEach(item => item.classList.remove('active'));
        // Agrega la clase 'active' al elemento seleccionado
        menuItem.classList.add('active');
      });
    });
  }

  setMenuItemsBasedOnRole() {
    if (this.userRole === 'ROL_ALMACEN') {
      this.menuOptions = [

        { label: 'Producto', route: '/home/almacen/productos', image: 'assets/icons/medicina.png' },
        { label: 'Documentos', route: '/home/almacen/documentos', image: 'assets/icons/documentos.png' }
      ];
    } else if (this.userRole === 'ROL_COMPRA') {
      this.menuOptions = [
        { label: 'Proveedores', route: '/home/compras/proveedor', image: 'assets/icons/hogar.png' },
        { label: 'Cotizaciones', route: '/home/compras/cotizacion', image: 'assets/icons/cotizacion.png' },
        { label: 'Documentos', route: '/home/compras/documents', image: 'assets/icons/documentos.png' }
      ]
    } else if (this.userRole === 'ROL_VENTA') {
      this.menuOptions = [
        { label: 'Clientes', route: '/home/ventas/clientes', image: 'assets/icons/audiencia.png' },
        { label: 'Pedidos', route: '/home/ventas/pedidos', image: 'assets/icons/orden.png' },
        { label: 'Facturas', route: '/home/ventas/facturas', image: 'assets/icons/factura.png' }
      ];

    } else if (this.userRole === 'ROLE_ADMIN') {
      this.menuOptions = [
        { label: 'Reportes', route: '/adm/reporte', image: 'assets/icons/informe.png' },
        { label: 'Gestionar', route: '/adm/gestionar', image: 'assets/icons/gestion.png' }
      ];
    } else if (this.userRole === 'ROL_TRANSPORTISTA') {
      this.menuOptions = [
        { label: 'Seguimiento', route: '/home/transportistas/seguimiento', image: 'assets/icons/informe.png' },
      ];
    }
  }

}
