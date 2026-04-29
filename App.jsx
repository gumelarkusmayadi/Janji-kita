import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './hooks/useAuth'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Register from './pages/Register'
import CreateWedding from './pages/CreateWedding'
import JoinWedding from './pages/JoinWedding'
import Dashboard from './pages/Dashboard'
import Tasks from './pages/Tasks'
import Guests from './pages/Guests'
import Vendors from './pages/Vendors'
import Budget from './pages/Budget'
import Timeline from './pages/Timeline'
import Layout from './components/Layout'

function PrivateRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#FAF6F1' }}><LoadingSpinner /></div>
  return user ? children : <Navigate to="/masuk" replace />
}

function LoadingSpinner() {
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{
        width: '40px', height: '40px', border: '3px solid #E8D5C4',
        borderTop: '3px solid #C9956C', borderRadius: '50%',
        animation: 'spin 1s linear infinite', margin: '0 auto'
      }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <p style={{ marginTop: '1rem', color: '#A08070', fontFamily: 'DM Sans' }}>Memuat...</p>
    </div>
  )
}

export default function App() {
  const { user, wedding } = useAuth()

  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/masuk" element={user ? <Navigate to="/dashboard" /> : <Login />} />
      <Route path="/daftar" element={user ? <Navigate to="/dashboard" /> : <Register />} />
      <Route path="/buat-pernikahan" element={<PrivateRoute><CreateWedding /></PrivateRoute>} />
      <Route path="/gabung" element={<PrivateRoute><JoinWedding /></PrivateRoute>} />
      <Route path="/dashboard" element={<PrivateRoute><Layout><Dashboard /></Layout></PrivateRoute>} />
      <Route path="/tugas" element={<PrivateRoute><Layout><Tasks /></Layout></PrivateRoute>} />
      <Route path="/tamu" element={<PrivateRoute><Layout><Guests /></Layout></PrivateRoute>} />
      <Route path="/vendor" element={<PrivateRoute><Layout><Vendors /></Layout></PrivateRoute>} />
      <Route path="/anggaran" element={<PrivateRoute><Layout><Budget /></Layout></PrivateRoute>} />
      <Route path="/timeline" element={<PrivateRoute><Layout><Timeline /></Layout></PrivateRoute>} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  )
}
