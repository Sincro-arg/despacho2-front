import type { EstadoPedido, Pedido } from '../types';

const API_URL = import.meta.env.VITE_API_URL ?? '';

export async function obtenerPedidos(estado: EstadoPedido, signal?: AbortSignal): Promise<Pedido[]> {
  const res = await fetch(`${API_URL}/pedidos?estado=${estado}`, { signal });
  if (!res.ok) {
    throw new Error(`No se pudieron obtener los pedidos (${res.status})`);
  }
  return res.json() as Promise<Pedido[]>;
}
