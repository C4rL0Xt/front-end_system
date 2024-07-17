import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RateProveedorDialogComponent } from './rate-proveedor-dialog.component';

describe('RateProveedorDialogComponent', () => {
  let component: RateProveedorDialogComponent;
  let fixture: ComponentFixture<RateProveedorDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RateProveedorDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RateProveedorDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
