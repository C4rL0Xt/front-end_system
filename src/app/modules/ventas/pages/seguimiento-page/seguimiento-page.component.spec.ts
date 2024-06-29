import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeguimientoPageComponent } from './seguimiento-page.component';

describe('SeguimientoPageComponent', () => {
  let component: SeguimientoPageComponent;
  let fixture: ComponentFixture<SeguimientoPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SeguimientoPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SeguimientoPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
