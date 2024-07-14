import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-add-proveedor',
  templateUrl: './add-proveedor.component.html',
  styleUrl: './add-proveedor.component.css',
})
export class AddProveedorComponent implements OnInit {
  proveedorForm: FormGroup;

  constructor(private fb: FormBuilder, private snackBar: MatSnackBar) {
    this.proveedorForm = this.fb.group({
      idproveedor: [{ value: '', disabled: true }],
      empresa: ['', Validators.required],
      direccion: ['', Validators.required],
      telefono: ['', Validators.required],
      email: ['', Validators.required],
      ruc: ['', Validators.required],
      rate: ['', Validators.required]

    });
  }

  ngOnInit() { }

  onSubmit(): void {
    if (this.proveedorForm.valid) {
      console.log(
        'Producto guardado existosamente:',
        this.proveedorForm.getRawValue()
      );
    }
  }

  cancel(): void {
    console.log('Cancelado');
  }

  saveEverything(): void { }
}
