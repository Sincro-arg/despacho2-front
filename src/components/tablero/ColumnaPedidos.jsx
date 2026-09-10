import { usePedidosPorEstado } from '../../hooks/usePedidosPorEstado';
import { TarjetaPedido } from './TarjetaPedido';
import './ColumnaPedidos.css';

// Cada columna trae sus propios pedidos y resuelve su propio estado de
// carga/vacio/error: si una columna falla, las demas siguen mostrando
// sus datos con normalidad.
export function ColumnaPedidos({ estado, titulo, repartidoresPorId }) {
  const { estadoCarga, pedidos, errorMensaje, recargar } = usePedidosPorEstado(estado);

  return (
    <section className="columna">
      <header className="columna__header">
        <h2 className="columna__titulo">{titulo}</h2>
        <span className="columna__contador">{estadoCarga === 'listo' ? pedidos.length : ''}</span>
      </header>

      <div className="columna__cuerpo">
        {estadoCarga === 'cargando' && <p className="columna__mensaje">Cargando pedidos...</p>}

        {estadoCarga === 'error' && (
          <div className="columna__mensaje columna__mensaje--error">
            <p>{errorMensaje}</p>
            <button type="button" onClick={recargar}>
              Reintentar
            </button>
          </div>
        )}

        {estadoCarga === 'listo' && pedidos.length === 0 && (
          <p className="columna__mensaje">No hay pedidos en este estado.</p>
        )}

        {estadoCarga === 'listo' &&
          pedidos.map((pedido) => (
            <TarjetaPedido
              key={pedido.id}
              pedido={pedido}
              repartidor={pedido.repartidorId ? repartidoresPorId[pedido.repartidorId] : null}
            />
          ))}
      </div>
    </section>
  );
}
