import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DocumentService } from '../../services/document-service/document.service';
import { Solicitud } from '../../../../core/models/solicitudCompra.model';
import { ProfileService } from '../../../../shared/services/profile/profile.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HojaIngreso } from '../../../../core/models/hojaingreso.model';
import { GuiasRemision } from '../../../../core/models/guias.model';
import { PedidoService } from '../../../ventas/services/pedido-service/pedido.service';
import { Pedido } from '../../../../core/models/pedido.model';
import { ProductoService } from '../../services/product-service/producto.service';




@Component({
  selector: 'app-documents',
  templateUrl: './documents.component.html',
  styleUrl: './documents.component.css',
})


export class DocumentsComponent implements OnInit {
  last_code_solicitud: string;
  last_code_guia: string;

  pedidoPendiente: Pedido[] = [];

  formGuia = [
    {
      label: 'id del empleado',
      input: 'idempleado',
      type: 'string'
    }, {
      label: 'id del pedido',
      input: 'idpedido',
      type: 'string'
    }, {
      label: 'fecha entrega',
      input: 'fechaentrega',
      type: 'date'
    },

  ]


  forms = [{
    label: 'Nombre del producto',
    input: 'nombreProducto',
    type: 'string'
  },
  {
    label: 'Cantidad requerida',
    input: 'cantidadRequerida',
    type: 'string'
  },
  {
    label: 'Plazo de entrega',
    input: 'plazoEntrega',
    type: 'date'
  },
  {
    label: 'Id Asistente',
    input: 'identificacion',
    type: 'string'
  }
  ];

  selectedTab: number = 1;

  selectOption: string = '';
  tabs = [
    {
      label: 'Solicitudes de compra',
      route: '/documents/crearSolicitud',
    },
    {
      label: 'Hojas de ingreso',
      route: '/documents/crearHoja',
    },
    {
      label: 'Generar guia',
      route: '/documents/guia',
    },
  ];


  crearSolicitudForm: FormGroup = new FormGroup({});
  updateSolicitudForm: FormGroup = new FormGroup({});
  crearGuiaForm: FormGroup = new FormGroup({});
  updateGuiaForm: FormGroup;

  solicitudes: any = []; //pa mis productos ficticios
  guias: GuiasRemision[] = [];

  filteredSolicitudes: Solicitud[] = [];
  estadoFilter: string = '';

  hojas: HojaIngreso[] = [];
  uniqueHojas: string[] = [];
  uniqueProductos: string[] = [];
  uniqueEmpleados: string[] = [];
  filteredHojas: HojaIngreso[] = [];
  filteredProductNames: string[] = [];

  constructor(private fb: FormBuilder, private documentService: DocumentService, private productoService: ProductoService,
    private pedidoService: PedidoService, private profileService: ProfileService, private snackBar: MatSnackBar) {
    this.crearSolicitudForm = this.fb.group({
      id_solicitud: [{ value: '', disabled: true }],
      nombreProducto: ['', Validators.required],
      cantidadRequerida: ['', Validators.required],
      plazoEntrega: ['', Validators.required],
      identificacion: [{ value: 'EMP004', disabled: true }, Validators.required],
      estado: [{ value: 'Pendiente', disabled: true }],
    });

    this.filteredSolicitudes = this.solicitudes;

    this.updateSolicitudForm = this.fb.group({
      id_solicitud: [''],
      nombreProducto: [''],
      cantidadRequerida: ['', Validators.required],
      plazoEntrega: ['', Validators.required],
      identificacion: ['', Validators.required],
      estado: [{ value: 'Pendiente', disabled: true }],
    });

    this.crearGuiaForm = this.fb.group({
      idguia: [{ value: '', disabled: true }, Validators.required],
      idempleado: [{ value: localStorage.getItem('idempleado'), disabled: true }, Validators.required],
      idpedido: ['', Validators.required],
      fechaentrega: ['', Validators.required]
    });

    this.updateGuiaForm = this.fb.group({
      idguia: [{ value: '', disabled: true }],
      idempleado: [{ value: '', disabled: true }],
      idpedido: [{ value: '', disabled: true }, Validators.required],
      fechaentrega: ['', Validators.required]
    });
  }



