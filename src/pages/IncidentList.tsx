import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { getIncidents } from '../api/incidents';
import type { Incident, PaginatedResponse } from '../types';

const severityClass: Record<string, string> = {
  CRITICAL: 'badge badge-critical',
  HIGH: 'badge badge-high',
  MEDIUM: 'badge badge-medium',
  LOW: 'badge badge-low',
};

const statusClass: Record<string, string> = {
  OPEN: 'badge badge-open',
  IN_PROGRESS: 'badge badge-in-progress',
  RESOLVED: 'badge badge-resolved',
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString();
}

export default function IncidentList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [response, setResponse] = useState<PaginatedResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const status = searchParams.get('status') || '';
  const severity = searchParams.get('severity') || '';
  const q = searchParams.get('q') || '';
  const page = parseInt(searchParams.get('page') || '1', 10);

  useEffect(() => {
    setLoading(true);
    setError('');
    const params: Record<string, string> = { page: String(page), pageSize: '10' };
    if (status) params.status = status;
    if (severity) params.severity = severity;
    if (q) params.q = q;

    getIncidents(params)
      .then(setResponse)
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, [status, severity, q, page]);

  function updateFilter(key: string, value: string) {
    const next = new URLSearchParams(searchParams);
    if (value) {
      next.set(key, value);
    } else {
      next.delete(key);
    }
    next.set('page', '1');
    setSearchParams(next);
  }

  function goToPage(p: number) {
    const next = new URLSearchParams(searchParams);
    next.set('page', String(p));
    setSearchParams(next);
  }

  const totalPages = response ? Math.max(1, Math.ceil(response.total / response.pageSize)) : 1;

  return (
    <div>
      <div className="page-header">
        <h2>Incidentes</h2>
        <Link to="/incidents/new" className="btn btn-primary">Crear Incidente</Link>
      </div>

      <div className="filters">
        <input
          type="text"
          placeholder="Buscar..."
          value={q}
          onChange={(e) => updateFilter('q', e.target.value)}
          className="input"
        />
        <select
          value={status}
          onChange={(e) => updateFilter('status', e.target.value)}
          className="input"
        >
          <option value="">Todos los estados</option>
          <option value="OPEN">Open</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="RESOLVED">Resolved</option>
        </select>
        <select
          value={severity}
          onChange={(e) => updateFilter('severity', e.target.value)}
          className="input"
        >
          <option value="">Todas las severidades</option>
          <option value="LOW">Low</option>
          <option value="MEDIUM">Medium</option>
          <option value="HIGH">High</option>
          <option value="CRITICAL">Critical</option>
        </select>
      </div>

      {loading && <p className="loading">Cargando...</p>}
      {error && <p className="error-message">{error}</p>}

      {!loading && !error && response && (
        <>
          {response.data.length === 0 ? (
            <p className="empty">No se encontraron incidentes.</p>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>Titulo</th>
                  <th>Severidad</th>
                  <th>Estado</th>
                  <th>Servicio</th>
                  <th>Creado</th>
                </tr>
              </thead>
              <tbody>
                {response.data.map((inc: Incident) => (
                  <tr key={inc.Id}>
                    <td>
                      <Link to={`/incidents/${inc.Id}`}>{inc.Title}</Link>
                    </td>
                    <td><span className={severityClass[inc.Severity]}>{inc.Severity}</span></td>
                    <td><span className={statusClass[inc.Status]}>{inc.Status.replace('_', ' ')}</span></td>
                    <td>{inc.ServiceId}</td>
                    <td>{formatDate(inc.CreatedAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          <div className="pagination">
            <button
              className="btn"
              disabled={page <= 1}
              onClick={() => goToPage(page - 1)}
            >
              Anterior
            </button>
            <span>Pagina {page} de {totalPages}</span>
            <button
              className="btn"
              disabled={page >= totalPages}
              onClick={() => goToPage(page + 1)}
            >
              Siguiente
            </button>
          </div>
        </>
      )}
    </div>
  );
}
