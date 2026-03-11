import { Routes, Route, Link } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import IncidentList from './pages/IncidentList'
import IncidentCreate from './pages/IncidentCreate'
import IncidentDetail from './pages/IncidentDetail'
import Login from './pages/Login'

function App() {
  const { isAuthenticated, username, logout } = useAuth()

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <Link to="/" className="app-title"><h1>Incident Manager</h1></Link>
          <div className="header-actions">
            {isAuthenticated ? (
              <>
                <span className="header-user">{username}</span>
                <button className="btn btn-sm" onClick={logout}>Cerrar sesion</button>
              </>
            ) : (
              <Link to="/login" className="btn btn-primary btn-sm">Iniciar sesion</Link>
            )}
          </div>
        </div>
      </header>
      <main className="container">
        <Routes>
          <Route path="/" element={<IncidentList />} />
          <Route path="/login" element={<Login />} />
          <Route path="/incidents/new" element={<IncidentCreate />} />
          <Route path="/incidents/:id" element={<IncidentDetail />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
