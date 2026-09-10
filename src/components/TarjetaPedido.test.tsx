import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { TarjetaPedido } from './TarjetaPedido';
import type { Pedido } from '../types';

const pedidoBase: Pedido = {
  id: 1,
  cliente: 'Juan Perez',
  direccion: 'Av. Siempre Viva 123',
  zona: 'Norte',
  importe: 1500,
  estado: 'pendiente',
};

describe('TarjetaPedido', () => {
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
});
