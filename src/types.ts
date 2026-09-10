export type EstadoPedido = 'pendiente' | 'asignado' | 'en_camino' | 'entregado' | 'cancelado';

export type EstadoRepartidor = 'activo' | 'inactivo';

/** Estado operativo real durante el turno, distinto de la baja logica (`estado`). */
export type EstadoOperativo = 'libre' | 'en_ruta' | 'descanso';

export interface Repartidor {
  id: string | number;
  nombre: string;
  telefono: string;
  vehiculo: string;
  estado: EstadoRepartidor;
  /** estado operativo real (libre/en_ruta/descanso). Si no viene, se infiere de `libre`. */
  estadoOperativo?: EstadoOperativo;
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

export interface EntregasPorRepartidor {
  repartidorId: string | number;
  repartidor: string;
  entregas: number;
}

export interface MetricasTurno {
  entregados: number;
  facturado: number;
  tiempoPromedioMinutos: number;
  demorados: number;
  porRepartidor: EntregasPorRepartidor[];
}
