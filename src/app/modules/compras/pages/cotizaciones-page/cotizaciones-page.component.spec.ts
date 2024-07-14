import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CotizacionesPageComponent } from './cotizaciones-page.component';

describe('CotizacionesPageComponent', () => {
  let component: CotizacionesPageComponent;
  let fixture: ComponentFixture<CotizacionesPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CotizacionesPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CotizacionesPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
