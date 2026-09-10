import { useEffect } from 'react';
import './Toast.css';

// Confirmacion visible y temporal para las acciones de alta/edicion/baja.
export function Toast({ mensaje, tipo = 'exito', onCerrar, duracionMs = 3000 }) {
  useEffect(() => {
    if (!mensaje) return undefined;
    const id = setTimeout(onCerrar, duracionMs);
    return () => clearTimeout(id);
  }, [mensaje, duracionMs, onCerrar]);

  if (!mensaje) return null;

  return (
    <div className={`toast toast--${tipo}`} role="status">
      {mensaje}
    </div>
  );
}
