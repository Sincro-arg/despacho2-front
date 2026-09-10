import { useCallback, useState } from 'react';
import { crearPedido } from '../api/pedidos';
import type { DatosPedido } from '../api/pedidos';
import type { EstadoPedido } from '../types';
import { ColumnaPedidos } from './ColumnaPedidos';
import { FormularioPedido } from './FormularioPedido';

const COLUMNAS: Array<{ estado: EstadoPedido; titulo: string }> = [
  { estado: 'pendiente', titulo: 'Pendiente' },
  { estado: 'asignado', titulo: 'Asignado' },
  { estado: 'en_camino', titulo: 'En camino' },
  { estado: 'entregado', titulo: 'Entregado' },
];

export function TableroPedidos() {
  const [version, setVersion] = useState(0);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [mensaje, setMensaje] = useState<string | null>(null);

  const actualizar = useCallback(() => setVersion((v) => v + 1), []);

  const crear = useCallback(
    async (datos: DatosPedido) => {
      await crearPedido(datos);
      setMensaje('Pedido creado.');
      setModalAbierto(false);
      actualizar();
    },
    [actualizar],
  );

  return (
    <div className="tablero-vista">
      <div className="tablero-acciones">
        <button type="button" onClick={() => setModalAbierto(true)}>
          Nuevo pedido
        </button>
      </div>

      {mensaje && (
        <div className="tablero-acciones__confirmacion" role="status">
          <p>{mensaje}</p>
          <button type="button" onClick={() => setMensaje(null)} aria-label="Cerrar confirmación">
            ×
          </button>
        </div>
      )}

      <div className="tablero">
        {COLUMNAS.map((columna) => (
          <ColumnaPedidos
            key={columna.estado}
            titulo={columna.titulo}
            estado={columna.estado}
            version={version}
            onCambio={actualizar}
          />
        ))}
      </div>

      {modalAbierto && (
        <FormularioPedido onGuardar={crear} onCancelar={() => setModalAbierto(false)} />
      )}
    </div>
  );
}
