import { useEffect, useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { tasksAPI } from '../lib/supabase'
import { Plus, Trash2, CheckCircle2, Circle } from 'lucide-react'

const CATEGORIES = ['Venue & Gedung', 'Katering', 'Dekorasi', 'Fotografer & Videografer', 'Busana', 'Undangan', 'Hiburan & Musik', 'Transportasi', 'Lainnya']

const DEFAULT_TASKS = [
  { title: 'Tentukan tanggal pernikahan', category: 'Lainnya' },
  { title: 'Buat anggaran pernikahan', category: 'Lainnya' },
  { title: 'Survey dan booking venue', category: 'Venue & Gedung' },
  { title: 'Pilih dan booking katering', category: 'Katering' },
  { title: 'Booking fotografer & videografer', category: 'Fotografer & Videografer' },
  { title: 'Pilih baju pengantin', category: 'Busana' },
  { title: 'Desain dan cetak undangan', category: 'Undangan' },
  { title: 'Susun daftar tamu', category: 'Lainnya' },
  { title: 'Pilih dekorasi', category: 'Dekorasi' },
  { title: 'Booking MC dan hiburan', category: 'Hiburan & Musik' },
]

export default function Tasks() {
  const { wedding } = useAuth()
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ title: '', category: CATEGORIES[0] })
  const [filter, setFilter] = useState('semua')

  useEffect(() => { if (wedding) loadTasks() }, [wedding])

  const loadTasks = async () => {
    setLoading(true)
    try { setTasks(await tasksAPI.getAll(wedding.id)) }
    catch (e) {} finally { setLoading(false) }
  }

  const addTask = async (e) => {
    e.preventDefault()
    if (!form.title.trim()) return
    const t = await tasksAPI.create({ wedding_id: wedding.id, title: form.title, category: form.category, completed: false })
    setTasks([...tasks, t])
    setForm({ title: '', category: CATEGORIES[0] })
    setShowForm(false)
  }

  const toggle = async (task) => {
    const updated = await tasksAPI.update(task.id, { completed: !task.completed })
    setTasks(tasks.map(t => t.id === task.id ? updated : t))
  }

  const remove = async (id) => {
    await tasksAPI.delete(id)
    setTasks(tasks.filter(t => t.id !== id))
  }

  const addDefaults = async () => {
    const newTasks = await Promise.all(DEFAULT_TASKS.map(t => tasksAPI.create({ wedding_id: wedding.id, ...t, completed: false })))
    setTasks([...tasks, ...newTasks])
  }

  const completed = tasks.filter(t => t.completed).length
  const filtered = filter === 'semua' ? tasks : filter === 'selesai' ? tasks.filter(t => t.completed) : tasks.filter(t => !t.completed)
  const grouped = filtered.reduce((acc, t) => { (acc[t.category] = acc[t.category] || []).push(t); return acc }, {})

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <div>
          <h2 style={{ fontFamily: 'Cormorant Garamond', fontSize: '1.5rem', color: '#2C1810', fontWeight: 600 }}>Checklist Tugas</h2>
          <p style={{ fontSize: '0.78rem', color: '#A08070' }}>{completed}/{tasks.length} selesai</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} style={{
          background: 'linear-gradient(135deg, #C9956C, #A67850)', color: '#fff',
          border: 'none', borderRadius: '10px', padding: '8px 14px',
          cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: 600
        }}>
          <Plus size={16} /> Tambah
        </button>
      </div>

      {tasks.length === 0 && !loading && (
        <div style={{ background: '#fff', borderRadius: '12px', padding: '1.5rem', border: '1px dashed #E8D5C4', textAlign: 'center', marginBottom: '1rem' }}>
          <p style={{ color: '#A08070', fontSize: '0.9rem', marginBottom: '1rem' }}>Belum ada tugas. Mulai dengan template?</p>
          <button onClick={addDefaults} style={{ background: 'linear-gradient(135deg, #C9956C, #A67850)', color: '#fff', border: 'none', borderRadius: '8px', padding: '0.6rem 1.25rem', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600 }}>
            Gunakan Template
          </button>
        </div>
      )}

      {showForm && (
        <form onSubmit={addTask} style={{ background: '#fff', borderRadius: '12px', padding: '1rem', marginBottom: '1rem', border: '1px solid #F0E8DC' }}>
          <input
            type="text" placeholder="Nama tugas..." required
            value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
            style={{ width: '100%', padding: '0.65rem 0.875rem', border: '1px solid #E8D5C4', borderRadius: '8px', fontSize: '0.9rem', marginBottom: '0.5rem', fontFamily: 'DM Sans', outline: 'none', background: '#FFFDF9' }}
          />
          <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}
            style={{ width: '100%', padding: '0.65rem 0.875rem', border: '1px solid #E8D5C4', borderRadius: '8px', fontSize: '0.9rem', marginBottom: '0.75rem', fontFamily: 'DM Sans', outline: 'none', background: '#FFFDF9' }}>
            {CATEGORIES.map(c => <option key={c}>{c}</option>)}
          </select>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button type="submit" style={{ flex: 1, padding: '0.65rem', background: 'linear-gradient(135deg, #C9956C, #A67850)', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem' }}>Simpan</button>
            <button type="button" onClick={() => setShowForm(false)} style={{ padding: '0.65rem 1rem', background: '#F0E8DC', color: '#6B4C3B', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '0.85rem' }}>Batal</button>
          </div>
        </form>
      )}

      {/* Filter */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
        {['semua', 'belum', 'selesai'].map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{
            padding: '6px 14px', borderRadius: '20px', border: 'none', cursor: 'pointer',
            background: filter === f ? '#C9956C' : '#F0E8DC',
            color: filter === f ? '#fff' : '#6B4C3B',
            fontSize: '0.8rem', fontWeight: filter === f ? 600 : 400, fontFamily: 'DM Sans'
          }}>
            {f === 'semua' ? 'Semua' : f === 'belum' ? 'Belum Selesai' : 'Selesai'}
          </button>
        ))}
      </div>

      {/* Tasks grouped by category */}
      {Object.entries(grouped).map(([cat, catTasks]) => (
        <div key={cat} style={{ marginBottom: '1.25rem' }}>
          <p style={{ fontSize: '0.72rem', fontWeight: 700, color: '#A08070', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>{cat}</p>
          {catTasks.map(task => (
            <div key={task.id} style={{
              background: '#fff', borderRadius: '10px', padding: '0.875rem 1rem',
              marginBottom: '0.5rem', border: '1px solid #F0E8DC',
              display: 'flex', alignItems: 'center', gap: '0.75rem',
              opacity: task.completed ? 0.7 : 1
            }}>
              <button onClick={() => toggle(task)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, flexShrink: 0, color: task.completed ? '#C9956C' : '#E8D5C4' }}>
                {task.completed ? <CheckCircle2 size={22} /> : <Circle size={22} />}
              </button>
              <p style={{ flex: 1, fontSize: '0.9rem', color: '#2C1810', textDecoration: task.completed ? 'line-through' : 'none' }}>{task.title}</p>
              <button onClick={() => remove(task.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: '#E8D5C4' }}>
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      ))}

      {loading && <p style={{ textAlign: 'center', color: '#A08070', fontSize: '0.9rem' }}>Memuat...</p>}
    </div>
  )
}
