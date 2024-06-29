import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageClienteComponent } from './page-cliente.component';

describe('PageClienteComponent', () => {
  let component: PageClienteComponent;
  let fixture: ComponentFixture<PageClienteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PageClienteComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PageClienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
