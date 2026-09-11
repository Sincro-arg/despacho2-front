import { useCallback, useEffect, useState } from 'react';
import { obtenerMetricas } from '../api/metricas';
import type { MetricasTurno } from '../types';

interface ResultadoMetricas {
  metricas: MetricasTurno | null;
  cargando: boolean;
  error: string | null;
  reintentar: () => void;
}

export function useMetricas(version = 0): ResultadoMetricas {
  const [metricas, setMetricas] = useState<MetricasTurno | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [intento, setIntento] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    setCargando(true);
    setError(null);

    obtenerMetricas(controller.signal)
      .then((datos) => setMetricas(datos))
      .catch((err: unknown) => {
        if (err instanceof DOMException && err.name === 'AbortError') return;
        setError(err instanceof Error ? err.message : 'Error desconocido');
      })
      .finally(() => setCargando(false));

    return () => controller.abort();
  }, [intento, version]);

  const reintentar = useCallback(() => setIntento((v) => v + 1), []);

  return { metricas, cargando, error, reintentar };
}
