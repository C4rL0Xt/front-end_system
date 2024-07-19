import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EditDetSolCotComponent } from '../edit-det-sol-cot/edit-det-sol-cot.component';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { DocumentService } from '../../../productos/services/document-service/document.service';
import { CotizacionCompraService } from '../../services/coti-compra-service/cotizacion-compra.service';
import { Solicitud } from '../../../../core/models/solicitudCompra.model';
import { CotiBySoli } from '../../../../core/models/cotiBySoli.model';

interface PurchaseRequest {
  id: number;
  number: string;
  date: string;
  description: string;
}

interface Quotation {
  id: number;
  provider: string;
  date: string;
  total: number;
  status: string; // accepted, rejected, pending
  purchaseRequestId: number;
}

@Component({
  selector: 'app-edit-sol-cot',
  templateUrl: './edit-sol-cot.component.html',
  styleUrl: './edit-sol-cot.component.css',
  animations: [
    trigger('fadeInOut', [
      state('void', style({
        opacity: 0
      })),
      transition(':enter, :leave', [
        animate(500)
      ])
    ]),
    trigger('slideInOut', [
      state('void', style({
        transform: 'translateY(-20px)',
        opacity: 0
      })),
      transition(':enter, :leave', [
        animate('300ms ease-in-out')
      ])
    ])
  ]
})
export class EditSolCotComponent implements OnInit {

  estados: { value: string, viewValue: string }[] = [
    { value: 'accepted', viewValue: 'Aceptado' },
    { value: 'rejected', viewValue: 'Rechazado' },
    { value: 'pending', viewValue: 'Pendiente' }
  ];
  form: FormGroup;
  purchaseRequests: Solicitud[] = [];
  quotations: CotiBySoli[] = [];
  selectedRequestQuotations: CotiBySoli[] = [];
  displayedColumns: string[] = ['nombreProveedor', 'fechaEntregaCotizacion', 'monto', 'estado', 'rate', 'actions'];
  id_selected: string;

  constructor(
    private fb: FormBuilder,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private documentoService: DocumentService,
    private cotizacionService: CotizacionCompraService
  ) {
    this.form = this.fb.group({
      selectedPurchaseRequest: ['', Validators.required]
    });
  }

  ngOnInit() {
    // Initialize with some dummy quotations
    this.loadSolicitudesCompra();

  }

  loadSolicitudesCompra(): void {
    this.documentoService.getAllSolicitudCompra().subscribe((solicitudes: Solicitud[]) => {
      this.purchaseRequests = solicitudes;
    },
      error => {
        console.error('Error loading solicitude compra requests', error);
      });
  }

  onPurchaseRequestSelectionChange(event: any): void {
    const selectedId = event.value;
    this.id_selected = selectedId;
    this.cotizacionService.getCotiBySoli(selectedId).subscribe(
      (cotis: CotiBySoli[]) => {
        this.selectedRequestQuotations = cotis;
        console.log('cotis para', selectedId, ' sus:', cotis);
      },
      error => {
        console.error('Error loading quotations', error);
        this.snackBar.open('Esta solicitud de compra no presenta cotizaciones registradas', 'Cerrar', {
          duration: 3000,
        });
      }
    );
  }


  openQuotationDetail(quotation: CotiBySoli): void {
    console.log('Opening dialog with quotation:', quotation);
    const dialogRef = this.dialog.open(EditDetSolCotComponent, {
      width: '400px',
      data: { quotation }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const index = this.selectedRequestQuotations.findIndex(q => q.nombreProveedor === result.nombreProveedor);
        if (index !== -1) {
          this.selectedRequestQuotations[index] = result;
          this.selectedRequestQuotations = [...this.selectedRequestQuotations];
          this.loadSolicitudesCompra();
          this.onPurchaseRequestSelectionChange({ value: this.id_selected });
        }
      }
    });
  }

}
