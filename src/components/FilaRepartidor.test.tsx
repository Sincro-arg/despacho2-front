import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { FilaRepartidor } from './FilaRepartidor';
import type { Repartidor } from '../types';

const repartidorActivo: Repartidor = {
  id: 1,
  nombre: 'Ana Gomez',
  telefono: '11-2233-4455',
  vehiculo: 'Moto',
  estado: 'activo',
};

describe('FilaRepartidor', () => {
  it('muestra los datos y el estado activo', () => {
    render(<FilaRepartidor repartidor={repartidorActivo} onEditar={vi.fn()} onBaja={vi.fn()} />);
    expect(screen.getByText('Ana Gomez')).toBeInTheDocument();
    expect(screen.getByText('11-2233-4455')).toBeInTheDocument();
    expect(screen.getByText('Moto')).toBeInTheDocument();
    expect(screen.getByText('Activo')).toBeInTheDocument();
  });

  it('no ofrece dar de baja a un repartidor inactivo', () => {
    render(
      <FilaRepartidor
        repartidor={{ ...repartidorActivo, estado: 'inactivo' }}
        onEditar={vi.fn()}
        onBaja={vi.fn()}
      />,
    );
    expect(screen.getByText('Inactivo')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Dar de baja' })).not.toBeInTheDocument();
  });

  it('llama a onEditar al hacer click en Editar', async () => {
    const onEditar = vi.fn();
    render(<FilaRepartidor repartidor={repartidorActivo} onEditar={onEditar} onBaja={vi.fn()} />);
    await userEvent.click(screen.getByRole('button', { name: 'Editar' }));
    expect(onEditar).toHaveBeenCalledWith(repartidorActivo);
  });

  it('pide confirmacion antes de dar de baja y permite cancelar', async () => {
    const onBaja = vi.fn();
    render(<FilaRepartidor repartidor={repartidorActivo} onEditar={vi.fn()} onBaja={onBaja} />);

    await userEvent.click(screen.getByRole('button', { name: 'Dar de baja' }));
    expect(screen.getByText('¿Dar de baja a Ana Gomez?')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: 'Cancelar' }));
    expect(screen.queryByText('¿Dar de baja a Ana Gomez?')).not.toBeInTheDocument();
    expect(onBaja).not.toHaveBeenCalled();
  });

  it('confirma la baja y llama a onBaja', async () => {
    const onBaja = vi.fn().mockResolvedValue(undefined);
    render(<FilaRepartidor repartidor={repartidorActivo} onEditar={vi.fn()} onBaja={onBaja} />);

    await userEvent.click(screen.getByRole('button', { name: 'Dar de baja' }));
    await userEvent.click(screen.getByRole('button', { name: 'Sí, dar de baja' }));

    await waitFor(() => expect(onBaja).toHaveBeenCalledWith(repartidorActivo));
  });

  it('muestra un error si la baja falla y mantiene la confirmacion abierta', async () => {
    const onBaja = vi.fn().mockRejectedValue(new Error('No se pudo dar de baja al repartidor (500)'));
    render(<FilaRepartidor repartidor={repartidorActivo} onEditar={vi.fn()} onBaja={onBaja} />);

    await userEvent.click(screen.getByRole('button', { name: 'Dar de baja' }));
    await userEvent.click(screen.getByRole('button', { name: 'Sí, dar de baja' }));

    await waitFor(() =>
      expect(screen.getByText('No se pudo dar de baja al repartidor (500)')).toBeInTheDocument(),
    );
  });
});
