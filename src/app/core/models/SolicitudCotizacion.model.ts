import { DetalleSolicitudCotizacion } from "./DetalleSolicitudCotizacion.model";

export interface SolicitudCotizacion {
  idsolicitudcotizacion: string;
  idsolicitudcompra: string;
  fechacreacion: Date;
  detalles: DetalleSolicitudCotizacion[];
}
