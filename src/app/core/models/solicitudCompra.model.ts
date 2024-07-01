export interface Solicitud {
  id_solicitud: string;
  nombreProducto: string;
  cantidadRequerida: string;
  plazoEntrega: string;
  identificacion: string;
  codigoempleado?: string;
  estado: string;

}
