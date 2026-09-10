import type { Pedido } from '../types';

const formateadorMoneda = new Intl.NumberFormat('es-AR', {
  style: 'currency',
  currency: 'ARS',
  maximumFractionDigits: 0,
});

interface Props {
  pedido: Pedido;
}

export function TarjetaPedido({ pedido }: Props) {
  return (
    <article
      className={`tarjeta${pedido.demorado ? ' tarjeta--demorado' : ''}`}
      data-testid="tarjeta-pedido"
    >
      {pedido.demorado && (
        <span className="tarjeta__badge" role="status">
          Demorado
        </span>
      )}
      <p className="tarjeta__cliente">{pedido.cliente}</p>
      <p className="tarjeta__direccion">{pedido.direccion}</p>
      <p className="tarjeta__zona">Zona: {pedido.zona}</p>
      <p className="tarjeta__importe">{formateadorMoneda.format(pedido.importe)}</p>
      {pedido.repartidor && (
        <p className="tarjeta__repartidor">Repartidor: {pedido.repartidor}</p>
      )}
    </article>
  );
}
