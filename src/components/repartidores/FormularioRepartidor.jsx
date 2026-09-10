import { useState } from 'react';
import './FormularioRepartidor.css';

const VEHICULOS = [
  { valor: 'moto', etiqueta: 'Moto' },
  { valor: 'bici', etiqueta: 'Bici' },
];

const ESTADOS = [
  { valor: 'libre', etiqueta: 'Libre' },
  { valor: 'en_ruta', etiqueta: 'En ruta' },
  { valor: 'descanso', etiqueta: 'Descanso' },
];

// Sirve para alta (repartidor === null) y edicion (repartidor con datos).
// En alta no se pide estado: el back lo arranca en 'libre'.
export function FormularioRepartidor({ repartidor, onGuardar, onCancelar }) {
  const esEdicion = Boolean(repartidor);
  const [nombre, setNombre] = useState(repartidor?.nombre || '');
  const [telefono, setTelefono] = useState(repartidor?.telefono || '');
  const [vehiculo, setVehiculo] = useState(repartidor?.vehiculo || 'moto');
  const [estado, setEstado] = useState(repartidor?.estado || 'libre');
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState(null);

  async function manejarSubmit(e) {
    e.preventDefault();
    setError(null);
    setGuardando(true);
    try {
      const datos = esEdicion ? { nombre, telefono, vehiculo, estado } : { nombre, telefono, vehiculo };
      await onGuardar(datos);
    } catch (err) {
      setError(err.message || 'No se pudo guardar el repartidor.');
    } finally {
      setGuardando(false);
    }
  }

  return (
    <form className="formulario-repartidor" onSubmit={manejarSubmit}>
      <label className="formulario-repartidor__campo">
        <span>Nombre</span>
        <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
      </label>

      <label className="formulario-repartidor__campo">
        <span>Telefono</span>
        <input type="text" value={telefono} onChange={(e) => setTelefono(e.target.value)} required />
      </label>

      <label className="formulario-repartidor__campo">
        <span>Vehiculo</span>
        <select value={vehiculo} onChange={(e) => setVehiculo(e.target.value)}>
          {VEHICULOS.map((v) => (
            <option key={v.valor} value={v.valor}>
              {v.etiqueta}
            </option>
          ))}
        </select>
      </label>

      {esEdicion && (
        <label className="formulario-repartidor__campo">
          <span>Estado</span>
          <select value={estado} onChange={(e) => setEstado(e.target.value)}>
            {ESTADOS.map((opcion) => (
              <option key={opcion.valor} value={opcion.valor}>
                {opcion.etiqueta}
              </option>
            ))}
          </select>
        </label>
      )}

      {error && <p className="formulario-repartidor__error">{error}</p>}

      <div className="formulario-repartidor__acciones">
        <button type="button" onClick={onCancelar} disabled={guardando}>
          Cancelar
        </button>
        <button type="submit" className="formulario-repartidor__guardar" disabled={guardando}>
          {guardando ? 'Guardando...' : 'Guardar'}
        </button>
      </div>
    </form>
  );
}
