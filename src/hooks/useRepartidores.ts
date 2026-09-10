import { useCallback, useEffect, useState } from 'react';
import { obtenerRepartidores } from '../api/repartidores';
import type { Repartidor } from '../types';

interface ResultadoRepartidores {
  repartidores: Repartidor[];
  cargando: boolean;
  error: string | null;
  reintentar: () => void;
}

export function useRepartidores(): ResultadoRepartidores {
  const [repartidores, setRepartidores] = useState<Repartidor[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [intento, setIntento] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    setCargando(true);
    setError(null);

    obtenerRepartidores(controller.signal)
      .then((datos) => setRepartidores(datos))
      .catch((err: unknown) => {
        if (err instanceof DOMException && err.name === 'AbortError') return;
        setError(err instanceof Error ? err.message : 'Error desconocido');
      })
      .finally(() => setCargando(false));

    return () => controller.abort();
  }, [intento]);

  const reintentar = useCallback(() => setIntento((v) => v + 1), []);

  return { repartidores, cargando, error, reintentar };
}
