import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Proveedor } from '../../../../core/models/proveedor.model';
import { ProveedorService } from '../../services/proveedor-service/proveedor.service';

@Component({
  selector: 'app-add-proveedor',
  templateUrl: './add-proveedor.component.html',
  styleUrl: './add-proveedor.component.css',
})
export class AddProveedorComponent implements OnInit {
  proveedorForm: FormGroup;

  constructor(private fb: FormBuilder, private snackBar: MatSnackBar, private proveedorService: ProveedorService) {
    this.proveedorForm = this.fb.group({
      idproveedor: [{ value: '', disabled: true }],
      empresa: ['', Validators.required],
      direccion: ['', Validators.required],
      telefono: ['', Validators.required],
      email: ['', Validators.required],
      ruc: ['', Validators.required],
      rate: [{ value: 0, disabled: true }]

    });
  }

  ngOnInit() { this.generateRandomCode(); }

  onSubmit(): void {
    if (this.proveedorForm.valid) {
      console.log(
        'Producto guardado existosamente:',
        this.proveedorForm.getRawValue()
      );
    }
  }

  generateRandomCode() {
    const randomNumber = Math.floor(Math.random() * 10000);
    const randomCode = `P_${randomNumber.toString().padStart(4, '0')}`;
    this.proveedorForm.patchValue({ idproveedor: randomCode });
  }


  cancel(): void {
    console.log('Cancelado');
  }

  saveEverything(): void {
    if (this.proveedorForm.valid) {
      const proveedor = this.proveedorForm.getRawValue() as Proveedor;
      console.log('Guardando proveedor', proveedor);
      this.proveedorService.createProveedor$(proveedor).subscribe(
        (response) => {
          console.log('Respuesta de la API', response);
          this.snackBar.open('Proveedor guardado con exito', 'Cerrar', {
            duration: 2000,
          });
          this.proveedorForm.reset();
          this.generateRandomCode();
        },
        (error) => {
          console.log('Error al guardar proveedor', error);
          this.snackBar.open('Error al guardar proveedor', 'Cerrar', {
            duration: 2000,
          });

        }
      );
    }
  }
}
