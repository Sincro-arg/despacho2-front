import { useCallback, useEffect, useState } from 'react';
import { api } from '../api/client';

// Estado de carga del listado + las acciones de alta/edicion/baja que
// usa el panel. Cada accion actualiza el listado local sin tener que
// volver a pedir todo de nuevo.
export function useRepartidoresPanel() {
  const [estadoCarga, setEstadoCarga] = useState('cargando'); // 'cargando' | 'listo' | 'error'
  const [repartidores, setRepartidores] = useState([]);
  const [errorMensaje, setErrorMensaje] = useState(null);

  const cargar = useCallback(async () => {
    setEstadoCarga('cargando');
    setErrorMensaje(null);
    try {
      const data = await api.get('/repartidores');
      setRepartidores(data);
      setEstadoCarga('listo');
    } catch (err) {
      setErrorMensaje(err.message || 'No se pudieron cargar los repartidores.');
      setEstadoCarga('error');
    }
  }, []);

  useEffect(() => {
    cargar();
  }, [cargar]);

  async function crear(datos) {
    const nuevo = await api.post('/repartidores', datos);
    setRepartidores((actuales) => [...actuales, nuevo]);
    return nuevo;
  }

  async function editar(id, cambios) {
    const actualizado = await api.put(`/repartidores/${id}`, cambios);
    setRepartidores((actuales) => actuales.map((r) => (r.id === id ? actualizado : r)));
    return actualizado;
  }

  async function darDeBaja(id) {
    const actualizado = await api.del(`/repartidores/${id}`);
    setRepartidores((actuales) => actuales.map((r) => (r.id === id ? actualizado : r)));
    return actualizado;
  }

  return { estadoCarga, repartidores, errorMensaje, recargar: cargar, crear, editar, darDeBaja };
}
