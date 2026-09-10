import type { EstadoPedido, Pedido, Repartidor } from '../types';

const API_URL = import.meta.env.VITE_API_URL ?? '';

export interface DatosPedido {
  cliente: string;
  telefono: string;
  direccion: string;
  zona: string;
  importe: number;
  items: string;
}

export async function obtenerPedidos(estado: EstadoPedido, signal?: AbortSignal): Promise<Pedido[]> {
  const res = await fetch(`${API_URL}/pedidos?estado=${estado}`, { signal });
  if (!res.ok) {
    throw new Error(`No se pudieron obtener los pedidos (${res.status})`);
  }
  return res.json() as Promise<Pedido[]>;
}

/** Intenta leer un mensaje de error legible del back; si no hay, usa el generico. */
async function lanzarError(res: Response, generico: string): Promise<never> {
  let mensaje = generico;
  try {
    const cuerpo = (await res.json()) as { mensaje?: string; error?: string };
    mensaje = cuerpo.mensaje ?? cuerpo.error ?? generico;
  } catch {
    // el cuerpo no es JSON, se usa el mensaje generico
  }
  throw new Error(mensaje);
}

export async function crearPedido(datos: DatosPedido): Promise<Pedido> {
  const res = await fetch(`${API_URL}/pedidos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(datos),
  });
  if (!res.ok) {
    return lanzarError(res, `No se pudo crear el pedido (${res.status})`);
  }
  return res.json() as Promise<Pedido>;
}

export async function asignarPedido(
  id: Pedido['id'],
  repartidorId: Repartidor['id'],
): Promise<Pedido> {
  const res = await fetch(`${API_URL}/pedidos/${id}/asignar`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ repartidorId }),
  });
  if (!res.ok) {
    return lanzarError(res, `No se pudo asignar el pedido (${res.status})`);
  }
  return res.json() as Promise<Pedido>;
}

export async function marcarEnCamino(id: Pedido['id']): Promise<Pedido> {
  const res = await fetch(`${API_URL}/pedidos/${id}/en-camino`, { method: 'POST' });
  if (!res.ok) {
    return lanzarError(res, `No se pudo marcar el pedido en camino (${res.status})`);
  }
  return res.json() as Promise<Pedido>;
}

export async function marcarEntregado(id: Pedido['id']): Promise<Pedido> {
  const res = await fetch(`${API_URL}/pedidos/${id}/entregar`, { method: 'POST' });
  if (!res.ok) {
    return lanzarError(res, `No se pudo marcar el pedido como entregado (${res.status})`);
  }
  return res.json() as Promise<Pedido>;
}

export async function liberarPedido(id: Pedido['id']): Promise<Pedido> {
  const res = await fetch(`${API_URL}/pedidos/${id}/liberar`, { method: 'POST' });
  if (!res.ok) {
    return lanzarError(res, `No se pudo liberar el pedido (${res.status})`);
  }
  return res.json() as Promise<Pedido>;
}

export async function cancelarPedido(id: Pedido['id'], motivo: string): Promise<Pedido> {
  const res = await fetch(`${API_URL}/pedidos/${id}/cancelar`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ motivo }),
  });
  if (!res.ok) {
    return lanzarError(res, `No se pudo cancelar el pedido (${res.status})`);
  }
  return res.json() as Promise<Pedido>;
}
