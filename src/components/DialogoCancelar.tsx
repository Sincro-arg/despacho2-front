import { useState, type FormEvent } from 'react';
import type { Pedido } from '../types';

interface Props {
  pedido: Pedido;
  onCancelarPedido: (motivo: string) => Promise<void>;
  onCerrar: () => void;
}

export function DialogoCancelar({ pedido, onCancelarPedido, onCerrar }: Props) {
  const [motivo, setMotivo] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function manejarEnvio(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    setError(null);
    setEnviando(true);
    try {
      await onCancelarPedido(motivo.trim());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
      setEnviando(false);
    }
  }

  return (
    <div
      className="modal"
      role="dialog"
      aria-modal="true"
      aria-label={`Cancelar pedido de ${pedido.cliente}`}
    >
      <form className="dialogo-cancelar" onSubmit={manejarEnvio}>
        <h2>Cancelar pedido</h2>
        <p className="dialogo-cancelar__pedido">
          {pedido.cliente} — {pedido.direccion}
        </p>

        <label>
          Motivo
          <textarea value={motivo} onChange={(e) => setMotivo(e.target.value)} required />
        </label>

        {error && <p className="dialogo-cancelar__error">{error}</p>}

        <div className="dialogo-cancelar__botones">
          <button type="submit" disabled={enviando}>
            {enviando ? 'Cancelando…' : 'Confirmar cancelación'}
          </button>
          <button type="button" onClick={onCerrar} disabled={enviando}>
            Volver
          </button>
        </div>
      </form>
    </div>
  );
}
