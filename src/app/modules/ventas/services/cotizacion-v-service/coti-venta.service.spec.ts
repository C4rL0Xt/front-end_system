import { TestBed } from '@angular/core/testing';

import { CotiVentaService } from './coti-venta.service';

describe('CotiVentaService', () => {
  let service: CotiVentaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CotiVentaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
