export interface FacturaVenta {
  idFactura: string;
  idPedido: string;
  idEstadoPago: number;
  fechaLimite: Date;
  fechaPago: Date;
}
