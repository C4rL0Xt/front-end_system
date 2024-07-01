import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormEditFacComponent } from './form-edit-fac.component';

describe('FormEditFacComponent', () => {
  let component: FormEditFacComponent;
  let fixture: ComponentFixture<FormEditFacComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FormEditFacComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FormEditFacComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
