import { TestBed } from '@angular/core/testing';

import { FactCompraService } from './fact-compra.service';

describe('FactCompraService', () => {
  let service: FactCompraService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FactCompraService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
