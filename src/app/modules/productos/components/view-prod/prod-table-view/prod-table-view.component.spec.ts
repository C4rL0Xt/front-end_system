import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProdTableViewComponent } from './prod-table-view.component';

describe('ProdTableViewComponent', () => {
  let component: ProdTableViewComponent;
  let fixture: ComponentFixture<ProdTableViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProdTableViewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProdTableViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
