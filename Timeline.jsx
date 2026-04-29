import { useEffect, useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { timelineAPI } from '../lib/supabase'
import { Plus, Trash2, Clock } from 'lucide-react'

const DEFAULT_EVENTS = [
  { event_name: 'Persiapan Pengantin Wanita', start_time: '06:00', end_time: '08:00', location: 'Rumah Pengantin Wanita', pic: 'Tim Rias' },
  { event_name: 'Akad Nikah', start_time: '09:00', end_time: '10:30', location: 'Masjid / Gedung', pic: 'Penghulu' },
  { event_name: 'Foto Bersama Keluarga', start_time: '10:30', end_time: '11:30', location: 'Area Foto', pic: 'Fotografer' },
  { event_name: 'Resepsi & Penyambutan Tamu', start_time: '11:00', end_time: '14:00', location: 'Gedung Resepsi', pic: 'MC' },
  { event_name: 'Makan Siang & Hiburan', start_time: '12:00', end_time: '14:00', location: 'Area Makan', pic: 'Katering' },
  { event_name: 'Penutupan & Bersih-bersih', start_time: '14:00', end_time: '16:00', location: 'Gedung', pic: 'Panitia' },
]

export default function Timeline() {
  const { wedding } = useAuth()
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editId, setEditId] = useState(null)
  const [form, setForm] = useState({ event_name: '', start_time: '', end_time: '', location: '', pic: '', notes: '' })

  useEffect(() => { if (wedding) loadEvents() }, [wedding])

  const loadEvents = async () => {
    setLoading(true)
    try { setEvents(await timelineAPI.getAll(wedding.id)) }
    catch (e) {} finally { setLoading(false) }
  }

  const save = async (e) => {
    e.preventDefault()
    const payload = { ...form, sort_order: parseInt(form.start_time?.replace(':', '')) || 0 }
    if (editId) {
      const updated = await timelineAPI.update(editId, payload)
      setEvents(events.map(ev => ev.id === editId ? updated : ev))
    } else {
      const ev = await timelineAPI.create({ wedding_id: wedding.id, ...payload })
      setEvents([...events, ev].sort((a, b) => a.start_time?.localeCompare(b.start_time)))
    }
    resetForm()
  }

  const remove = async (id) => {
    await timelineAPI.delete(id)
    setEvents(events.filter(ev => ev.id !== id))
  }

  const startEdit = (ev) => {
    setForm({ event_name: ev.event_name, start_time: ev.start_time || '', end_time: ev.end_time || '', location: ev.location || '', pic: ev.pic || '', notes: ev.notes || '' })
    setEditId(ev.id); setShowForm(true)
  }

  const addDefaults = async () => {
    const newEvents = await Promise.all(DEFAULT_EVENTS.map((ev, i) => timelineAPI.create({ wedding_id: wedding.id, ...ev, sort_order: i })))
    setEvents([...events, ...newEvents].sort((a, b) => a.start_time?.localeCompare(b.start_time)))
  }

  const resetForm = () => {
    setForm({ event_name: '', start_time: '', end_time: '', location: '', pic: '', notes: '' })
    setShowForm(false); setEditId(null)
  }

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
          <h2 style={{ fontFamily: 'Cormorant Garamond', fontSize: '1.5rem', color: '#2C1810', fontWeight: 600 }}>Timeline Acara</h2>
          <p style={{ fontSize: '0.78rem', color: '#A08070' }}>{events.length} acara</p>
        </div>
        <button onClick={() => { setShowForm(!showForm); setEditId(null) }}
          style={{ background: 'linear-gradient(135deg, #C9956C, #A67850)', color: '#fff', border: 'none', borderRadius: '10px', padding: '8px 14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: 600 }}>
          <Plus size={16} /> Tambah
        </button>
      </div>

      {events.length === 0 && !loading && (
        <div style={{ background: '#fff', borderRadius: '12px', padding: '1.5rem', border: '1px dashed #E8D5C4', textAlign: 'center', marginBottom: '1rem' }}>
          <p style={{ color: '#A08070', fontSize: '0.9rem', marginBottom: '1rem' }}>Belum ada acara. Gunakan template?</p>
          <button onClick={addDefaults} style={{ background: 'linear-gradient(135deg, #C9956C, #A67850)', color: '#fff', border: 'none', borderRadius: '8px', padding: '0.6rem 1.25rem', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600 }}>
            Gunakan Template
          </button>
        </div>
      )}

      {showForm && (
        <form onSubmit={save} style={{ background: '#fff', borderRadius: '12px', padding: '1rem', marginBottom: '1rem', border: '1px solid #F0E8DC' }}>
          <p style={{ fontWeight: 600, color: '#2C1810', marginBottom: '0.75rem', fontSize: '0.9rem' }}>{editId ? 'Edit Acara' : 'Acara Baru'}</p>
          {inp('Nama Acara *', 'event_name', 'text', 'Contoh: Akad Nikah')}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
            {inp('Mulai', 'start_time', 'time')}
            {inp('Selesai', 'end_time', 'time')}
          </div>
          {inp('Lokasi', 'location', 'text', 'Nama tempat')}
          {inp('Penanggung Jawab', 'pic', 'text', 'Nama PIC')}
          {inp('Catatan', 'notes', 'text', 'Informasi tambahan')}
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button type="submit" style={{ flex: 1, padding: '0.65rem', background: 'linear-gradient(135deg, #C9956C, #A67850)', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem' }}>Simpan</button>
            <button type="button" onClick={resetForm} style={{ padding: '0.65rem 1rem', background: '#F0E8DC', color: '#6B4C3B', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '0.85rem' }}>Batal</button>
          </div>
        </form>
      )}

      {/* Timeline */}
      <div style={{ position: 'relative' }}>
        {events.map((ev, idx) => (
          <div key={ev.id} style={{ display: 'flex', gap: '0.75rem', marginBottom: '0' }} onClick={() => startEdit(ev)}>
            {/* Timeline line */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0, width: '40px' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'linear-gradient(135deg, #C9956C, #A67850)', flexShrink: 0, marginTop: '6px', border: '2px solid #FAF6F1', boxShadow: '0 0 0 2px #C9956C' }} />
              {idx < events.length - 1 && <div style={{ width: '2px', flex: 1, background: 'linear-gradient(180deg, #C9956C, #E8D5C4)', minHeight: '40px' }} />}
            </div>
            {/* Event card */}
            <div style={{ background: '#fff', borderRadius: '10px', padding: '0.875rem 1rem', marginBottom: '0.75rem', border: '1px solid #F0E8DC', flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                    <Clock size={13} color="#C9956C" />
                    <p style={{ fontSize: '0.78rem', color: '#C9956C', fontWeight: 600 }}>
                      {ev.start_time}{ev.end_time ? ` – ${ev.end_time}` : ''}
                    </p>
                  </div>
                  <p style={{ fontWeight: 600, color: '#2C1810', fontSize: '0.9rem' }}>{ev.event_name}</p>
                  {ev.location && <p style={{ fontSize: '0.75rem', color: '#A08070', marginTop: '3px' }}>📍 {ev.location}</p>}
                  {ev.pic && <p style={{ fontSize: '0.72rem', color: '#A08070' }}>PJ: {ev.pic}</p>}
                  {ev.notes && <p style={{ fontSize: '0.72rem', color: '#A08070', fontStyle: 'italic', marginTop: '2px' }}>{ev.notes}</p>}
                </div>
                <button onClick={(e) => { e.stopPropagation(); remove(ev.id) }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#E8D5C4', padding: 0, marginLeft: '8px', flexShrink: 0 }}>
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {loading && <p style={{ textAlign: 'center', color: '#A08070', fontSize: '0.9rem' }}>Memuat...</p>}
    </div>
  )
}