  ngOnInit(): void {
    this.generateGuiaId();

    this.filteredHojas = [...this.hojas];
    this.loadSolicitudes();
    this.loadLastCodeSolicitud();
    this.loadHojaIngreso();
    this.loadGuiaRemision();
    this.loadLsatCodeGuia();
    this.loadPedidosEnPreparacion();
  }

  /* desde la api */

  loadSolicitudes(): void {
    this.documentService.getAllSolicitudCompra().subscribe((response: Solicitud[]) => {
      console.log("Solicitudes resividas:  ", response);
      this.solicitudes = response;
      this.filteredSolicitudes = this.solicitudes;
    });
  }

  loadLastCodeSolicitud(): void {
    this.documentService.getLastCodeSolicitud$().subscribe(code => {
      this.crearSolicitudForm.patchValue({ id_solicitud: code });
      this.generateNextCode(code);
      console.log('Last code de solicitud:', code);
    });

    this.crearSolicitudForm.patchValue({ id_solicitud: this.last_code_solicitud });
  }

  loadLsatCodeGuia(): void {
    this.documentService.getLastCodeGuia$().subscribe(code => {
      this.crearGuiaForm.patchValue({ idguia: code });
      this.last_code_guia = code;
      this.generateNextCode(code);
      console.log('Last code de guia:', code);
    });

    this.crearGuiaForm.patchValue({ idguia: this.last_code_guia });
  }

  generateNextCode(lastCode: string): void {
    const prefix = lastCode.slice(0, 3);
    const numberPart = lastCode.slice(3);
    const nextNumber = parseInt(numberPart, 10) + 1;
    const nextNumberPadded = nextNumber.toString().padStart(numberPart.length, '0');
    const nextCode = `${prefix}${nextNumberPadded}`;
    if (prefix === 'SO-') {
      this.crearSolicitudForm.patchValue({ id_solicitud: nextCode });
    } else {
      this.crearGuiaForm.patchValue({ idguia: nextCode });
    }

  }

  loadAllDataSolicitud(): void {
    this.loadSolicitudes();
    this.loadLastCodeSolicitud();
  }

  loadAllDataGuia(): void {
    this.loadGuiaRemision();
    this.loadLsatCodeGuia();
  }

  saveSolicitud(): void {
    if (this.crearSolicitudForm.valid) {
      const solicitudData = this.crearSolicitudForm.getRawValue();
      const solicitudPresentationDto = {
        id_solicitud: solicitudData.id_solicitud,
        nombreProducto: solicitudData.nombreProducto,
        cantidadRequerida: solicitudData.cantidadRequerida,
        plazoEntrega: solicitudData.plazoEntrega,
        identificacion: solicitudData.identificacion,
        codigoempleado: this.profileService.getIdEmpleado(),
        estado: 'Pendiente'
      };

      this.documentService.createSolicitudCompra(solicitudPresentationDto).subscribe((response) => {
        console.log('Solicitud creada con exito', response);
        this.snackBar.open('Solicitud creada con éxito', 'Cerrar', {
          duration: 3000,
          panelClass: ['snack-bar-success'],
          verticalPosition: 'top',
          horizontalPosition: 'center',
        });
        this.crearSolicitudForm.reset();
        this.loadAllDataSolicitud();
      }, (error) => {
        console.error('Error al guardar la solicitud de compra', error);
        this.snackBar.open('Error al guardar la solicitud de compra', 'Cerrar', { duration: 3000 });
      });

    } else {
      this.snackBar.open('Por favor completa el formulario correctamente', 'Cerrar', { duration: 2000 });
    }
  }

