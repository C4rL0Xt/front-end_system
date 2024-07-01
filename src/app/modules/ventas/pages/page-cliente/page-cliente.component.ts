import { Component, OnInit } from '@angular/core';
import { Cliente } from '../../../../core/models/cliente.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
interface Departamento {
  id: number;
  nombre: string;
}

@Component({
  selector: 'app-page-cliente',
  templateUrl: './page-cliente.component.html',
  styleUrl: './page-cliente.component.css'
})
export class PageClienteComponent implements OnInit {

  selectOption: string = '';
  selectedTab: number = 1;
  clienteEncontrado: any = null;

  tabs = [
    {
      label: 'Agregar cliente',
      route: '/clientes/agregarCliente',
    },
    {
      label: 'Editar cliente',
      route: '/clientes/actualizarCliente',
    },
    {
      label: 'Clientes',
      route: '/clientes/tablaClientes',
    },
  ];

  forms = [
    {
      label: 'Empresa',
      input: 'empresa',
      type: 'string'
    },
    {
      label: 'Representante',
      input: 'representante',
      type: 'string'
    },
    {
      label: 'DNI',
      input: 'dni',
      type: 'string'
    },
    {
      label: 'Email',
      input: 'email',
      type: 'string'
    },
    {
      label: 'Telefono',
      input: 'telefono',
      type: 'string'
    },
    {
      label: 'Direccion',
      input: 'direccion',
      type: 'string'
    }
  ];

  displayedColumns: string[] = [
    'idcliente',
    'empresa',
    'representante',
    'dni',
    'email',
    'telefono',
    'direccion',
    'iddepartamento',
  ];

  departamentos: Departamento[] = [
    { id: 1, nombre: 'Lima' },
    { id: 2, nombre: 'Cusco' },
    { id: 3, nombre: 'Arequipa' },
    // Añade más departamentos según sea necesario
  ];

  agregarClienteForm: FormGroup = new FormGroup({});
  buscarClienteForm: FormGroup = new FormGroup({});
  editarClienteForm: FormGroup = new FormGroup({});
  clients: any = [];
  lastClientId: string = 'CL0001';
  dataSource = new MatTableDataSource<any>();

  constructor(private fb: FormBuilder) {
    this.agregarClienteForm = this.fb.group({
      idcliente: [{ value: '', disabled: true }],
      empresa: ['', Validators.required],
      representante: ['', Validators.required],
      dni: ['', Validators.required],
      email: ['', Validators.required],
      telefono: ['', Validators.required],
      direccion: ['', Validators.required],
      iddepartamento: ['', Validators.required]
    });

    this.buscarClienteForm = this.fb.group({
      idcliente: ['', Validators.required]
    });

    this.editarClienteForm = this.fb.group({
      idcliente: [{ value: '', disabled: true }],
      empresa: [{ value: '', disabled: true }],
      representante: ['', Validators.required],
      dni: ['', Validators.required],
      email: ['', Validators.required],
      telefono: ['', Validators.required],
      direccion: ['', Validators.required],
      iddepartamento: ['', Validators.required]
    });
  }

  generatedClientId(): void {
    const currentIdNumber = parseInt(this.lastClientId.slice(2)) + 1;
    const newId = 'CL' + currentIdNumber.toString().padStart(4, '0');
    this.agregarClienteForm.get('idcliente')?.setValue(newId);
  }

  onSubmit(): void {
    if (this.agregarClienteForm.valid) {
      const clienteData = {
        ...this.agregarClienteForm.value,
        idcliente: this.agregarClienteForm.get('idcliente')?.value,
      };
      this.clients.push(clienteData);
      console.log('Cliente creada con éxito', clienteData);
      const currentIdNumber = parseInt(this.lastClientId.slice(2)) + 1;
      this.lastClientId = 'CL' + currentIdNumber.toString().padStart(4, '0');
      this.agregarClienteForm.reset();
      this.generatedClientId();
      this.resetFormState(this.agregarClienteForm);
    } else {
      console.log('Formulario inválido');
    }
  }

  onBuscarCliente(): void {
    const codigo = this.buscarClienteForm.get('idcliente')?.value;
    const cliente = this.clients.find((c: any) => c.idcliente === codigo);
    if (cliente) {
      this.clienteEncontrado = cliente;
      this.editarClienteForm.patchValue(cliente);
      console.log('Cliente encontrado', cliente);
    } else {
      this.clienteEncontrado = null;
      console.log('Cliente no encontrado');
    }
  }

  onUpdate(): void {
    if (this.editarClienteForm.valid) {
      Object.assign(this.clienteEncontrado, this.editarClienteForm.value);
      console.log('Cliente actualizado con éxito', this.clienteEncontrado);
      this.clienteEncontrado = null;
      this.buscarClienteForm.reset();
      this.editarClienteForm.reset();
      this.resetFormState(this.editarClienteForm);
    } else {
      console.log('Formulario invalido');
    }
  }

  ngOnInit(): void {
    this.generatedClientId();
  }

  onTabSelected(route: string): void {
    this.selectOption = route;
    console.log(`Navigating to ${route}`);
  }

  onCancel(): void {
    this.agregarClienteForm.reset();
    this.generatedClientId();
    this.editarClienteForm.reset();
    this.resetFormState(this.editarClienteForm);
  }

  resetFormState(form: FormGroup): void {
    form.markAsPristine();
    form.markAsUntouched();
    Object.keys(form.controls).forEach(key => {
      form.get(key)?.setErrors(null);
    });
  }


}
