export type EstadoPedido = 'pendiente' | 'asignado' | 'en_camino' | 'entregado';

export interface Pedido {
  id: string | number;
  cliente: string;
  direccion: string;
  zona: string;
  importe: number;
  estado: EstadoPedido;
  repartidor?: string | null;
  demorado?: boolean;
}