  updateSolicitud(): void {
    if (this.updateSolicitudForm.valid) {
      const solicitudData = this.updateSolicitudForm.value;
      const solicitudPresentationDto = {
        id_solicitud: solicitudData.id_solicitud,
        nombreProducto: solicitudData.nombreProducto,
        cantidadRequerida: solicitudData.cantidadRequerida,
        plazoEntrega: solicitudData.plazoEntrega,
        identificacion: solicitudData.identificacion,
        codigoempleado: this.profileService.getIdEmpleado(),
        estado: 'Pendiente'
      };

      this.documentService.updateSolicitudCompra(solicitudPresentationDto).subscribe((response) => {
        console.log('Solicitud actualizada con éxito', response);
        this.snackBar.open('Solicitud actualizada con éxito', 'Cerrar', {
          duration: 3000,
          panelClass: ['snack-bar-success'],
          verticalPosition: 'top',
          horizontalPosition: 'center',
        });
        this.updateSolicitudForm.reset();
        this.loadAllDataSolicitud();
      },
        (error) => {
          console.error('Error al guardar la hoja de ingreso', error);
          this.snackBar.open('Error al guardar la hoja de ingreso', 'Cerrar', { duration: 3000 });
        });

    } else {
      this.snackBar.open('Por favor completa el formulario correctamente', 'Cerrar', { duration: 2000 });

    }
    this.loadAllDataSolicitud();
  }

  loadHojaIngreso(): void {
    this.documentService.getAllHojaIngreso().subscribe((response: HojaIngreso[]) => {
      console.log('Respuesta completa de la API:', response);
      this.hojas = response;
      this.filteredHojas = this.hojas;
      this.getUniqueValues();
    });
  }

  getUniqueValues(): void {
    this.uniqueHojas = [...new Set(this.hojas.map(hoja => hoja.idhoja))];
    this.uniqueProductos = [...new Set(this.hojas.flatMap(hoja => hoja.detalles.map(detalle => detalle.nombreProducto)))];
    this.uniqueEmpleados = [...new Set(this.hojas.map(hoja => hoja.idempleado))];
  }


  loadGuiaRemision(): void {
    this.documentService.getAllGuiaRemision().subscribe((response: GuiasRemision[]) => {
      console.log('Respuesta completa de la API:', response);
      this.guias = response;
    });
  }

  saveGuia(): void {
    if (this.crearGuiaForm.valid) {
      const guiaData = this.crearGuiaForm.getRawValue();
      const guiaDto = {
        idguiaremision: guiaData.idguia,
        idempleado: this.profileService.getIdEmpleado(),
        idpedido: guiaData.idpedido,
        fecha_envio: guiaData.fechaentrega
      };

      console.log('Guia a guardar:', guiaDto);


      this.documentService.createGuiaRemision(guiaDto).subscribe((response) => {
        console.log('Guia creada con éxito', response);
        this.snackBar.open('Guia creada con éxito', 'Cerrar', {
          duration: 3000,
          panelClass: ['snack-bar-success'],
          verticalPosition: 'top',
          horizontalPosition: 'center',
        });
        this.crearGuiaForm.reset();
        this.loadAllDataGuia();
        this.loadPedidosEnPreparacion();

      }, (error) => {
        console.error('Error al guardar la guia de remision', error);
        this.snackBar.open('Error al guardar la guia de remision', 'Cerrar', { duration: 3000 });
      });

    } else {
      this.snackBar.open('Por favor completa el formulario correctamente', 'Cerrar', { duration: 2000 });
    }
  }

  updateGuia(): void {
    if (this.updateGuiaForm.valid) {
      const guiaData = this.updateGuiaForm.getRawValue();
      const guiadto = {
        idguiaremision: guiaData.idguia,
        idempleado: this.profileService.getIdEmpleado(),
        idpedido: guiaData.idpedido,
        fecha_envio: guiaData.fechaentrega
      }

      console.log('Guia a actualizar:', guiadto);

      this.documentService.updateGuiaRemision(guiadto).subscribe((response) => {
        console.log('Guia actualizada con éxito', response);
        this.snackBar.open('Guia actualizada con éxito', 'Cerrar', {
          duration: 3000,
          panelClass: ['snack-bar-success'],
          verticalPosition: 'top',
          horizontalPosition: 'center',
        });
        this.updateGuiaForm.reset();
        this.loadAllDataGuia();
      }, (error) => {
        console.error('Error al guardar la guia de remision', error);
        this.snackBar.open('Error al guardar la guia de remision', 'Cerrar', { duration: 3000 });
      });
    }
  }


