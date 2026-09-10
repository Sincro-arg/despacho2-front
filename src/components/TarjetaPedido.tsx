import { useCallback, useState } from 'react';
import {
  asignarPedido,
  cancelarPedido,
  liberarPedido,
  marcarEnCamino,
  marcarEntregado,
} from '../api/pedidos';
import type { Pedido, Repartidor } from '../types';
import { DialogoAsignar } from './DialogoAsignar';
import { DialogoCancelar } from './DialogoCancelar';

const formateadorMoneda = new Intl.NumberFormat('es-AR', {
  style: 'currency',
  currency: 'ARS',
  maximumFractionDigits: 0,
});

type NombreAccion = 'en_camino' | 'entregado' | 'liberar';
type Dialogo = 'asignar' | 'cancelar' | null;

interface Props {
  pedido: Pedido;
  onCambio?: () => void;
}

export function TarjetaPedido({ pedido, onCambio }: Props) {
  const [dialogo, setDialogo] = useState<Dialogo>(null);
  const [procesando, setProcesando] = useState<NombreAccion | null>(null);
  const [mensaje, setMensaje] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const ejecutar = useCallback(
    async (nombreAccion: NombreAccion, accion: () => Promise<Pedido>, mensajeExito: string) => {
      setProcesando(nombreAccion);
      setError(null);
      try {
        await accion();
        setMensaje(mensajeExito);
        onCambio?.();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setProcesando(null);
      }
    },
    [onCambio],
  );

  const asignar = useCallback(
    async (repartidorId: Repartidor['id']) => {
      await asignarPedido(pedido.id, repartidorId);
      setDialogo(null);
      setMensaje('Pedido asignado.');
      onCambio?.();
    },
    [pedido.id, onCambio],
  );

  const cancelar = useCallback(
    async (motivo: string) => {
      await cancelarPedido(pedido.id, motivo);
      setDialogo(null);
      setMensaje('Pedido cancelado.');
      onCambio?.();
    },
    [pedido.id, onCambio],
  );

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

      {mensaje && (
        <p className="tarjeta__confirmacion" role="status">
          {mensaje}
        </p>
      )}
      {error && (
        <p className="tarjeta__error" role="alert">
          {error}
        </p>
      )}

      <div className="tarjeta__acciones">
        {pedido.estado === 'pendiente' && (
          <button type="button" onClick={() => setDialogo('asignar')} disabled={procesando !== null}>
            Asignar
          </button>
        )}

        {pedido.estado === 'asignado' && (
          <button
            type="button"
            onClick={() => ejecutar('en_camino', () => marcarEnCamino(pedido.id), 'Pedido en camino.')}
            disabled={procesando !== null}
          >
            {procesando === 'en_camino' ? 'Marcando…' : 'En camino'}
          </button>
        )}

        {pedido.estado === 'en_camino' && (
          <button
            type="button"
            onClick={() => ejecutar('entregado', () => marcarEntregado(pedido.id), 'Pedido entregado.')}
            disabled={procesando !== null}
          >
            {procesando === 'entregado' ? 'Marcando…' : 'Entregado'}
          </button>
        )}

        {(pedido.estado === 'asignado' || pedido.estado === 'en_camino') && (
          <button
            type="button"
            onClick={() => ejecutar('liberar', () => liberarPedido(pedido.id), 'Repartidor liberado.')}
            disabled={procesando !== null}
          >
            {procesando === 'liberar' ? 'Liberando…' : 'Liberar'}
          </button>
        )}

        {pedido.estado !== 'entregado' && pedido.estado !== 'cancelado' && (
          <button
            type="button"
            className="tarjeta__boton-cancelar"
            onClick={() => setDialogo('cancelar')}
            disabled={procesando !== null}
          >
            Cancelar
          </button>
        )}
      </div>

      {dialogo === 'asignar' && (
        <DialogoAsignar pedido={pedido} onAsignar={asignar} onCancelar={() => setDialogo(null)} />
      )}

      {dialogo === 'cancelar' && (
        <DialogoCancelar pedido={pedido} onCancelarPedido={cancelar} onCerrar={() => setDialogo(null)} />
      )}
    </article>
  );
}
