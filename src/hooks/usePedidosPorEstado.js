import { useCallback, useEffect, useState } from 'react';
import { api } from '../api/client';

// Cada columna del tablero llama esto con su propio estado ('pendiente',
// 'asignado', etc) y queda con su propio ciclo de carga/error, sin
// depender de las demas columnas.
export function usePedidosPorEstado(estadoPedido) {
  const [estadoCarga, setEstadoCarga] = useState('cargando'); // 'cargando' | 'listo' | 'error'
  const [pedidos, setPedidos] = useState([]);
  const [errorMensaje, setErrorMensaje] = useState(null);

  const cargar = useCallback(async () => {
    setEstadoCarga('cargando');
    setErrorMensaje(null);
    try {
      const data = await api.get(`/pedidos?estado=${estadoPedido}`);
      setPedidos(data);
      setEstadoCarga('listo');
    } catch (err) {
      setErrorMensaje(err.message || 'No se pudieron cargar los pedidos.');
      setEstadoCarga('error');
    }
  }, [estadoPedido]);

  useEffect(() => {
    cargar();
  }, [cargar]);

  return { estadoCarga, pedidos, errorMensaje, recargar: cargar };
}
