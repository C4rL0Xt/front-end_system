import { DetalleCotizacionVenta } from "./detalleCotizacionVenta";

export interface cotizacionVenta {
  idcotizacion: string;
  idempleado: string;
  estado: string;
  nombrecliente: string;
  montoproducto: number;
  fechaemision: Date;
  email: string;
  montoimpuesto: number;
  montototal: number;
  departamento: string;
  dni: string;
  detalles: DetalleCotizacionVenta[];
}
