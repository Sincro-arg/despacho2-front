import { useCallback, useState } from 'react';
import { crearRepartidor, darDeBajaRepartidor, editarRepartidor } from '../api/repartidores';
import type { DatosRepartidor } from '../api/repartidores';
import { useRepartidores } from '../hooks/useRepartidores';
import type { Repartidor } from '../types';
import { FilaRepartidor } from './FilaRepartidor';
import { FormularioRepartidor } from './FormularioRepartidor';

export function PanelRepartidores() {
  const { repartidores, cargando, error, reintentar } = useRepartidores();
  const [modalAbierto, setModalAbierto] = useState(false);
  const [repartidorEnEdicion, setRepartidorEnEdicion] = useState<Repartidor | null>(null);
  const [mensaje, setMensaje] = useState<string | null>(null);

  const abrirAlta = useCallback(() => {
    setRepartidorEnEdicion(null);
    setModalAbierto(true);
  }, []);

  const abrirEdicion = useCallback((repartidor: Repartidor) => {
    setRepartidorEnEdicion(repartidor);
    setModalAbierto(true);
  }, []);

  const cerrarModal = useCallback(() => setModalAbierto(false), []);

  const guardar = useCallback(
    async (datos: DatosRepartidor) => {
      if (repartidorEnEdicion) {
        await editarRepartidor(repartidorEnEdicion.id, datos);
        setMensaje('Repartidor actualizado.');
      } else {
        await crearRepartidor(datos);
        setMensaje('Repartidor creado.');
      }
      setModalAbierto(false);
      reintentar();
    },
    [repartidorEnEdicion, reintentar],
  );

  const darDeBaja = useCallback(
    async (repartidor: Repartidor) => {
      await darDeBajaRepartidor(repartidor.id);
      setMensaje(`${repartidor.nombre} dado de baja.`);
      reintentar();
    },
    [reintentar],
  );

  return (
    <section className="panel-repartidores" aria-label="Repartidores">
      <header className="panel-repartidores__header">
        <h2>Repartidores</h2>
        <button type="button" onClick={abrirAlta}>
          Nuevo repartidor
        </button>
      </header>

      {mensaje && (
        <div className="panel-repartidores__confirmacion" role="status">
          <p>{mensaje}</p>
          <button type="button" onClick={() => setMensaje(null)} aria-label="Cerrar confirmación">
            ×
          </button>
        </div>
      )}

      <div className="panel-repartidores__body">
        {cargando && <p className="panel-repartidores__estado">Cargando repartidores…</p>}

        {!cargando && error && (
          <div className="panel-repartidores__estado panel-repartidores__estado--error">
            <p>No se pudieron cargar los repartidores.</p>
            <button type="button" onClick={reintentar}>
              Reintentar
            </button>
          </div>
        )}

        {!cargando && !error && repartidores.length === 0 && (
          <p className="panel-repartidores__estado">Todavía no hay repartidores cargados.</p>
        )}

        {!cargando &&
          !error &&
          repartidores.map((repartidor) => (
            <FilaRepartidor
              key={repartidor.id}
              repartidor={repartidor}
              onEditar={abrirEdicion}
              onBaja={darDeBaja}
            />
          ))}
      </div>

      {modalAbierto && (
        <FormularioRepartidor
          repartidor={repartidorEnEdicion}
          onGuardar={guardar}
          onCancelar={cerrarModal}
        />
      )}
    </section>
  );
}
