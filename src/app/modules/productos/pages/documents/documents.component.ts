import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

interface Guia {
  id_guia: string;
  id_empleado: string;
  id_pedido: string;
  fecha: string
}


// Define the interface for solicitudes
interface Solicitud {
  id_solicitud: string;
  nombreProducto: string;
  cantidadRequerida: string;
  plazoEntrega: string;
  fecha: string;
  identificacion: string;
}

@Component({
  selector: 'app-documents',
  templateUrl: './documents.component.html',
  styleUrl: './documents.component.css',
})


export class DocumentsComponent implements OnInit {


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
    label: 'Fecha',
    input: 'fecha',
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

  /* Manejo de formulario */
  crearSolicitudForm: FormGroup = new FormGroup({});
  updateSolicitudForm: FormGroup = new FormGroup({});
  crearGuiaForm: FormGroup = new FormGroup({});
  updateGuiaForm: FormGroup = new FormGroup({});

  //categories = ['Medicamento','Suplemento','Cosmetico'];
  //forms = ['Tableta','Capsula','Liquido','Polvo'];
  solicitudes: any = []; //pa mis productos ficticios
  guias: any = [];
  lastSolicitudId: string = 'SOL001';
  lastGuiaId: string = 'GR001';

  constructor(private fb: FormBuilder) {
    this.crearSolicitudForm = this.fb.group({
      id_solicitud: [{ value: '', disabled: true }],
      nombreProducto: ['', Validators.required],
      cantidadRequerida: ['', Validators.required],
      plazoEntrega: ['', Validators.required],
      fecha: ['', [Validators.required, Validators.min(0)]],
      identificacion: ['', Validators.required],
    });

    this.updateSolicitudForm = this.fb.group({
      id_solicitud: [{ value: '', disabled: true }],
      nombreProducto: [{ value: '', disabled: true }],
      cantidadRequerida: ['', Validators.required],
      plazoEntrega: ['', Validators.required],
    });

    this.crearGuiaForm = this.fb.group({
      idguia: [{ value: '', disabled: true }],
      idempleado: ['', Validators.required],
      idpedido: ['', Validators.required],
      fechaentrega: ['', Validators.required]
    });

    this.updateGuiaForm = this.fb.group({
      idguia: [{ value: '', disabled: true }],
      idempleado: [{ value: '', disabled: true }],
      idpedido: ['', Validators.required],
      fechaentrega: ['', Validators.required]
    });
  }

  hojas = [
    { idhoja: 1, idProducto: 201, nombreProducto: 'Producto A', cantidad: 10, fechaIngreso: '2024-06-01', empleado: 101 },
    { idhoja: 2, idProducto: 202, nombreProducto: 'Producto B', cantidad: 5, fechaIngreso: '2024-06-02', empleado: 102 },
    { idhoja: 3, idProducto: 203, nombreProducto: 'Producto C', cantidad: 7, fechaIngreso: '2024-06-03', empleado: 101 },

    // Agregar más hojas aquí
  ];
  filteredHojas = [...this.hojas];
  uniqueHojas = [];
  uniqueProductos = [];
  uniqueEmpleados = [];
  filteredProductNames = [];

  ngOnInit(): void {
    this.generateSolicitudId();
    this.generateGuiaId();
    this.getUniqueValues();

    // Inicialización de filteredHojas
    this.filteredHojas = [...this.hojas];
  }

  generateSolicitudId(): void {
    const currentIdNumber = parseInt(this.lastSolicitudId.slice(3)) + 1;
    const newId = 'SOL' + currentIdNumber.toString().padStart(3, '0');
    this.crearSolicitudForm.get('id_solicitud')?.setValue(newId);
  }

  generateGuiaId(): void {
    const currentIdNumber = parseInt(this.lastGuiaId.slice(2)) + 1;
    const newId = 'GR' + currentIdNumber.toString().padStart(2, '0');
    this.crearGuiaForm.get('idguia')?.setValue(newId);
  }


