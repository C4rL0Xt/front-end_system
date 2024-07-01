import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DetalleCotizacionComponent } from '../detalle-cotizacion/detalle-cotizacion.component';
import { MatDialog } from '@angular/material/dialog';

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
  selectedTab: number = 1;
  selectOption: string = '';

  tabs = [
    {
      label: 'Generar Cotizacion',
      route: '/ventas/generarCotizacion',
    },
    {
      label: 'Cotizaciones',
      route: '/ventas/cotizaciones',
    },
    {
      label: 'Pedidos',
      route: '/ventas/pedidos',
    },
  ];

  departamentos: Departamento[] = [
    { id: 1, nombre: 'Lima' },
    { id: 2, nombre: 'Cusco' },
    { id: 3, nombre: 'Arequipa' }
  ];

  crearCotizacionVentaForm: FormGroup = new FormGroup({});
  cotizaciones: any = [];
  lastCotizacionVentaId: string = 'CV-001';

  constructor(private fb: FormBuilder, public dialog: MatDialog) {
    this.crearCotizacionVentaForm = this.fb.group({
      idcotizacion: [{ value: '', disabled: true }],
      idempleado: [{ value: '', disabled: true }],
      estado: [{ value: '', disabled: true }],
      nombrecliente: ['', Validators.required],
      montoproducto: [{ value: '', disabled: true }],
      fechaemision: ['', Validators.required],
      email: ['', Validators.required],
      montoimpuesto: [{ value: '', disabled: true }],
      montototal: [{ value: '', disabled: true }],
      iddepartamento: ['', Validators.required],
    });
  }

  openDetallePanel(): void { 
    const dialogRef = this.dialog.open(DetalleCotizacionComponent, {
      width: '600px',
      data: { cotizacionId: this.crearCotizacionVentaForm.get('idcotizacion')?.value }
    });
  }

  ngOnInit(): void {
    this.generateCotizacionVentaId();
  }

  generateCotizacionVentaId(): void {
    const currentIdNumber = parseInt(this.lastCotizacionVentaId.slice(3)) + 1;
    const newId = 'CV-' + currentIdNumber.toString().padStart(3, '0');
    this.crearCotizacionVentaForm.get('idcotizacion')?.setValue(newId);
  }

  onSubmit(): void {
    if (this.crearCotizacionVentaForm.valid) {
      const cotizacionVentaData = { ...this.crearCotizacionVentaForm.value, idcotizacion: this.crearCotizacionVentaForm.get('idcotizacion')?.value };
      this.cotizaciones.push(cotizacionVentaData);
      console.log('Cotizacion agregada con exito', cotizacionVentaData);
      this.lastCotizacionVentaId = cotizacionVentaData.idcotizacion;
      this.crearCotizacionVentaForm.reset();
      this.generateCotizacionVentaId();
    } else {
      console.log('formulario invalido');
    }
  }

  onCancel(): void {
    this.crearCotizacionVentaForm.reset();
    this.generateCotizacionVentaId();
  }


}
