export interface Pedido {
    idPedido: string;
    idCotizacion: string;
    idCliente: string;
    idMetodoPago: number;
    idEstadoEnvio: number;
    idEmpleado: string;
    fechaEntrega: Date;
    fechaEmision: Date;
  }