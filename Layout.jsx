import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { authAPI } from '../lib/supabase'
import { Home, CheckSquare, Users, ShoppingBag, DollarSign, Clock, LogOut } from 'lucide-react'

const navItems = [
  { path: '/dashboard', icon: Home, label: 'Beranda' },
  { path: '/tugas', icon: CheckSquare, label: 'Tugas' },
  { path: '/tamu', icon: Users, label: 'Tamu' },
  { path: '/vendor', icon: ShoppingBag, label: 'Vendor' },
  { path: '/anggaran', icon: DollarSign, label: 'Anggaran' },
  { path: '/timeline', icon: Clock, label: 'Timeline' },
]

export default function Layout({ children }) {
  const location = useLocation()
  const navigate = useNavigate()
  const { wedding } = useAuth()

  const handleLogout = async () => {
    await authAPI.logout()
    navigate('/')
  }

  return (
    <div style={{ minHeight: '100vh', background: '#FAF6F1', paddingBottom: '80px' }}>
      {/* Top Header */}
      <header style={{
        background: 'linear-gradient(135deg, #C9956C 0%, #E8C4A0 100%)',
        padding: '1rem 1.25rem',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        position: 'sticky', top: 0, zIndex: 100,
        boxShadow: '0 2px 12px rgba(201,149,108,0.3)'
      }}>
        <div>
          <p style={{ fontFamily: 'Cormorant Garamond', fontSize: '1.5rem', fontWeight: 600, color: '#fff', lineHeight: 1 }}>
            Janji Kita
          </p>
          {wedding && (
            <p style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.85)', marginTop: '2px' }}>
              {wedding.groom_name} & {wedding.bride_name}
            </p>
          )}
        </div>
        <button onClick={handleLogout} style={{
          background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.3)',
          borderRadius: '8px', padding: '6px 10px', cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: '6px',
          color: '#fff', fontSize: '0.8rem'
        }}>
          <LogOut size={14} /> Keluar
        </button>
      </header>

      {/* Content */}
      <main style={{ padding: '1.25rem', maxWidth: '480px', margin: '0 auto' }}>
        {children}
      </main>

      {/* Bottom Navigation */}
      <nav style={{
        position: 'fixed', bottom: 0, left: 0, right: 0,
        background: '#fff', borderTop: '1px solid #E8D5C4',
        display: 'flex', boxShadow: '0 -4px 20px rgba(0,0,0,0.08)',
        zIndex: 100
      }}>
        {navItems.map(({ path, icon: Icon, label }) => {
          const active = location.pathname === path
          return (
            <Link key={path} to={path} style={{
              flex: 1, display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              padding: '8px 4px', textDecoration: 'none',
              color: active ? '#C9956C' : '#A08070',
              transition: 'all 0.2s',
              borderTop: active ? '2px solid #C9956C' : '2px solid transparent'
            }}>
              <Icon size={20} strokeWidth={active ? 2.5 : 1.8} />
              <span style={{ fontSize: '0.6rem', marginTop: '3px', fontWeight: active ? 600 : 400 }}>
                {label}
              </span>
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
