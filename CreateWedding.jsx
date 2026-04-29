import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { weddingAPI } from '../lib/supabase'
import { Heart } from 'lucide-react'

export default function CreateWedding() {
  const { user, refreshWedding } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    groomName: '', brideName: '', weddingDate: '',
    venue: '', city: '', budgetTotal: '', guestTarget: ''
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await weddingAPI.create({
        groomName: form.groomName, brideName: form.brideName,
        weddingDate: form.weddingDate || null, venue: form.venue,
        city: form.city, budgetTotal: parseFloat(form.budgetTotal) || 0,
        guestTarget: parseInt(form.guestTarget) || 0, userId: user.id
      })
      await refreshWedding()
      navigate('/dashboard')
    } catch (err) {
      setError('Gagal membuat data pernikahan. Coba lagi.')
    } finally {
      setLoading(false)
    }
  }

  const inp = (label, key, type = 'text', placeholder = '') => (
    <div style={{ marginBottom: '1rem' }}>
      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, color: '#6B4C3B', marginBottom: '6px' }}>{label}</label>
      <input
        type={type} placeholder={placeholder}
        value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })}
        style={{ width: '100%', padding: '0.75rem 1rem', border: '1px solid #E8D5C4', borderRadius: '10px', fontSize: '0.95rem', background: '#FFFDF9', outline: 'none', fontFamily: 'DM Sans' }}
      />
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: '#FAF6F1', padding: '2rem 1.5rem' }}>
      <div style={{ maxWidth: '400px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ background: 'linear-gradient(135deg, #C9956C, #E8C4A0)', borderRadius: '50%', width: '56px', height: '56px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
            <Heart size={24} color="#fff" />
          </div>
          <h1 style={{ fontFamily: 'Cormorant Garamond', fontSize: '1.8rem', color: '#2C1810', fontWeight: 600 }}>Data Pernikahan</h1>
          <p style={{ color: '#A08070', fontSize: '0.85rem', marginTop: '4px' }}>Isi informasi dasar pernikahanmu</p>
        </div>

        <div style={{ background: '#fff', borderRadius: '16px', padding: '1.75rem', border: '1px solid #F0E8DC', boxShadow: '0 4px 24px rgba(201,149,108,0.1)' }}>
          {error && (
            <div style={{ background: '#FFF0F0', border: '1px solid #FFCCC7', borderRadius: '8px', padding: '0.75rem', marginBottom: '1.25rem', fontSize: '0.85rem', color: '#C41C00' }}>
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit}>
            {inp('Nama Pengantin Pria *', 'groomName', 'text', 'Contoh: Rizki')}
            {inp('Nama Pengantin Wanita *', 'brideName', 'text', 'Contoh: Siti')}
            {inp('Tanggal Pernikahan', 'weddingDate', 'date')}
            {inp('Nama Gedung / Venue', 'venue', 'text', 'Contoh: Gedung Serbaguna XYZ')}
            {inp('Kota', 'city', 'text', 'Contoh: Bandung')}
            {inp('Estimasi Anggaran (Rp)', 'budgetTotal', 'number', 'Contoh: 150000000')}
            {inp('Target Jumlah Tamu', 'guestTarget', 'number', 'Contoh: 300')}

            <button type="submit" disabled={loading || !form.groomName || !form.brideName} style={{
              width: '100%', padding: '0.9rem',
              background: (!form.groomName || !form.brideName || loading) ? '#E8C4A0' : 'linear-gradient(135deg, #C9956C, #A67850)',
              color: '#fff', border: 'none', borderRadius: '10px',
              fontSize: '1rem', fontWeight: 600, cursor: (!form.groomName || !form.brideName || loading) ? 'not-allowed' : 'pointer',
              fontFamily: 'DM Sans', marginTop: '0.5rem',
              boxShadow: '0 4px 12px rgba(201,149,108,0.3)'
            }}>
              {loading ? 'Menyimpan...' : 'Buat Pernikahan'}
            </button>
          </form>
        </div>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.85rem', color: '#A08070' }}>
          Pasangan kamu yang buat duluan?{' '}
          <a href="/gabung" style={{ color: '#C9956C', fontWeight: 600, textDecoration: 'none' }}>
            Gabung via kode akses
          </a>
        </p>
      </div>
    </div>
  )
}
