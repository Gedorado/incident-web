import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import IncidentList from './IncidentList';

const mockIncidents = {
  data: [
    {
      Id: '1',
      Title: 'Database outage',
      Description: 'DB is down',
      Severity: 'CRITICAL',
      Status: 'OPEN',
      ServiceId: 'db-service',
      CreatedAt: '2025-01-01T00:00:00Z',
      UpdatedAt: '2025-01-01T00:00:00Z',
    },
    {
      Id: '2',
      Title: 'High latency',
      Description: 'API is slow',
      Severity: 'HIGH',
      Status: 'IN_PROGRESS',
      ServiceId: 'api-service',
      CreatedAt: '2025-01-02T00:00:00Z',
      UpdatedAt: '2025-01-02T01:00:00Z',
    },
  ],
  total: 2,
  page: 1,
  pageSize: 10,
};

function renderWithRouter(ui: React.ReactElement) {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
}

describe('IncidentList', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('renders incidents from API', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => mockIncidents,
    } as Response);

    renderWithRouter(<IncidentList />);

    expect(screen.getByText('Cargando...')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('Database outage')).toBeInTheDocument();
    });

    expect(screen.getByText('High latency')).toBeInTheDocument();
    expect(screen.getByText('CRITICAL')).toBeInTheDocument();
    expect(screen.getByText('OPEN')).toBeInTheDocument();
    expect(screen.getByText('db-service')).toBeInTheDocument();
    expect(screen.getByText('api-service')).toBeInTheDocument();
  });

  it('shows error message on fetch failure', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: false,
    } as Response);

    renderWithRouter(<IncidentList />);

    await waitFor(() => {
      expect(screen.getByText('Failed to fetch incidents')).toBeInTheDocument();
    });
  });

  it('renders filter controls and create button', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => ({ ...mockIncidents, data: [] }),
    } as Response);

    renderWithRouter(<IncidentList />);

    expect(screen.getByText('Crear Incidente')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Buscar...')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('No se encontraron incidentes.')).toBeInTheDocument();
    });
  });
});
