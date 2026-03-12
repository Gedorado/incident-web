import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { loginUser } from '../api/incidents';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError('Usuario y contraseña son requeridos');
      return;
    }

    setSubmitting(true);
    setError('');
    try {
      const data = await loginUser(username.trim(), password);
      login(data.access_token, username.trim());
      navigate('/');
    } catch {
      setError('Credenciales invalidas');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Iniciar Sesion</h2>
        <p className="login-subtitle">Ingresa tus credenciales para continuar</p>

        {error && <p className="error-message">{error}</p>}

        <form onSubmit={handleSubmit} className="form" noValidate>
          <div className="form-group">
            <label htmlFor="username">Usuario</label>
            <input
              id="username"
              type="text"
              className="input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoFocus
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input
              id="password"
              type="password"
              className="input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button type="submit" className="btn btn-primary login-btn" disabled={submitting}>
            {submitting ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>
      </div>
    </div>
  );
}
