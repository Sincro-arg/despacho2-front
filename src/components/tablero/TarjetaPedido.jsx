import { esPedidoDemorado, formatearImporte } from '../../utils/pedidos';
import './TarjetaPedido.css';

export function TarjetaPedido({ pedido, repartidor }) {
  const demorado = esPedidoDemorado(pedido);

  return (
    <article className={`tarjeta-pedido${demorado ? ' tarjeta-pedido--demorado' : ''}`}>
      {demorado && <span className="tarjeta-pedido__badge">Demorado</span>}
      <p className="tarjeta-pedido__cliente">{pedido.cliente}</p>
      <p className="tarjeta-pedido__direccion">{pedido.direccion}</p>
      <div className="tarjeta-pedido__fila">
        <span className="tarjeta-pedido__zona">{pedido.zona}</span>
        <span className="tarjeta-pedido__importe">{formatearImporte(pedido.importe)}</span>
      </div>
      {repartidor && (
        <p className="tarjeta-pedido__repartidor">Repartidor: {repartidor.nombre}</p>
      )}
    </article>
  );
}
