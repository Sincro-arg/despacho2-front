import { ApiConnectionError, ApiResponseError } from './ApiError';

// Base URL configurable: en dev cae en el back local, en produccion se
// pisa con la variable de entorno VITE_API_URL.
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
const TIMEOUT_MS = 8000;

// Quien quiera enterarse de si el back esta respondiendo (por ejemplo el
// banner del layout) se suscribe aca en vez de que cada pantalla tenga
// que manejar su propio estado de conexion.
const listeners = new Set();

export function onApiStatusChange(callback) {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

function notify(status) {
  listeners.forEach((cb) => cb(status));
}

async function request(path, options = {}) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

  let response;
  try {
    response = await fetch(`${BASE_URL}${path}`, {
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
      signal: controller.signal,
    });
  } catch (err) {
    clearTimeout(timeoutId);
    notify('offline');
    const motivo = err.name === 'AbortError'
      ? 'El servidor tardo demasiado en responder.'
      : 'No se pudo conectar con el servidor.';
    throw new ApiConnectionError(motivo);
  }
  clearTimeout(timeoutId);
  notify('online');

  const texto = await response.text();
  let data = null;
  if (texto) {
    try {
      data = JSON.parse(texto);
    } catch {
      data = null;
    }
  }

  if (!response.ok) {
    const mensaje = data?.error || `El servidor respondio con un error (${response.status}).`;
    throw new ApiResponseError(mensaje, response.status);
  }

  return data;
}

export const api = {
  get: (path) => request(path, { method: 'GET' }),
  post: (path, body) => request(path, { method: 'POST', body }),
  put: (path, body) => request(path, { method: 'PUT', body }),
  del: (path) => request(path, { method: 'DELETE' }),
};