  onSubmit(): void {
    if (this.crearSolicitudForm.valid) {
      const solicitudData = {
        ...this.crearSolicitudForm.value,
        id_solicitud: this.crearSolicitudForm.get('id_solicitud')?.value,
      };
      this.solicitudes.push(solicitudData);
      console.log('Solicitud creada con éxito', solicitudData);

      // Actualizar el último ID de solicitud
      const currentIdNumber = parseInt(this.lastSolicitudId.slice(3)) + 1;
      this.lastSolicitudId = 'SOL' + currentIdNumber.toString().padStart(3, '0');

      // Generar nuevo ID de solicitud y vaciar el formulario
      this.crearSolicitudForm.reset();
      this.generateSolicitudId();
    } else {
      console.log('Formulario inválido');
    }

    if (this.crearGuiaForm.valid) {
      const guiaData = {
        ...this.crearGuiaForm.value,
        idguia: this.crearGuiaForm.get('idguia')?.value,
      };
      this.guias.push(guiaData);
      console.log('Guia creada con éxito', guiaData);

      // Actualizar el último ID de solicitud
      const currentIdNumberGuia = parseInt(this.lastGuiaId.slice(2)) + 1;
      this.lastGuiaId = 'GR' + currentIdNumberGuia.toString().padStart(2, '0');

      // Generar nuevo ID de solicitud y vaciar el formulario
      this.crearGuiaForm.reset();
      this.generateGuiaId();
    } else {
      console.log('Formulario inválido');
    }
  }

  onCancel(): void {
    this.crearSolicitudForm.reset();
    this.generateSolicitudId();
    this.crearGuiaForm.reset();
    this.generateGuiaId();
  }

  selectRow(solicitud: any): void {
    this.updateSolicitudForm.patchValue({
      id_solicitud: solicitud.id_solicitud,
      nombreProducto: solicitud.nombreProducto,
      cantidadRequerida: solicitud.cantidadRequerida,
      plazoEntrega: solicitud.plazoEntrega,
    });
  }

  selectRowGuia(guia: any): void {
    this.updateGuiaForm.patchValue({
      idguia: guia.idguia,
      idempleado: guia.idempleado,
      idpedido: guia.idpedido,
      fechaentrega: guia.fechaentrega,
    });
  }


  onUpdateSubmit(): void {
    if (this.updateSolicitudForm.valid) {
      const updatedValues = this.updateSolicitudForm.value;

      const solicitud = this.solicitudes.find((s: Solicitud) => s.id_solicitud === this.updateSolicitudForm.get('id_solicitud')?.value);
      if (solicitud) {
        // Only update the fields that are present in the update form
        Object.keys(updatedValues).forEach(key => {
          if (updatedValues[key] !== '' && updatedValues[key] !== null) {
            solicitud[key as keyof Solicitud] = updatedValues[key];
          }
        });
        console.log('Solicitud actualizada con éxito', solicitud);
      }
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
    }
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

  getUniqueValues() {
    this.uniqueHojas = [...new Set(this.hojas.map(hoja => hoja.idhoja))];
    this.uniqueProductos = [...new Set(this.hojas.map(hoja => hoja.idProducto))];
    this.uniqueEmpleados = [...new Set(this.hojas.map(hoja => hoja.empleado))];
  }
  applyFilter() {
    const idHoja = (document.getElementById('filterIdHoja') as HTMLSelectElement).value.toLowerCase();
    const idProducto = (document.getElementById('filterProducto') as HTMLSelectElement).value.toLowerCase();
    const empleado = (document.getElementById('filterEmpleado') as HTMLSelectElement).value.toLowerCase();
    const fecha = (document.getElementById('filterFecha') as HTMLInputElement).value;

    this.filteredHojas = this.hojas.filter(hoja => {
      return (
        (!idHoja || hoja.idhoja.toString().toLowerCase().includes(idHoja)) &&
        (!idProducto || hoja.idProducto.toString().toLowerCase().includes(idProducto)) &&
        (!empleado || hoja.empleado.toString().toLowerCase().includes(empleado)) &&
        (!fecha || hoja.fechaIngreso.includes(fecha))
      );
    });
  }

  filterProductNames() {
    const input = (document.getElementById('filterNombreProducto') as HTMLInputElement).value.toLowerCase();
    this.filteredProductNames = this.uniqueProductos.filter(producto =>
      producto.toLowerCase().includes(input)
    );
  }

  selectProductName(producto: string) {
    (document.getElementById('filterNombreProducto') as HTMLInputElement).value = producto;
    this.filteredProductNames = [];
    this.applyFilter();
  }

}
