import { TestBed } from '@angular/core/testing';

import { CotizacionCompraService } from './cotizacion-compra.service';

describe('CotizacionCompraService', () => {
  let service: CotizacionCompraService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CotizacionCompraService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
