export type EstadoPedido = 'pendiente' | 'asignado' | 'en_camino' | 'entregado' | 'cancelado';

export type EstadoRepartidor = 'activo' | 'inactivo';

export interface Repartidor {
  id: string | number;
  nombre: string;
  telefono: string;
  vehiculo: string;
  estado: EstadoRepartidor;
  /** false si ya tiene un pedido asignado en curso. Si no viene, se asume libre. */
  libre?: boolean;
}

export interface Pedido {
  id: string | number;
  cliente: string;
  direccion: string;
  zona: string;
  importe: number;
  estado: EstadoPedido;
  repartidor?: string | null;
  demorado?: boolean;
  telefono?: string;
  items?: string;
}
