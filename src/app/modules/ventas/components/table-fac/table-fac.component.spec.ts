import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableFacComponent } from './table-fac.component';

describe('TableFacComponent', () => {
  let component: TableFacComponent;
  let fixture: ComponentFixture<TableFacComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TableFacComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TableFacComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
