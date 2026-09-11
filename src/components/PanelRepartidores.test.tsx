import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { PanelRepartidores } from './PanelRepartidores';
import type { Repartidor } from '../types';

const repartidorEjemplo: Repartidor = {
  id: 1,
  nombre: 'Ana Gomez',
  telefono: '11-2233-4455',
  vehiculo: 'Moto',
  estado: 'activo',
};

function respuesta(status: number, body: unknown) {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: () => Promise.resolve(body),
  };
}

function mockFetchSecuencia(respuestas: Array<{ status: number; body: unknown }>) {
  const fetchMock = vi.fn();
  for (const { status, body } of respuestas) {
    fetchMock.mockResolvedValueOnce(respuesta(status, body));
  }
  vi.stubGlobal('fetch', fetchMock);
  return fetchMock;
}

describe('PanelRepartidores', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('muestra el estado de carga mientras espera la respuesta', () => {
    vi.stubGlobal('fetch', vi.fn(() => new Promise(() => {})));
    render(<PanelRepartidores />);
    expect(screen.getByText('Cargando repartidores…')).toBeInTheDocument();
  });

  it('muestra el estado vacio cuando no hay repartidores', async () => {
    mockFetchSecuencia([{ status: 200, body: [] }]);
    render(<PanelRepartidores />);
    await waitFor(() =>
      expect(screen.getByText('Todavía no hay repartidores cargados.')).toBeInTheDocument(),
    );
  });

  it('muestra el error y permite reintentar', async () => {
    mockFetchSecuencia([
      { status: 500, body: {} },
      { status: 200, body: [repartidorEjemplo] },
    ]);
    render(<PanelRepartidores />);

    await waitFor(() =>
      expect(screen.getByText('No se pudieron cargar los repartidores.')).toBeInTheDocument(),
    );

    await userEvent.click(screen.getByRole('button', { name: 'Reintentar' }));
    await waitFor(() => expect(screen.getByText('Ana Gomez')).toBeInTheDocument());
  });

  it('lista los repartidores con nombre, telefono, vehiculo y estado', async () => {
    mockFetchSecuencia([{ status: 200, body: [repartidorEjemplo] }]);
    render(<PanelRepartidores />);

    await waitFor(() => expect(screen.getByText('Ana Gomez')).toBeInTheDocument());
    expect(screen.getByText('11-2233-4455')).toBeInTheDocument();
    expect(screen.getByText('Moto')).toBeInTheDocument();
    expect(screen.getByText('Activo')).toBeInTheDocument();
  });

  it('da de alta un repartidor y muestra la confirmacion', async () => {
    const creado: Repartidor = { id: 2, nombre: 'Luis Diaz', telefono: '11-9999-8888', vehiculo: 'Auto', estado: 'activo' };

    mockFetchSecuencia([
      { status: 200, body: [] },
      { status: 201, body: creado },
      { status: 200, body: [creado] },
    ]);

    render(<PanelRepartidores />);
    await waitFor(() =>
      expect(screen.getByText('Todavía no hay repartidores cargados.')).toBeInTheDocument(),
    );

    await userEvent.click(screen.getByRole('button', { name: 'Nuevo repartidor' }));
    await userEvent.type(screen.getByLabelText('Nombre'), 'Luis Diaz');
    await userEvent.type(screen.getByLabelText('Teléfono'), '11-9999-8888');
    await userEvent.type(screen.getByLabelText('Vehículo'), 'Auto');
    await userEvent.click(screen.getByRole('button', { name: 'Guardar' }));

    await waitFor(() => expect(screen.getByText('Repartidor creado.')).toBeInTheDocument());
    expect(screen.getByText('Luis Diaz')).toBeInTheDocument();
  });

  it('da de baja un repartidor y muestra la confirmacion', async () => {
    mockFetchSecuencia([
      { status: 200, body: [repartidorEjemplo] },
      { status: 204, body: null },
      { status: 200, body: [{ ...repartidorEjemplo, estado: 'inactivo' }] },
    ]);

    render(<PanelRepartidores />);
    await waitFor(() => expect(screen.getByText('Ana Gomez')).toBeInTheDocument());

    await userEvent.click(screen.getByRole('button', { name: 'Dar de baja' }));
    await userEvent.click(screen.getByRole('button', { name: 'Sí, dar de baja' }));

    await waitFor(() => expect(screen.getByText('Ana Gomez dado de baja.')).toBeInTheDocument());
    expect(screen.getByText('Inactivo')).toBeInTheDocument();
  });
});
