import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { ListaEntregasPorRepartidor } from './ListaEntregasPorRepartidor';
import type { EntregasPorRepartidor } from '../types';

const filaEjemplo: EntregasPorRepartidor = {
  repartidorId: 1,
  repartidor: 'Ana Gomez',
  entregas: 5,
};

describe('ListaEntregasPorRepartidor', () => {
  it('muestra el estado de carga', () => {
    render(
      <ListaEntregasPorRepartidor porRepartidor={[]} cargando error={null} reintentar={() => {}} />,
    );
    expect(screen.getByText('Cargando…')).toBeInTheDocument();
  });

  it('muestra el error y permite reintentar', async () => {
    const reintentar = vi.fn();
    render(
      <ListaEntregasPorRepartidor
        porRepartidor={[]}
        cargando={false}
        error="falló"
        reintentar={reintentar}
      />,
    );

    expect(screen.getByText('No se pudo cargar la lista.')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Reintentar' }));
    expect(reintentar).toHaveBeenCalledTimes(1);
  });

  it('muestra el estado vacio cuando no hay entregas', () => {
    render(
      <ListaEntregasPorRepartidor porRepartidor={[]} cargando={false} error={null} reintentar={() => {}} />,
    );
    expect(screen.getByText('Todavía no hay entregas en este turno.')).toBeInTheDocument();
  });

  it('lista las entregas por repartidor', () => {
    render(
      <ListaEntregasPorRepartidor
        porRepartidor={[filaEjemplo]}
        cargando={false}
        error={null}
        reintentar={() => {}}
      />,
    );
    expect(screen.getByText('Ana Gomez')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
  });
});
