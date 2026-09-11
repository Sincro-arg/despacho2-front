import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ColumnaPedidos } from './ColumnaPedidos';
import type { Pedido } from '../types';

const pedidoEjemplo: Pedido = {
  id: 1,
  cliente: 'Juan Perez',
  direccion: 'Av. Siempre Viva 123',
  zona: 'Norte',
  importe: 1500,
  estado: 'pendiente',
};

function mockFetchOnce(status: number, body: unknown) {
  vi.stubGlobal(
    'fetch',
    vi.fn().mockResolvedValueOnce({
      ok: status >= 200 && status < 300,
      status,
      json: () => Promise.resolve(body),
    }),
  );
}

describe('ColumnaPedidos', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('muestra el estado de carga mientras espera la respuesta', () => {
    vi.stubGlobal('fetch', vi.fn(() => new Promise(() => {})));
    render(<ColumnaPedidos titulo="Pendiente" estado="pendiente" />);
    expect(screen.getByText('Cargando pedidos…')).toBeInTheDocument();
  });

  it('muestra el estado vacio cuando no hay pedidos', async () => {
    mockFetchOnce(200, []);
    render(<ColumnaPedidos titulo="Pendiente" estado="pendiente" />);
    await waitFor(() => expect(screen.getByText(/No hay pedidos/)).toBeInTheDocument());
  });

  it('muestra las tarjetas cuando la respuesta trae pedidos', async () => {
    mockFetchOnce(200, [pedidoEjemplo]);
    render(<ColumnaPedidos titulo="Pendiente" estado="pendiente" />);
    await waitFor(() => expect(screen.getByText('Juan Perez')).toBeInTheDocument());
  });

  it('muestra el error y permite reintentar', async () => {
    mockFetchOnce(500, {});
    render(<ColumnaPedidos titulo="Pendiente" estado="pendiente" />);

    await waitFor(() =>
      expect(screen.getByText('No se pudieron cargar los pedidos.')).toBeInTheDocument(),
    );

    mockFetchOnce(200, [pedidoEjemplo]);
    await userEvent.click(screen.getByRole('button', { name: 'Reintentar' }));

    await waitFor(() => expect(screen.getByText('Juan Perez')).toBeInTheDocument());
  });
});
