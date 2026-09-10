import { useApiStatus } from '../../api/ApiStatusContext';
import './BannerConexion.css';

// Se ve solo cuando el back no responde, para no dejar a quien usa la
// app sin ninguna pista de por que la pantalla no trae datos.
export function BannerConexion() {
  const { estado } = useApiStatus();

  if (estado !== 'offline') return null;

  return (
    <div className="banner-conexion" role="alert">
      No se pudo conectar con el servidor. Reintentando en segundo plano...
    </div>
  );
}
