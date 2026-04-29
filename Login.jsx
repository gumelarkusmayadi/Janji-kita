import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { authAPI } from '../lib/supabase'
import { Heart, Eye, EyeOff } from 'lucide-react'

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await authAPI.login(form.email, form.password)
      navigate('/dashboard')
    } catch (err) {
      setError('Email atau password salah. Coba lagi.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#FAF6F1', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
      <div style={{ width: '100%', maxWidth: '380px' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ background: 'linear-gradient(135deg, #C9956C, #E8C4A0)', borderRadius: '50%', width: '56px', height: '56px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
            <Heart size={24} color="#fff" />
          </div>
          <h1 style={{ fontFamily: 'Cormorant Garamond', fontSize: '2rem', color: '#2C1810', fontWeight: 600 }}>Janji Kita</h1>
          <p style={{ color: '#A08070', fontSize: '0.9rem', marginTop: '4px' }}>Masuk ke akun kamu</p>
        </div>

        <div style={{ background: '#fff', borderRadius: '16px', padding: '2rem', border: '1px solid #F0E8DC', boxShadow: '0 4px 24px rgba(201,149,108,0.1)' }}>
          {error && (
            <div style={{ background: '#FFF0F0', border: '1px solid #FFCCC7', borderRadius: '8px', padding: '0.75rem', marginBottom: '1.25rem', fontSize: '0.85rem', color: '#C41C00' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, color: '#6B4C3B', marginBottom: '6px' }}>Email</label>
              <input
                type="email" required placeholder="kamu@email.com"
                value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                style={{ width: '100%', padding: '0.75rem 1rem', border: '1px solid #E8D5C4', borderRadius: '10px', fontSize: '0.95rem', background: '#FFFDF9', outline: 'none', fontFamily: 'DM Sans' }}
              />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, color: '#6B4C3B', marginBottom: '6px' }}>Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPass ? 'text' : 'password'} required placeholder="••••••••"
                  value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
                  style={{ width: '100%', padding: '0.75rem 3rem 0.75rem 1rem', border: '1px solid #E8D5C4', borderRadius: '10px', fontSize: '0.95rem', background: '#FFFDF9', outline: 'none', fontFamily: 'DM Sans' }}
                />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#A08070' }}>
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} style={{
              width: '100%', padding: '0.9rem', background: loading ? '#E8C4A0' : 'linear-gradient(135deg, #C9956C, #A67850)',
              color: '#fff', border: 'none', borderRadius: '10px', fontSize: '1rem',
              fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'DM Sans',
              boxShadow: '0 4px 12px rgba(201,149,108,0.3)'
            }}>
              {loading ? 'Memuat...' : 'Masuk'}
            </button>
          </form>
        </div>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem', color: '#A08070' }}>
          Belum punya akun?{' '}
          <Link to="/daftar" style={{ color: '#C9956C', fontWeight: 600, textDecoration: 'none' }}>
            Daftar sekarang
          </Link>
        </p>
      </div>
    </div>
  )
}
