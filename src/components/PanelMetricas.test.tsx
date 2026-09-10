import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { PanelMetricas } from './PanelMetricas';
import type { MetricasTurno } from '../types';

const metricasEjemplo: MetricasTurno = {
  entregados: 12,
  facturado: 54000,
  tiempoPromedioMinutos: 27,
  demorados: 2,
  porRepartidor: [],
};

describe('PanelMetricas', () => {
  it('muestra el estado de carga', () => {
    render(<PanelMetricas metricas={null} cargando error={null} reintentar={() => {}} />);
    expect(screen.getByText('Cargando métricas…')).toBeInTheDocument();
  });

  it('muestra el error y permite reintentar', async () => {
    const reintentar = vi.fn();
    render(
      <PanelMetricas metricas={null} cargando={false} error="falló" reintentar={reintentar} />,
    );

    expect(screen.getByText('No se pudieron cargar las métricas.')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Reintentar' }));
    expect(reintentar).toHaveBeenCalledTimes(1);
  });

  it('muestra entregados, facturado, tiempo promedio y demorados', () => {
    render(
      <PanelMetricas metricas={metricasEjemplo} cargando={false} error={null} reintentar={() => {}} />,
    );

    expect(screen.getByText('12')).toBeInTheDocument();
    expect(screen.getByText('27 min')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('Facturado')).toBeInTheDocument();
    expect(screen.getByText(/54.000/)).toBeInTheDocument();
  });
});
