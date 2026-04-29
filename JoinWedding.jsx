import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { weddingAPI } from '../lib/supabase'
import { Key } from 'lucide-react'

export default function JoinWedding() {
  const { user, refreshWedding } = useAuth()
  const navigate = useNavigate()
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await weddingAPI.joinByCode(code.trim(), user.id)
      await refreshWedding()
      navigate('/dashboard')
    } catch (err) {
      setError('Kode akses tidak ditemukan atau sudah tidak valid.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#FAF6F1', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
      <div style={{ width: '100%', maxWidth: '380px' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ background: 'linear-gradient(135deg, #C9956C, #E8C4A0)', borderRadius: '50%', width: '56px', height: '56px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
            <Key size={24} color="#fff" />
          </div>
          <h1 style={{ fontFamily: 'Cormorant Garamond', fontSize: '1.8rem', color: '#2C1810', fontWeight: 600 }}>Gabung Pernikahan</h1>
          <p style={{ color: '#A08070', fontSize: '0.9rem', marginTop: '4px' }}>Masukkan kode akses dari pasanganmu</p>
        </div>

        <div style={{ background: '#fff', borderRadius: '16px', padding: '2rem', border: '1px solid #F0E8DC', boxShadow: '0 4px 24px rgba(201,149,108,0.1)' }}>
          {error && (
            <div style={{ background: '#FFF0F0', border: '1px solid #FFCCC7', borderRadius: '8px', padding: '0.75rem', marginBottom: '1.25rem', fontSize: '0.85rem', color: '#C41C00' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, color: '#6B4C3B', marginBottom: '6px' }}>
                Kode Akses
              </label>
              <input
                type="text" required placeholder="Contoh: JK-ABCD-1234"
                value={code} onChange={e => setCode(e.target.value.toUpperCase())}
                style={{
                  width: '100%', padding: '0.75rem 1rem', border: '1px solid #E8D5C4',
                  borderRadius: '10px', fontSize: '1.1rem', background: '#FFFDF9',
                  outline: 'none', fontFamily: 'monospace', textAlign: 'center',
                  letterSpacing: '0.1em'
                }}
              />
              <p style={{ fontSize: '0.78rem', color: '#A08070', marginTop: '6px' }}>
                Minta kode ini dari pasanganmu yang sudah mendaftar duluan
              </p>
            </div>

            <button type="submit" disabled={loading || code.length < 6} style={{
              width: '100%', padding: '0.9rem',
              background: (loading || code.length < 6) ? '#E8C4A0' : 'linear-gradient(135deg, #C9956C, #A67850)',
              color: '#fff', border: 'none', borderRadius: '10px',
              fontSize: '1rem', fontWeight: 600, cursor: (loading || code.length < 6) ? 'not-allowed' : 'pointer',
              fontFamily: 'DM Sans', boxShadow: '0 4px 12px rgba(201,149,108,0.3)'
            }}>
              {loading ? 'Mencari...' : 'Gabung Sekarang'}
            </button>
          </form>
        </div>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.85rem', color: '#A08070' }}>
          Belum ada pernikahannya?{' '}
          <Link to="/buat-pernikahan" style={{ color: '#C9956C', fontWeight: 600, textDecoration: 'none' }}>
            Buat sekarang
          </Link>
        </p>
      </div>
    </div>
  )
}
