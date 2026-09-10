import { useState } from 'react';
import { useRepartidoresPanel } from '../../hooks/useRepartidoresPanel';
import { TarjetaRepartidor } from './TarjetaRepartidor';
import { FormularioRepartidor } from './FormularioRepartidor';
import { Modal } from '../ui/Modal';
import { Toast } from '../ui/Toast';
import './PanelRepartidores.css';

export function PanelRepartidores() {
  const { estadoCarga, repartidores, errorMensaje, recargar, crear, editar, darDeBaja } =
    useRepartidoresPanel();
  const [modal, setModal] = useState(null); // null | { tipo: 'alta' } | { tipo: 'edicion', repartidor }
  const [confirmacion, setConfirmacion] = useState(null);

  function abrirAlta() {
    setModal({ tipo: 'alta' });
  }

  function abrirEdicion(repartidor) {
    setModal({ tipo: 'edicion', repartidor });
  }

  function cerrarModal() {
    setModal(null);
  }

  async function manejarGuardar(datos) {
    if (modal.tipo === 'alta') {
      await crear(datos);
      setConfirmacion({ mensaje: 'Repartidor creado correctamente.', tipo: 'exito' });
    } else {
      await editar(modal.repartidor.id, datos);
      setConfirmacion({ mensaje: 'Cambios guardados correctamente.', tipo: 'exito' });
    }
    setModal(null);
  }

  async function manejarBaja(repartidor) {
    const confirmado = window.confirm(`Dar de baja a ${repartidor.nombre}?`);
    if (!confirmado) return;
    try {
      await darDeBaja(repartidor.id);
      setConfirmacion({ mensaje: `${repartidor.nombre} fue dado de baja.`, tipo: 'exito' });
    } catch (err) {
      setConfirmacion({
        mensaje: err.message || 'No se pudo dar de baja al repartidor.',
        tipo: 'error',
      });
    }
  }

  return (
    <section className="panel-repartidores">
      <header className="panel-repartidores__header">
        <h1 className="panel-repartidores__titulo">Repartidores</h1>
        <button type="button" className="panel-repartidores__nuevo" onClick={abrirAlta}>
          + Nuevo repartidor
        </button>
      </header>

      {estadoCarga === 'cargando' && (
        <p className="panel-repartidores__mensaje">Cargando repartidores...</p>
      )}

      {estadoCarga === 'error' && (
        <div className="panel-repartidores__mensaje panel-repartidores__mensaje--error">
          <p>{errorMensaje}</p>
          <button type="button" onClick={recargar}>
            Reintentar
          </button>
        </div>
      )}

      {estadoCarga === 'listo' && repartidores.length === 0 && (
        <p className="panel-repartidores__mensaje">Todavia no hay repartidores cargados.</p>
      )}

      {estadoCarga === 'listo' && repartidores.length > 0 && (
        <div className="panel-repartidores__grilla">
          {repartidores.map((repartidor) => (
            <TarjetaRepartidor
              key={repartidor.id}
              repartidor={repartidor}
              onEditar={abrirEdicion}
              onDarDeBaja={manejarBaja}
            />
          ))}
        </div>
      )}

      {modal && (
        <Modal titulo={modal.tipo === 'alta' ? 'Nuevo repartidor' : 'Editar repartidor'} onCerrar={cerrarModal}>
          <FormularioRepartidor
            repartidor={modal.tipo === 'edicion' ? modal.repartidor : null}
            onGuardar={manejarGuardar}
            onCancelar={cerrarModal}
          />
        </Modal>
      )}

      <Toast
        mensaje={confirmacion?.mensaje}
        tipo={confirmacion?.tipo}
        onCerrar={() => setConfirmacion(null)}
      />
    </section>
  );
}
