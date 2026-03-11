import { Routes, Route, Link } from 'react-router-dom'
import IncidentList from './pages/IncidentList'
import IncidentCreate from './pages/IncidentCreate'
import IncidentDetail from './pages/IncidentDetail'

function App() {
  return (
    <div className="app">
      <header className="app-header">
        <Link to="/" className="app-title"><h1>Incident Manager</h1></Link>
      </header>
      <main className="container">
        <Routes>
          <Route path="/" element={<IncidentList />} />
          <Route path="/incidents/new" element={<IncidentCreate />} />
          <Route path="/incidents/:id" element={<IncidentDetail />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
