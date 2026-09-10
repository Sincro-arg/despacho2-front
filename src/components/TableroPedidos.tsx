import type { EstadoPedido } from '../types';
import { ColumnaPedidos } from './ColumnaPedidos';

const COLUMNAS: Array<{ estado: EstadoPedido; titulo: string }> = [
  { estado: 'pendiente', titulo: 'Pendiente' },
  { estado: 'asignado', titulo: 'Asignado' },
  { estado: 'en_camino', titulo: 'En camino' },
  { estado: 'entregado', titulo: 'Entregado' },
];

export function TableroPedidos() {
  return (
    <div className="tablero">
      {COLUMNAS.map((columna) => (
        <ColumnaPedidos key={columna.estado} titulo={columna.titulo} estado={columna.estado} />
      ))}
    </div>
  );
}
