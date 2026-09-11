import { useState, type FormEvent } from 'react';
import type { DatosPedido } from '../api/pedidos';

interface Props {
  onGuardar: (datos: DatosPedido) => Promise<void>;
  onCancelar: () => void;
}

export function FormularioPedido({ onGuardar, onCancelar }: Props) {
  const [cliente, setCliente] = useState('');
  const [telefono, setTelefono] = useState('');
  const [direccion, setDireccion] = useState('');
  const [zona, setZona] = useState('');
  const [importe, setImporte] = useState('');
  const [items, setItems] = useState('');
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function manejarEnvio(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    setError(null);
    setGuardando(true);
    try {
      await onGuardar({
        cliente: cliente.trim(),
        telefono: telefono.trim(),
        direccion: direccion.trim(),
        zona: zona.trim(),
        importe: Number(importe),
        items: items.trim(),
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
      setGuardando(false);
    }
  }

  return (
    <div className="modal" role="dialog" aria-modal="true" aria-label="Nuevo pedido">
      <form className="formulario-pedido" onSubmit={manejarEnvio}>
        <h2>Nuevo pedido</h2>

        <label>
          Cliente
          <input value={cliente} onChange={(e) => setCliente(e.target.value)} required />
        </label>

        <label>
          Teléfono
          <input value={telefono} onChange={(e) => setTelefono(e.target.value)} required />
        </label>

        <label>
          Dirección
          <input value={direccion} onChange={(e) => setDireccion(e.target.value)} required />
        </label>

        <label>
          Zona
          <input value={zona} onChange={(e) => setZona(e.target.value)} required />
        </label>

        <label>
          Importe
          <input
            type="number"
            min="0"
            step="0.01"
            value={importe}
            onChange={(e) => setImporte(e.target.value)}
            required
          />
        </label>

        <label>
          Items
          <textarea value={items} onChange={(e) => setItems(e.target.value)} required />
        </label>

        {error && <p className="formulario-pedido__error">{error}</p>}

        <div className="formulario-pedido__botones">
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
