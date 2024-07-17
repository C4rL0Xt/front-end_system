export interface Solicitud {
  id_solicitud: string;
  nombreProducto: string;
  cantidadRequerida: string;
  plazoEntrega: Date
  identificacion: string;
  codigoempleado?: string;
  estado: string;
}
