import { useState } from 'react';
import type { EstadoOperativo, Repartidor } from '../types';

interface Props {
  repartidor: Repartidor;
  onEditar: (repartidor: Repartidor) => void;
  onBaja: (repartidor: Repartidor) => Promise<void>;
}

const ETIQUETAS_ESTADO_OPERATIVO: Record<EstadoOperativo, string> = {
  libre: 'Libre',
  en_ruta: 'En ruta',
  descanso: 'Descanso',
};

function obtenerEstadoOperativo(repartidor: Repartidor): EstadoOperativo {
  if (repartidor.estadoOperativo) return repartidor.estadoOperativo;
  return repartidor.libre === false ? 'en_ruta' : 'libre';
}

export function FilaRepartidor({ repartidor, onEditar, onBaja }: Props) {
  const [confirmando, setConfirmando] = useState(false);
  const [dandoBaja, setDandoBaja] = useState(false);
  const [errorBaja, setErrorBaja] = useState<string | null>(null);

  const activo = repartidor.estado === 'activo';
  const estadoOperativo = obtenerEstadoOperativo(repartidor);

  async function confirmarBaja() {
    setDandoBaja(true);
    setErrorBaja(null);
    try {
      await onBaja(repartidor);
      setConfirmando(false);
    } catch (err) {
      setErrorBaja(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setDandoBaja(false);
    }
  }

  return (
    <article className="repartidor" data-testid="repartidor">
      <div className="repartidor__datos">
        <p className="repartidor__nombre">{repartidor.nombre}</p>
        <p className="repartidor__telefono">{repartidor.telefono}</p>
        <p className="repartidor__vehiculo">{repartidor.vehiculo}</p>
      </div>

      <span className={`repartidor__estado repartidor__estado--${repartidor.estado}`}>
        {activo ? 'Activo' : 'Inactivo'}
      </span>

      <span
        className={`repartidor__estado-operativo repartidor__estado-operativo--${estadoOperativo}`}
      >
        {ETIQUETAS_ESTADO_OPERATIVO[estadoOperativo]}
      </span>

      {!confirmando && (
        <div className="repartidor__acciones">
          <button type="button" onClick={() => onEditar(repartidor)}>
            Editar
          </button>
          {activo && (
            <button
              type="button"
              className="repartidor__boton-baja"
              onClick={() => setConfirmando(true)}
            >
              Dar de baja
            </button>
          )}
        </div>
      )}

      {confirmando && (
        <div className="repartidor__confirmacion">
          <p>¿Dar de baja a {repartidor.nombre}?</p>
          {errorBaja && <p className="repartidor__error">{errorBaja}</p>}
          <div className="repartidor__acciones">
            <button type="button" onClick={confirmarBaja} disabled={dandoBaja}>
              {dandoBaja ? 'Dando de baja…' : 'Sí, dar de baja'}
            </button>
            <button type="button" onClick={() => setConfirmando(false)} disabled={dandoBaja}>
              Cancelar
            </button>
          </div>
        </div>
      )}
    </article>
  );
}
