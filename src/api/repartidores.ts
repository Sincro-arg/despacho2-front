import type { Repartidor } from '../types';

const API_URL = import.meta.env.VITE_API_URL ?? '';

export interface DatosRepartidor {
  nombre: string;
  telefono: string;
  vehiculo: string;
}

export async function obtenerRepartidores(signal?: AbortSignal): Promise<Repartidor[]> {
  const res = await fetch(`${API_URL}/repartidores`, { signal });
  if (!res.ok) {
    throw new Error(`No se pudieron obtener los repartidores (${res.status})`);
  }
  return res.json() as Promise<Repartidor[]>;
}

export async function crearRepartidor(datos: DatosRepartidor): Promise<Repartidor> {
  const res = await fetch(`${API_URL}/repartidores`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(datos),
  });
  if (!res.ok) {
    throw new Error(`No se pudo crear el repartidor (${res.status})`);
  }
  return res.json() as Promise<Repartidor>;
}

export async function editarRepartidor(
  id: Repartidor['id'],
  datos: DatosRepartidor,
): Promise<Repartidor> {
  const res = await fetch(`${API_URL}/repartidores/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(datos),
  });
  if (!res.ok) {
    throw new Error(`No se pudo editar el repartidor (${res.status})`);
  }
  return res.json() as Promise<Repartidor>;
}

export async function darDeBajaRepartidor(id: Repartidor['id']): Promise<void> {
  const res = await fetch(`${API_URL}/repartidores/${id}`, { method: 'DELETE' });
  if (!res.ok) {
    throw new Error(`No se pudo dar de baja al repartidor (${res.status})`);
  }
}
