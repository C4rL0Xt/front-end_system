import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormNewFacComponent } from './form-new-fac.component';

describe('FormNewFacComponent', () => {
  let component: FormNewFacComponent;
  let fixture: ComponentFixture<FormNewFacComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FormNewFacComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FormNewFacComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
