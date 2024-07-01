import { DetalleHoja } from './detallhoja.model';
export interface HojaIngreso {
  idhoja: string,
  idempleado: string,
  fechaingreso: Date,
  detalles: DetalleHoja[]
}
