import { TestBed } from '@angular/core/testing';

import { SolicitudCotizacionService } from './solicitud-cotizacion.service';

describe('SolicitudCotizacionService', () => {
  let service: SolicitudCotizacionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SolicitudCotizacionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