  loadPedidosEnPreparacion(): void {
    this.pedidoService.getAllPedidos().subscribe((response: Pedido[]) => {
      this.pedidoPendiente = response.filter(pedido => pedido.idEstadoEnvio === 1);
    });
  }

  onSelectPedido(pedido: Pedido): void {
    this.crearGuiaForm.patchValue({ idpedido: pedido.idPedido });
  }

  /* ------ fin api */



  generateGuiaId(): void {

  }




  onSubmit(): void {


  }

  filtrarSolicitudes(): void {
    if (this.estadoFilter) {
      this.filteredSolicitudes = this.solicitudes.filter(solicitud => solicitud.estado === this.estadoFilter);
    } else {
      this.filteredSolicitudes = this.solicitudes;
    }
  }

  onCancel(): void {
    this.crearSolicitudForm.reset();

    this.crearGuiaForm.reset();
    this.loadAllDataGuia();

  }

  selectRow(solicitud: any): void {
    this.updateSolicitudForm.patchValue({
      id_solicitud: solicitud.id_solicitud,
      nombreProducto: solicitud.nombreProducto,
      cantidadRequerida: solicitud.cantidadRequerida,
      plazoEntrega: solicitud.plazoEntrega,
      codigoempleado: this.profileService.getIdEmpleado(),
      identificacion: solicitud.identificacion,
      estado: solicitud.estado,
    });
  }

  selectRowGuia(guia: GuiasRemision): void {
    this.updateGuiaForm.patchValue({
      idguia: guia.idguiaremision,
      idempleado: guia.idempleado,
      idpedido: guia.idpedido,
      fechaentrega: guia.fecha_envio,
    });
  }


  onUpdateSubmit(): void {
    /*
    if (this.updateSolicitudForm.valid) {

      console.log('Solicitud actualizada con éxito');

    } else {
      console.log('Formulario de actualización inválido');
    }

    if (this.updateGuiaForm.valid) {
      const updatedValues = this.updateGuiaForm.value;

      const guia = this.guias.find((s: Guia) => s.id_guia === this.updateGuiaForm.get('idguia')?.value);
      if (guia) {
        // Only update the fields that are present in the update form
        Object.keys(updatedValues).forEach(key => {
          if (updatedValues[key] !== '' && updatedValues[key] !== null) {
            guia[key as keyof Guia] = updatedValues[key];
          }
        });
        console.log('Guia actualizada con éxito', guia);
      }
    } else {
      console.log('Formulario de actualización inválido');
    }*/
  }

  onUpdateCancel(): void {
    this.updateSolicitudForm.reset();
    this.updateGuiaForm.reset();
  }

  onTabSelected(route: string): void {
    this.selectOption = route;
    console.log(`Navigating to ${route}`);
  }




  //hOJAS DE INGRESO


  applyFilter(): void {
    const idHoja = (document.getElementById('filterIdHoja') as HTMLSelectElement).value.toLowerCase();
    const idProducto = (document.getElementById('filterProducto') as HTMLSelectElement).value.toLowerCase();
    const fecha = (document.getElementById('filterFecha') as HTMLInputElement).value;

    this.filteredHojas = this.hojas.filter(hoja => {
      const matchesIdHoja = !idHoja || hoja.idhoja.toLowerCase().includes(idHoja);
      const matchesIdProducto = !idProducto || hoja.detalles.some(detalle => detalle.nombreProducto?.toLowerCase().includes(idProducto));
      const matchesFecha = !fecha || new Date(hoja.fechaingreso).toISOString().includes(fecha);
      return matchesIdHoja && matchesIdProducto && matchesFecha;
    });
  }

  resetFilters(): void {
    (document.getElementById('filterIdHoja') as HTMLSelectElement).value = '';
    (document.getElementById('filterProducto') as HTMLSelectElement).value = '';
    (document.getElementById('filterFecha') as HTMLInputElement).value = '';
    this.filteredHojas = this.hojas;
  }



  selectProductName(producto: string) {
    (document.getElementById('filterNombreProducto') as HTMLInputElement).value = producto;
    this.filteredProductNames = [];
    this.applyFilter();
  }

}
