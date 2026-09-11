import { useMemo, useState, type FormEvent } from 'react';
import { useRepartidores } from '../hooks/useRepartidores';
import type { Pedido, Repartidor } from '../types';

interface Props {
  pedido: Pedido;
  onAsignar: (repartidorId: Repartidor['id']) => Promise<void>;
  onCancelar: () => void;
}

export function DialogoAsignar({ pedido, onAsignar, onCancelar }: Props) {
  const { repartidores, cargando, error, reintentar } = useRepartidores();
  const [seleccionado, setSeleccionado] = useState('');
  const [asignando, setAsignando] = useState(false);
  const [errorAsignar, setErrorAsignar] = useState<string | null>(null);

  const libres = useMemo(
    () => repartidores.filter((r) => r.estado === 'activo' && r.libre !== false),
    [repartidores],
  );

  async function manejarEnvio(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    if (!seleccionado) return;
    setErrorAsignar(null);
    setAsignando(true);
    try {
      await onAsignar(seleccionado);
    } catch (err) {
      setErrorAsignar(err instanceof Error ? err.message : 'Error desconocido');
      setAsignando(false);
    }
  }

  return (
    <div
      className="modal"
      role="dialog"
      aria-modal="true"
      aria-label={`Asignar pedido de ${pedido.cliente}`}
    >
      <form className="dialogo-asignar" onSubmit={manejarEnvio}>
        <h2>Asignar pedido</h2>
        <p className="dialogo-asignar__pedido">
          {pedido.cliente} — {pedido.direccion}
        </p>

        {cargando && <p className="dialogo-asignar__estado">Cargando repartidores…</p>}

        {!cargando && error && (
          <div className="dialogo-asignar__estado dialogo-asignar__estado--error">
            <p>No se pudieron cargar los repartidores.</p>
            <button type="button" onClick={reintentar}>
              Reintentar
            </button>
          </div>
        )}

        {!cargando && !error && libres.length === 0 && (
          <p className="dialogo-asignar__estado">No hay repartidores libres.</p>
        )}

        {!cargando && !error && libres.length > 0 && (
          <label>
            Repartidor
            <select value={seleccionado} onChange={(e) => setSeleccionado(e.target.value)} required>
              <option value="" disabled>
                Elegir…
              </option>
              {libres.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.nombre}
                </option>
              ))}
            </select>
          </label>
        )}

        {errorAsignar && <p className="dialogo-asignar__error">{errorAsignar}</p>}

        <div className="dialogo-asignar__botones">
          <button type="submit" disabled={asignando || !seleccionado}>
            {asignando ? 'Asignando…' : 'Asignar'}
          </button>
          <button type="button" onClick={onCancelar} disabled={asignando}>
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
