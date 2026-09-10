import { useCallback, useEffect, useState } from 'react';
import { obtenerPedidos } from '../api/pedidos';
import type { EstadoPedido, Pedido } from '../types';

interface ResultadoPedidos {
  pedidos: Pedido[];
  cargando: boolean;
  error: string | null;
  reintentar: () => void;
}

export function usePedidosPorEstado(estado: EstadoPedido): ResultadoPedidos {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [intento, setIntento] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    setCargando(true);
    setError(null);

    obtenerPedidos(estado, controller.signal)
      .then((datos) => setPedidos(datos))
      .catch((err: unknown) => {
        if (err instanceof DOMException && err.name === 'AbortError') return;
        setError(err instanceof Error ? err.message : 'Error desconocido');
      })
      .finally(() => setCargando(false));

    return () => controller.abort();
  }, [estado, intento]);

  const reintentar = useCallback(() => setIntento((v) => v + 1), []);

  return { pedidos, cargando, error, reintentar };
}
