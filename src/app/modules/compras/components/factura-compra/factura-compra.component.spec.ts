import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FacturaCompraComponent } from './factura-compra.component';

describe('FacturaCompraComponent', () => {
  let component: FacturaCompraComponent;
  let fixture: ComponentFixture<FacturaCompraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FacturaCompraComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FacturaCompraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
