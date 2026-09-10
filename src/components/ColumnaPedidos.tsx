import { usePedidosPorEstado } from '../hooks/usePedidosPorEstado';
import type { EstadoPedido } from '../types';
import { TarjetaPedido } from './TarjetaPedido';

interface Props {
  titulo: string;
  estado: EstadoPedido;
  version?: number;
  onCambio?: () => void;
}

export function ColumnaPedidos({ titulo, estado, version = 0, onCambio }: Props) {
  const { pedidos, cargando, error, reintentar } = usePedidosPorEstado(estado, version);

  return (
    <section className="columna" aria-label={titulo}>
      <header className="columna__header">
        <h2>{titulo}</h2>
        {!cargando && !error && <span className="columna__contador">{pedidos.length}</span>}
      </header>

      <div className="columna__body">
        {cargando && <p className="columna__estado">Cargando pedidos…</p>}

        {!cargando && error && (
          <div className="columna__estado columna__estado--error">
            <p>No se pudieron cargar los pedidos.</p>
            <button type="button" onClick={reintentar}>
              Reintentar
            </button>
          </div>
        )}

        {!cargando && !error && pedidos.length === 0 && (
          <p className="columna__estado">No hay pedidos en {titulo.toLowerCase()}.</p>
        )}

        {!cargando &&
          !error &&
          pedidos.map((pedido) => (
            <TarjetaPedido key={pedido.id} pedido={pedido} onCambio={onCambio} />
          ))}
      </div>
    </section>
  );
}
