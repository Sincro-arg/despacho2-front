import { useState, type FormEvent } from 'react';
import type { DatosRepartidor } from '../api/repartidores';
import type { Repartidor } from '../types';

interface Props {
  repartidor: Repartidor | null;
  onGuardar: (datos: DatosRepartidor) => Promise<void>;
  onCancelar: () => void;
}

export function FormularioRepartidor({ repartidor, onGuardar, onCancelar }: Props) {
  const [nombre, setNombre] = useState(repartidor?.nombre ?? '');
  const [telefono, setTelefono] = useState(repartidor?.telefono ?? '');
  const [vehiculo, setVehiculo] = useState(repartidor?.vehiculo ?? '');
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const esEdicion = repartidor !== null;

  async function manejarEnvio(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    setError(null);
    setGuardando(true);
    try {
      await onGuardar({ nombre: nombre.trim(), telefono: telefono.trim(), vehiculo: vehiculo.trim() });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
      setGuardando(false);
    }
  }

  return (
    <div className="modal" role="dialog" aria-modal="true" aria-label={esEdicion ? 'Editar repartidor' : 'Nuevo repartidor'}>
      <form className="formulario-repartidor" onSubmit={manejarEnvio}>
        <h2>{esEdicion ? 'Editar repartidor' : 'Nuevo repartidor'}</h2>

        <label>
          Nombre
          <input value={nombre} onChange={(e) => setNombre(e.target.value)} required />
        </label>

        <label>
          Teléfono
          <input value={telefono} onChange={(e) => setTelefono(e.target.value)} required />
        </label>

        <label>
          Vehículo
          <input value={vehiculo} onChange={(e) => setVehiculo(e.target.value)} required />
        </label>

        {error && <p className="formulario-repartidor__error">{error}</p>}

        <div className="formulario-repartidor__botones">
          <button type="submit" disabled={guardando}>
            {guardando ? 'Guardando…' : 'Guardar'}
          </button>
          <button type="button" onClick={onCancelar} disabled={guardando}>
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
