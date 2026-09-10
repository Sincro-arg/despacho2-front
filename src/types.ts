export type EstadoPedido = 'pendiente' | 'asignado' | 'en_camino' | 'entregado';

export type EstadoRepartidor = 'activo' | 'inactivo';

export interface Repartidor {
  id: string | number;
  nombre: string;
  telefono: string;
  vehiculo: string;
  estado: EstadoRepartidor;
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
}
