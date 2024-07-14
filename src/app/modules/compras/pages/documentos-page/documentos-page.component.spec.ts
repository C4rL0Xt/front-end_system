import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentosPageComponent } from './documentos-page.component';

describe('DocumentosPageComponent', () => {
  let component: DocumentosPageComponent;
  let fixture: ComponentFixture<DocumentosPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DocumentosPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DocumentosPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
