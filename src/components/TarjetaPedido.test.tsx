import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { TarjetaPedido } from './TarjetaPedido';
import type { Pedido, Repartidor } from '../types';

const pedidoBase: Pedido = {
  id: 1,
  cliente: 'Juan Perez',
  direccion: 'Av. Siempre Viva 123',
  zona: 'Norte',
  importe: 1500,
  estado: 'pendiente',
};

const repartidorLibre: Repartidor = {
  id: 5,
  nombre: 'Ana Gomez',
  telefono: '11-2233-4455',
  vehiculo: 'Moto',
  estado: 'activo',
  libre: true,
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

describe('TarjetaPedido', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('muestra los datos principales del pedido', () => {
    render(<TarjetaPedido pedido={pedidoBase} />);
    expect(screen.getByText('Juan Perez')).toBeInTheDocument();
    expect(screen.getByText('Av. Siempre Viva 123')).toBeInTheDocument();
    expect(screen.getByText('Zona: Norte')).toBeInTheDocument();
  });

  it('no muestra el badge de demorado si el pedido esta en horario', () => {
    render(<TarjetaPedido pedido={pedidoBase} />);
    expect(screen.queryByText('Demorado')).not.toBeInTheDocument();
  });

  it('muestra el badge y la clase de demorado cuando el back lo marca', () => {
    render(<TarjetaPedido pedido={{ ...pedidoBase, demorado: true }} />);
    expect(screen.getByText('Demorado')).toBeInTheDocument();
    expect(screen.getByTestId('tarjeta-pedido')).toHaveClass('tarjeta--demorado');
  });

  it('muestra el repartidor solo si esta asignado', () => {
    const { rerender } = render(<TarjetaPedido pedido={pedidoBase} />);
    expect(screen.queryByText(/Repartidor:/)).not.toBeInTheDocument();

    rerender(<TarjetaPedido pedido={{ ...pedidoBase, repartidor: 'Ana Gomez' }} />);
    expect(screen.getByText('Repartidor: Ana Gomez')).toBeInTheDocument();
  });

  it('ofrece asignar y cancelar cuando esta pendiente', () => {
    render(<TarjetaPedido pedido={pedidoBase} />);
    expect(screen.getByRole('button', { name: 'Asignar' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cancelar' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'En camino' })).not.toBeInTheDocument();
  });

  it('ofrece en camino, liberar y cancelar cuando esta asignado', () => {
    render(<TarjetaPedido pedido={{ ...pedidoBase, estado: 'asignado', repartidor: 'Ana Gomez' }} />);
    expect(screen.getByRole('button', { name: 'En camino' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Liberar' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cancelar' })).toBeInTheDocument();
  });

  it('no ofrece acciones cuando ya esta entregado', () => {
    render(<TarjetaPedido pedido={{ ...pedidoBase, estado: 'entregado', repartidor: 'Ana Gomez' }} />);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('asigna el pedido eligiendo un repartidor libre y muestra la confirmacion', async () => {
    const onCambio = vi.fn();
    const pedidoAsignado: Pedido = { ...pedidoBase, estado: 'asignado', repartidor: 'Ana Gomez' };
    mockFetchSecuencia([
      { status: 200, body: [repartidorLibre] },
      { status: 200, body: pedidoAsignado },
    ]);

    render(<TarjetaPedido pedido={pedidoBase} onCambio={onCambio} />);
    await userEvent.click(screen.getByRole('button', { name: 'Asignar' }));

    const dialogo = await screen.findByRole('dialog');
    await waitFor(() => expect(within(dialogo).getByLabelText('Repartidor')).toBeInTheDocument());
    await userEvent.selectOptions(within(dialogo).getByLabelText('Repartidor'), 'Ana Gomez');
    await userEvent.click(within(dialogo).getByRole('button', { name: 'Asignar' }));

    await waitFor(() => expect(screen.getByText('Pedido asignado.')).toBeInTheDocument());
    expect(onCambio).toHaveBeenCalled();
  });

  it('muestra un error legible si el back rechaza la asignacion', async () => {
    mockFetchSecuencia([
      { status: 200, body: [repartidorLibre] },
      { status: 409, body: { mensaje: 'El repartidor ya no esta libre' } },
    ]);

    render(<TarjetaPedido pedido={pedidoBase} />);
    await userEvent.click(screen.getByRole('button', { name: 'Asignar' }));

    const dialogo = await screen.findByRole('dialog');
    await waitFor(() => expect(within(dialogo).getByLabelText('Repartidor')).toBeInTheDocument());
    await userEvent.selectOptions(within(dialogo).getByLabelText('Repartidor'), 'Ana Gomez');
    await userEvent.click(within(dialogo).getByRole('button', { name: 'Asignar' }));

    await waitFor(() =>
      expect(within(dialogo).getByText('El repartidor ya no esta libre')).toBeInTheDocument(),
    );
  });

  it('marca el pedido en camino y muestra la confirmacion', async () => {
    const onCambio = vi.fn();
    mockFetchSecuencia([{ status: 200, body: { ...pedidoBase, estado: 'en_camino' } }]);

    render(
      <TarjetaPedido pedido={{ ...pedidoBase, estado: 'asignado' }} onCambio={onCambio} />,
    );
    await userEvent.click(screen.getByRole('button', { name: 'En camino' }));

    await waitFor(() => expect(screen.getByText('Pedido en camino.')).toBeInTheDocument());
    expect(onCambio).toHaveBeenCalled();
  });

  it('pide el motivo antes de mandar la cancelacion', async () => {
    const onCambio = vi.fn();
    const fetchMock = mockFetchSecuencia([
      { status: 200, body: { ...pedidoBase, estado: 'cancelado' } },
    ]);

    render(<TarjetaPedido pedido={pedidoBase} onCambio={onCambio} />);
    await userEvent.click(screen.getByRole('button', { name: 'Cancelar' }));

    const dialogo = await screen.findByRole('dialog');
    await userEvent.type(within(dialogo).getByLabelText('Motivo'), 'Cliente no responde');
    await userEvent.click(within(dialogo).getByRole('button', { name: 'Confirmar cancelación' }));

    await waitFor(() => expect(screen.getByText('Pedido cancelado.')).toBeInTheDocument());
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining('/pedidos/1/cancelar'),
      expect.objectContaining({ body: JSON.stringify({ motivo: 'Cliente no responde' }) }),
    );
    expect(onCambio).toHaveBeenCalled();
  });
});
