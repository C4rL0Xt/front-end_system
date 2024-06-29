import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LotTableViewComponent } from './lot-table-view.component';

describe('LotTableViewComponent', () => {
  let component: LotTableViewComponent;
  let fixture: ComponentFixture<LotTableViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LotTableViewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LotTableViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
