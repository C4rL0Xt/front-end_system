import { Caracteristica } from "./caracterisitca.model";

export interface Proveedor {
  idproveedor: string;
  empresa: string;
  direccion: string;
  telefono: string;
  email: string;
  ruc: string;
  calidad?: number;
  precio?: number;
  cumplimiento?: number;
  rate: number;
}
