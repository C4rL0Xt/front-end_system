import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FacturaPageComponent } from './factura-page.component';

describe('FacturaPageComponent', () => {
  let component: FacturaPageComponent;
  let fixture: ComponentFixture<FacturaPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FacturaPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FacturaPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
