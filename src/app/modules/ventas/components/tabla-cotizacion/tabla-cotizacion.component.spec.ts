import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TablaCotizacionComponent } from './tabla-cotizacion.component';

describe('TablaCotizacionComponent', () => {
  let component: TablaCotizacionComponent;
  let fixture: ComponentFixture<TablaCotizacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TablaCotizacionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TablaCotizacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
