import type { EntregasPorRepartidor } from '../types';

interface Props {
  porRepartidor: EntregasPorRepartidor[];
  cargando: boolean;
  error: string | null;
  reintentar: () => void;
}

export function ListaEntregasPorRepartidor({ porRepartidor, cargando, error, reintentar }: Props) {
  return (
    <section className="lista-entregas" aria-label="Entregas por repartidor">
      <h2>Entregas por repartidor</h2>

      {cargando && <p className="lista-entregas__estado">Cargando…</p>}

      {!cargando && error && (
        <div className="lista-entregas__estado lista-entregas__estado--error">
          <p>No se pudo cargar la lista.</p>
          <button type="button" onClick={reintentar}>
            Reintentar
          </button>
        </div>
      )}

      {!cargando && !error && porRepartidor.length === 0 && (
        <p className="lista-entregas__estado">Todavía no hay entregas en este turno.</p>
      )}

      {!cargando && !error && porRepartidor.length > 0 && (
        <ul className="lista-entregas__lista">
          {porRepartidor.map((item) => (
            <li key={item.repartidorId} className="lista-entregas__fila">
              <span className="lista-entregas__nombre">{item.repartidor}</span>
              <span className="lista-entregas__cantidad">{item.entregas}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
