import { useCallback, useEffect, useState } from 'react';
import { api } from '../api/client';

// Trae los repartidores una sola vez para poder mostrar el nombre en las
// tarjetas de pedido. Es un dato auxiliar: si falla, las tarjetas
// simplemente muestran el id en vez de romper el tablero entero.
export function useRepartidores() {
  const [repartidores, setRepartidores] = useState([]);

  const cargar = useCallback(async () => {
    try {
      const data = await api.get('/repartidores');
      setRepartidores(data);
    } catch {
      setRepartidores([]);
    }
  }, []);

  useEffect(() => {
    cargar();
  }, [cargar]);

  return { repartidores };
}
