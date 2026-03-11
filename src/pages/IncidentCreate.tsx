import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createIncident } from '../api/incidents';

export default function IncidentCreate() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [severity, setSeverity] = useState('');
  const [serviceId, setServiceId] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  function validate(): boolean {
    const errors: Record<string, string> = {};
    if (!title.trim()) errors.title = 'El titulo es requerido';
    if (!description.trim()) errors.description = 'La descripcion es requerida';
    if (!severity) errors.severity = 'La severidad es requerida';
    if (!serviceId.trim()) errors.serviceId = 'El ID del servicio es requerido';
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    setError('');
    try {
      const incident = await createIncident({
        title: title.trim(),
        description: description.trim(),
        severity,
        serviceId: serviceId.trim(),
      });
      navigate(`/incidents/${incident.Id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear el incidente');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <div className="page-header">
        <h2>Crear Incidente</h2>
      </div>

      {error && <p className="error-message">{error}</p>}

      <form onSubmit={handleSubmit} className="form" noValidate>
        <div className="form-group">
          <label htmlFor="title">Titulo</label>
          <input
            id="title"
            type="text"
            className={`input ${validationErrors.title ? 'input-error' : ''}`}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          {validationErrors.title && <span className="field-error">{validationErrors.title}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="description">Descripcion</label>
          <textarea
            id="description"
            className={`input textarea ${validationErrors.description ? 'input-error' : ''}`}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
          />
          {validationErrors.description && <span className="field-error">{validationErrors.description}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="severity">Severidad</label>
          <select
            id="severity"
            className={`input ${validationErrors.severity ? 'input-error' : ''}`}
            value={severity}
            onChange={(e) => setSeverity(e.target.value)}
          >
            <option value="">Seleccionar severidad</option>
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
            <option value="CRITICAL">Critical</option>
          </select>
          {validationErrors.severity && <span className="field-error">{validationErrors.severity}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="serviceId">ID del Servicio</label>
          <input
            id="serviceId"
            type="text"
            className={`input ${validationErrors.serviceId ? 'input-error' : ''}`}
            value={serviceId}
            onChange={(e) => setServiceId(e.target.value)}
          />
          {validationErrors.serviceId && <span className="field-error">{validationErrors.serviceId}</span>}
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? 'Creando...' : 'Crear Incidente'}
          </button>
          <Link to="/" className="btn">Cancelar</Link>
        </div>
      </form>
    </div>
  );
}
