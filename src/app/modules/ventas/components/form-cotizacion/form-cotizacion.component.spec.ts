import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormCotizacionComponent } from './form-cotizacion.component';

describe('FormCotizacionComponent', () => {
  let component: FormCotizacionComponent;
  let fixture: ComponentFixture<FormCotizacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FormCotizacionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FormCotizacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
