import { useEffect, useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { guestsAPI } from '../lib/supabase'
import { Plus, Trash2, Search } from 'lucide-react'

const SIDES = ['berdua', 'pengantin_pria', 'pengantin_wanita']
const RSVP = ['belum', 'hadir', 'tidak_hadir']
const RSVP_LABEL = { belum: 'Belum Konfirmasi', hadir: 'Hadir', tidak_hadir: 'Tidak Hadir' }
const RSVP_COLOR = { belum: '#A08070', hadir: '#2E7D32', tidak_hadir: '#C41C00' }
const RSVP_BG = { belum: '#F5F0EC', hadir: '#E8F5E9', tidak_hadir: '#FFF0F0' }
const SIDE_LABEL = { berdua: 'Berdua', pengantin_pria: 'Pihak Pria', pengantin_wanita: 'Pihak Wanita' }

export default function Guests() {
  const { wedding } = useAuth()
  const [guests, setGuests] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [search, setSearch] = useState('')
  const [filterRsvp, setFilterRsvp] = useState('semua')
  const [form, setForm] = useState({ name: '', phone: '', side: 'berdua', rsvp_status: 'belum', table_number: '', notes: '' })
  const [editId, setEditId] = useState(null)

  useEffect(() => { if (wedding) loadGuests() }, [wedding])

  const loadGuests = async () => {
    setLoading(true)
    try { setGuests(await guestsAPI.getAll(wedding.id)) }
    catch (e) {} finally { setLoading(false) }
  }

  const save = async (e) => {
    e.preventDefault()
    if (editId) {
      const updated = await guestsAPI.update(editId, form)
      setGuests(guests.map(g => g.id === editId ? updated : g))
    } else {
      const g = await guestsAPI.create({ wedding_id: wedding.id, ...form })
      setGuests([...guests, g])
    }
    setForm({ name: '', phone: '', side: 'berdua', rsvp_status: 'belum', table_number: '', notes: '' })
    setShowForm(false); setEditId(null)
  }

  const remove = async (id) => {
    await guestsAPI.delete(id)
    setGuests(guests.filter(g => g.id !== id))
  }

  const startEdit = (g) => {
    setForm({ name: g.name, phone: g.phone || '', side: g.side, rsvp_status: g.rsvp_status, table_number: g.table_number || '', notes: g.notes || '' })
    setEditId(g.id); setShowForm(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const filtered = guests.filter(g => {
    const matchSearch = g.name.toLowerCase().includes(search.toLowerCase())
    const matchRsvp = filterRsvp === 'semua' || g.rsvp_status === filterRsvp
    return matchSearch && matchRsvp
  })

  const hadir = guests.filter(g => g.rsvp_status === 'hadir').length
  const belum = guests.filter(g => g.rsvp_status === 'belum').length

  const inp = (label, key, type = 'text', placeholder = '') => (
    <div style={{ marginBottom: '0.75rem' }}>
      <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 500, color: '#6B4C3B', marginBottom: '4px' }}>{label}</label>
      <input type={type} placeholder={placeholder} value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })}
        style={{ width: '100%', padding: '0.6rem 0.875rem', border: '1px solid #E8D5C4', borderRadius: '8px', fontSize: '0.9rem', fontFamily: 'DM Sans', outline: 'none', background: '#FFFDF9' }} />
    </div>
  )

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <div>
          <h2 style={{ fontFamily: 'Cormorant Garamond', fontSize: '1.5rem', color: '#2C1810', fontWeight: 600 }}>Daftar Tamu</h2>
          <p style={{ fontSize: '0.78rem', color: '#A08070' }}>{guests.length} tamu · {hadir} konfirmasi hadir · {belum} belum</p>
        </div>
        <button onClick={() => { setShowForm(!showForm); setEditId(null); setForm({ name: '', phone: '', side: 'berdua', rsvp_status: 'belum', table_number: '', notes: '' }) }}
          style={{ background: 'linear-gradient(135deg, #C9956C, #A67850)', color: '#fff', border: 'none', borderRadius: '10px', padding: '8px 14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: 600 }}>
          <Plus size={16} /> Tambah
        </button>
      </div>

      {showForm && (
        <form onSubmit={save} style={{ background: '#fff', borderRadius: '12px', padding: '1rem', marginBottom: '1rem', border: '1px solid #F0E8DC' }}>
          <p style={{ fontWeight: 600, color: '#2C1810', marginBottom: '0.75rem', fontSize: '0.9rem' }}>{editId ? 'Edit Tamu' : 'Tamu Baru'}</p>
          {inp('Nama *', 'name', 'text', 'Nama tamu')}
          {inp('No. HP / WhatsApp', 'phone', 'tel', '08xx')}
          {inp('No. Meja', 'table_number', 'text', 'Contoh: A1')}
          <div style={{ marginBottom: '0.75rem' }}>
            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 500, color: '#6B4C3B', marginBottom: '4px' }}>Pihak</label>
            <select value={form.side} onChange={e => setForm({ ...form, side: e.target.value })}
              style={{ width: '100%', padding: '0.6rem 0.875rem', border: '1px solid #E8D5C4', borderRadius: '8px', fontSize: '0.9rem', fontFamily: 'DM Sans', outline: 'none', background: '#FFFDF9' }}>
              {SIDES.map(s => <option key={s} value={s}>{SIDE_LABEL[s]}</option>)}
            </select>
          </div>
          <div style={{ marginBottom: '0.75rem' }}>
            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 500, color: '#6B4C3B', marginBottom: '4px' }}>Status RSVP</label>
            <select value={form.rsvp_status} onChange={e => setForm({ ...form, rsvp_status: e.target.value })}
              style={{ width: '100%', padding: '0.6rem 0.875rem', border: '1px solid #E8D5C4', borderRadius: '8px', fontSize: '0.9rem', fontFamily: 'DM Sans', outline: 'none', background: '#FFFDF9' }}>
              {RSVP.map(r => <option key={r} value={r}>{RSVP_LABEL[r]}</option>)}
            </select>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button type="submit" style={{ flex: 1, padding: '0.65rem', background: 'linear-gradient(135deg, #C9956C, #A67850)', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem' }}>Simpan</button>
            <button type="button" onClick={() => { setShowForm(false); setEditId(null) }} style={{ padding: '0.65rem 1rem', background: '#F0E8DC', color: '#6B4C3B', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '0.85rem' }}>Batal</button>
          </div>
        </form>
      )}

      {/* Search & Filter */}
      <div style={{ marginBottom: '1rem' }}>
        <div style={{ position: 'relative', marginBottom: '0.75rem' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#A08070' }} />
          <input type="text" placeholder="Cari nama tamu..." value={search} onChange={e => setSearch(e.target.value)}
            style={{ width: '100%', padding: '0.65rem 1rem 0.65rem 2.25rem', border: '1px solid #E8D5C4', borderRadius: '10px', fontSize: '0.9rem', fontFamily: 'DM Sans', outline: 'none', background: '#fff' }} />
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '4px' }}>
          {['semua', ...RSVP].map(r => (
            <button key={r} onClick={() => setFilterRsvp(r)} style={{
              padding: '5px 12px', borderRadius: '20px', border: 'none', cursor: 'pointer', whiteSpace: 'nowrap',
              background: filterRsvp === r ? '#C9956C' : '#F0E8DC',
              color: filterRsvp === r ? '#fff' : '#6B4C3B',
              fontSize: '0.78rem', fontWeight: filterRsvp === r ? 600 : 400, fontFamily: 'DM Sans'
            }}>
              {r === 'semua' ? 'Semua' : RSVP_LABEL[r]}
            </button>
          ))}
        </div>
      </div>

      {/* Guest List */}
      {filtered.map(guest => (
        <div key={guest.id} style={{ background: '#fff', borderRadius: '10px', padding: '0.875rem 1rem', marginBottom: '0.5rem', border: '1px solid #F0E8DC', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg, #F0E8DC, #E8D5C4)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#6B4C3B' }}>{guest.name.charAt(0).toUpperCase()}</span>
          </div>
          <div style={{ flex: 1 }} onClick={() => startEdit(guest)}>
            <p style={{ fontWeight: 500, color: '#2C1810', fontSize: '0.9rem' }}>{guest.name}</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '3px', flexWrap: 'wrap' }}>
              {guest.phone && <p style={{ fontSize: '0.72rem', color: '#A08070' }}>{guest.phone}</p>}
              {guest.table_number && <span style={{ fontSize: '0.68rem', background: '#F0E8DC', color: '#6B4C3B', padding: '1px 6px', borderRadius: '4px' }}>Meja {guest.table_number}</span>}
              <span style={{ fontSize: '0.68rem', background: RSVP_BG[guest.rsvp_status], color: RSVP_COLOR[guest.rsvp_status], padding: '1px 8px', borderRadius: '10px', fontWeight: 500 }}>
                {RSVP_LABEL[guest.rsvp_status]}
              </span>
            </div>
          </div>
          <button onClick={() => remove(guest.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#E8D5C4', padding: 0 }}>
            <Trash2 size={16} />
          </button>
        </div>
      ))}

      {filtered.length === 0 && !loading && (
        <div style={{ textAlign: 'center', padding: '2rem', color: '#A08070', fontSize: '0.9rem' }}>
          {search ? 'Tamu tidak ditemukan' : 'Belum ada tamu. Tambah sekarang!'}
        </div>
      )}
    </div>
  )
}
