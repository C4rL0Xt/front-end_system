import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditSolCotComponent } from './edit-sol-cot.component';

describe('EditSolCotComponent', () => {
  let component: EditSolCotComponent;
  let fixture: ComponentFixture<EditSolCotComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditSolCotComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditSolCotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
