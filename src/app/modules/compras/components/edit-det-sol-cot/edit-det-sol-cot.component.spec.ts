import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditDetSolCotComponent } from './edit-det-sol-cot.component';

describe('EditDetSolCotComponent', () => {
  let component: EditDetSolCotComponent;
  let fixture: ComponentFixture<EditDetSolCotComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditDetSolCotComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditDetSolCotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
