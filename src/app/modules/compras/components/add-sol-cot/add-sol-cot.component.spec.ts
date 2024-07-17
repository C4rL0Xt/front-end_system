import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSolCotComponent } from './add-sol-cot.component';

describe('AddSolCotComponent', () => {
  let component: AddSolCotComponent;
  let fixture: ComponentFixture<AddSolCotComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddSolCotComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddSolCotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
