import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getIncident, updateIncidentStatus } from '../api/incidents';
import type { IncidentDetail as IncidentDetailType } from '../types';

const validTransitions: Record<string, string[]> = {
  OPEN: ['IN_PROGRESS'],
  IN_PROGRESS: ['RESOLVED'],
  RESOLVED: [],
};

function formatEventType(type: string): string {
  return type
    .split('_')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ');
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString();
}

export default function IncidentDetail() {
  const { id } = useParams<{ id: string }>();
  const [incident, setIncident] = useState<IncidentDetailType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    getIncident(id)
      .then(setIncident)
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  async function handleStatusChange(newStatus: string) {
    if (!id) return;
    setUpdating(true);
    setError('');
    try {
      const updated = await updateIncidentStatus(id, newStatus);
      setIncident((prev) =>
        prev ? { ...prev, Status: updated.Status, UpdatedAt: updated.UpdatedAt } : prev
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar estado');
    } finally {
      setUpdating(false);
    }
  }

  if (loading) return <p className="loading">Cargando...</p>;
  if (error && !incident) return <p className="error-message">{error}</p>;
  if (!incident) return <p className="empty">Incidente no encontrado.</p>;

  const transitions = validTransitions[incident.Status] || [];

  return (
    <div>
      <Link to="/" className="back-link">Volver a la lista</Link>

      {error && <p className="error-message">{error}</p>}

      <div className="detail-card">
        <div className="detail-header">
          <h2>{incident.Title}</h2>
          <div className="detail-badges">
            <span className={`badge badge-${incident.Severity.toLowerCase()}`}>{incident.Severity}</span>
            <span className={`badge badge-${incident.Status.toLowerCase().replace('_', '-')}`}>
              {incident.Status.replace('_', ' ')}
            </span>
          </div>
        </div>

        <div className="detail-body">
          <div className="detail-field">
            <strong>Descripcion</strong>
            <p>{incident.Description}</p>
          </div>
          <div className="detail-row">
            <div className="detail-field">
              <strong>Servicio</strong>
              <p>{incident.ServiceId}</p>
            </div>
            <div className="detail-field">
              <strong>Creado</strong>
              <p>{formatDate(incident.CreatedAt)}</p>
            </div>
            <div className="detail-field">
              <strong>Actualizado</strong>
              <p>{formatDate(incident.UpdatedAt)}</p>
            </div>
          </div>

          {transitions.length > 0 && (
            <div className="status-actions">
              <strong>Cambiar estado:</strong>
              {transitions.map((s) => (
                <button
                  key={s}
                  className="btn btn-primary"
                  disabled={updating}
                  onClick={() => handleStatusChange(s)}
                >
                  {s.replace('_', ' ')}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <h3>Linea de tiempo</h3>
      {incident.timeline && incident.timeline.length > 0 ? (
        <div className="timeline">
          {incident.timeline.map((event) => (
            <div key={event._id} className="timeline-event">
              <div className="timeline-dot" />
              <div className="timeline-content">
                <div className="timeline-header">
                  <strong>{formatEventType(event.type)}</strong>
                  <span className="timeline-date">{formatDate(event.occurredAt)}</span>
                </div>
                {event.payload && Object.keys(event.payload).length > 0 && (
                  <pre className="timeline-payload">{JSON.stringify(event.payload, null, 2)}</pre>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="empty">No hay eventos en la linea de tiempo.</p>
      )}
    </div>
  );
}
