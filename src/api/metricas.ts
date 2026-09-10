import type { MetricasTurno } from '../types';

const API_URL = import.meta.env.VITE_API_URL ?? '';

export async function obtenerMetricas(signal?: AbortSignal): Promise<MetricasTurno> {
  const res = await fetch(`${API_URL}/metricas`, { signal });
  if (!res.ok) {
    throw new Error(`No se pudieron obtener las métricas (${res.status})`);
  }
  return res.json() as Promise<MetricasTurno>;
}
