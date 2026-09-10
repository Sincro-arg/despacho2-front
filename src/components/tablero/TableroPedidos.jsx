import { useRepartidores } from '../../hooks/useRepartidores';
import { ColumnaPedidos } from './ColumnaPedidos';
import './TableroPedidos.css';

const COLUMNAS = [
  { estado: 'pendiente', titulo: 'Pendiente' },
  { estado: 'asignado', titulo: 'Asignado' },
  { estado: 'en_camino', titulo: 'En camino' },
  { estado: 'entregado', titulo: 'Entregado' },
];

export function TableroPedidos() {
  const { repartidores } = useRepartidores();

  const repartidoresPorId = repartidores.reduce((mapa, repartidor) => {
    mapa[repartidor.id] = repartidor;
    return mapa;
  }, {});

  return (
    <div className="tablero">
      {COLUMNAS.map((columna) => (
        <ColumnaPedidos
          key={columna.estado}
          estado={columna.estado}
          titulo={columna.titulo}
          repartidoresPorId={repartidoresPorId}
        />
      ))}
    </div>
  );
}
