import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PagePedidoComponent } from './page-pedido.component';

describe('PagePedidoComponent', () => {
  let component: PagePedidoComponent;
  let fixture: ComponentFixture<PagePedidoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PagePedidoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PagePedidoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
