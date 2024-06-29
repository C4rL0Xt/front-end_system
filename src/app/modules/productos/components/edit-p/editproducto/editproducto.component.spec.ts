import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditproductoComponent } from './editproducto.component';

describe('EditproductoComponent', () => {
  let component: EditproductoComponent;
  let fixture: ComponentFixture<EditproductoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditproductoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditproductoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
