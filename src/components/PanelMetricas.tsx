import type { MetricasTurno } from '../types';

const formateadorMoneda = new Intl.NumberFormat('es-AR', {
  style: 'currency',
  currency: 'ARS',
  maximumFractionDigits: 0,
});

interface Props {
  metricas: MetricasTurno | null;
  cargando: boolean;
  error: string | null;
  reintentar: () => void;
}

export function PanelMetricas({ metricas, cargando, error, reintentar }: Props) {
  return (
    <section className="panel-metricas" aria-label="Métricas del turno">
      {cargando && <p className="panel-metricas__estado">Cargando métricas…</p>}

      {!cargando && error && (
        <div className="panel-metricas__estado panel-metricas__estado--error">
          <p>No se pudieron cargar las métricas.</p>
          <button type="button" onClick={reintentar}>
            Reintentar
          </button>
        </div>
      )}

      {!cargando && !error && metricas && (
        <div className="panel-metricas__grid">
          <div className="panel-metricas__item">
            <span className="panel-metricas__valor">{metricas.entregados}</span>
            <span className="panel-metricas__etiqueta">Entregados</span>
          </div>

          <div className="panel-metricas__item">
            <span className="panel-metricas__valor">{formateadorMoneda.format(metricas.facturado)}</span>
            <span className="panel-metricas__etiqueta">Facturado</span>
          </div>

          <div className="panel-metricas__item">
            <span className="panel-metricas__valor">{metricas.tiempoPromedioMinutos} min</span>
            <span className="panel-metricas__etiqueta">Tiempo promedio</span>
          </div>

          <div className="panel-metricas__item panel-metricas__item--demorados">
            <span className="panel-metricas__valor">{metricas.demorados}</span>
            <span className="panel-metricas__etiqueta">Demorados</span>
          </div>
        </div>
      )}
    </section>
  );
}
