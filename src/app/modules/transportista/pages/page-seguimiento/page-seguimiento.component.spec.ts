import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageSeguimientoComponent } from './page-seguimiento.component';

describe('PageSeguimientoComponent', () => {
  let component: PageSeguimientoComponent;
  let fixture: ComponentFixture<PageSeguimientoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PageSeguimientoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PageSeguimientoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
