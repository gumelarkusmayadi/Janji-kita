import { useEffect, useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { budgetAPI } from '../lib/supabase'
import { Plus, Trash2, CheckCircle2, Circle } from 'lucide-react'

const CATEGORIES = ['Venue & Gedung', 'Katering', 'Fotografer & Videografer', 'Dekorasi & Florist', 'Busana Pengantin', 'Rias & Salon', 'Undangan & Souvenir', 'MC & Hiburan', 'Transportasi', 'Cincin & Mas Kawin', 'Lainnya']

export default function Budget() {
  const { wedding } = useAuth()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editId, setEditId] = useState(null)
  const [form, setForm] = useState({ category: CATEGORIES[0], item_name: '', estimated_cost: '', actual_cost: '', paid: false, notes: '' })

  useEffect(() => { if (wedding) loadItems() }, [wedding])

  const loadItems = async () => {
    setLoading(true)
    try { setItems(await budgetAPI.getAll(wedding.id)) }
    catch (e) {} finally { setLoading(false) }
  }

  const save = async (e) => {
    e.preventDefault()
    const payload = { ...form, estimated_cost: parseFloat(form.estimated_cost) || 0, actual_cost: parseFloat(form.actual_cost) || 0 }
    if (editId) {
      const updated = await budgetAPI.update(editId, payload)
      setItems(items.map(i => i.id === editId ? updated : i))
    } else {
      const item = await budgetAPI.create({ wedding_id: wedding.id, ...payload })
      setItems([...items, item])
    }
    resetForm()
  }

  const togglePaid = async (item) => {
    const updated = await budgetAPI.update(item.id, { paid: !item.paid })
    setItems(items.map(i => i.id === item.id ? updated : i))
  }

  const remove = async (id) => {
    await budgetAPI.delete(id)
    setItems(items.filter(i => i.id !== id))
  }

  const startEdit = (item) => {
    setForm({ category: item.category, item_name: item.item_name, estimated_cost: item.estimated_cost?.toString() || '', actual_cost: item.actual_cost?.toString() || '', paid: item.paid, notes: item.notes || '' })
    setEditId(item.id); setShowForm(true)
  }

  const resetForm = () => {
    setForm({ category: CATEGORIES[0], item_name: '', estimated_cost: '', actual_cost: '', paid: false, notes: '' })
    setShowForm(false); setEditId(null)
  }

  const totalBudget = wedding?.budget_total || 0
  const totalEstimated = items.reduce((s, i) => s + (i.estimated_cost || 0), 0)
  const totalActual = items.reduce((s, i) => s + (i.actual_cost || 0), 0)
  const totalPaid = items.filter(i => i.paid).reduce((s, i) => s + (i.actual_cost || 0), 0)
  const remaining = totalBudget - totalActual
  const progressPercent = totalBudget > 0 ? Math.min(100, Math.round((totalActual / totalBudget) * 100)) : 0

  const grouped = items.reduce((acc, i) => { (acc[i.category] = acc[i.category] || []).push(i); return acc }, {})

  const fmt = (n) => `Rp ${(n || 0).toLocaleString('id-ID')}`

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
          <h2 style={{ fontFamily: 'Cormorant Garamond', fontSize: '1.5rem', color: '#2C1810', fontWeight: 600 }}>Anggaran</h2>
          <p style={{ fontSize: '0.78rem', color: '#A08070' }}>{items.length} item</p>
        </div>
        <button onClick={() => { setShowForm(!showForm); setEditId(null) }}
          style={{ background: 'linear-gradient(135deg, #C9956C, #A67850)', color: '#fff', border: 'none', borderRadius: '10px', padding: '8px 14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: 600 }}>
          <Plus size={16} /> Tambah
        </button>
      </div>

      {/* Summary Card */}
      <div style={{ background: 'linear-gradient(135deg, #2C1810, #6B4C3B)', borderRadius: '14px', padding: '1.25rem', marginBottom: '1rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
          {[
            { label: 'Total Anggaran', value: fmt(totalBudget), light: true },
            { label: 'Pengeluaran Aktual', value: fmt(totalActual), light: true },
            { label: 'Estimasi', value: fmt(totalEstimated), light: false },
            { label: 'Sisa Anggaran', value: fmt(remaining), light: false, warn: remaining < 0 },
          ].map(({ label, value, light, warn }) => (
            <div key={label} style={{ background: 'rgba(255,255,255,0.1)', borderRadius: '8px', padding: '0.75rem' }}>
              <p style={{ fontSize: '0.65rem', color: 'rgba(250,246,241,0.6)', marginBottom: '4px' }}>{label}</p>
              <p style={{ fontSize: '0.9rem', fontWeight: 700, color: warn ? '#FF8A80' : '#FAF6F1' }}>{value}</p>
            </div>
          ))}
        </div>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
            <p style={{ fontSize: '0.7rem', color: 'rgba(250,246,241,0.6)' }}>Terpakai dari anggaran</p>
            <p style={{ fontSize: '0.7rem', color: '#E8C4A0', fontWeight: 600 }}>{progressPercent}%</p>
          </div>
          <div style={{ height: '6px', background: 'rgba(255,255,255,0.15)', borderRadius: '3px' }}>
            <div style={{ height: '100%', background: progressPercent > 90 ? '#FF8A80' : 'linear-gradient(90deg, #C9956C, #E8C4A0)', width: `${progressPercent}%`, borderRadius: '3px', transition: 'width 0.4s' }} />
          </div>
        </div>
      </div>

      {showForm && (
        <form onSubmit={save} style={{ background: '#fff', borderRadius: '12px', padding: '1rem', marginBottom: '1rem', border: '1px solid #F0E8DC' }}>
          <p style={{ fontWeight: 600, color: '#2C1810', marginBottom: '0.75rem', fontSize: '0.9rem' }}>{editId ? 'Edit Item' : 'Item Baru'}</p>
          <div style={{ marginBottom: '0.75rem' }}>
            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 500, color: '#6B4C3B', marginBottom: '4px' }}>Kategori</label>
            <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}
              style={{ width: '100%', padding: '0.6rem 0.875rem', border: '1px solid #E8D5C4', borderRadius: '8px', fontSize: '0.9rem', fontFamily: 'DM Sans', outline: 'none', background: '#FFFDF9' }}>
              {CATEGORIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          {inp('Nama Item *', 'item_name', 'text', 'Contoh: Sewa Gedung')}
          {inp('Estimasi Biaya (Rp)', 'estimated_cost', 'number', '0')}
          {inp('Biaya Aktual (Rp)', 'actual_cost', 'number', '0')}
          <div style={{ marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input type="checkbox" id="paid" checked={form.paid} onChange={e => setForm({ ...form, paid: e.target.checked })} style={{ accentColor: '#C9956C', width: '16px', height: '16px' }} />
            <label htmlFor="paid" style={{ fontSize: '0.85rem', color: '#6B4C3B' }}>Sudah dibayar</label>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button type="submit" style={{ flex: 1, padding: '0.65rem', background: 'linear-gradient(135deg, #C9956C, #A67850)', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem' }}>Simpan</button>
            <button type="button" onClick={resetForm} style={{ padding: '0.65rem 1rem', background: '#F0E8DC', color: '#6B4C3B', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '0.85rem' }}>Batal</button>
          </div>
        </form>
      )}

      {Object.entries(grouped).map(([cat, catItems]) => {
        const catTotal = catItems.reduce((s, i) => s + (i.actual_cost || 0), 0)
        return (
          <div key={cat} style={{ marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <p style={{ fontSize: '0.72rem', fontWeight: 700, color: '#A08070', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{cat}</p>
              <p style={{ fontSize: '0.75rem', fontWeight: 600, color: '#6B4C3B' }}>{fmt(catTotal)}</p>
            </div>
            {catItems.map(item => (
              <div key={item.id} style={{ background: '#fff', borderRadius: '10px', padding: '0.875rem 1rem', marginBottom: '0.5rem', border: '1px solid #F0E8DC', display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }} onClick={() => startEdit(item)}>
                <button onClick={(e) => { e.stopPropagation(); togglePaid(item) }} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, marginTop: '2px', flexShrink: 0, color: item.paid ? '#C9956C' : '#E8D5C4' }}>
                  {item.paid ? <CheckCircle2 size={20} /> : <Circle size={20} />}
                </button>
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: 500, color: '#2C1810', fontSize: '0.9rem' }}>{item.item_name}</p>
                  <div style={{ display: 'flex', gap: '12px', marginTop: '4px' }}>
                    <div>
                      <p style={{ fontSize: '0.65rem', color: '#A08070' }}>Estimasi</p>
                      <p style={{ fontSize: '0.8rem', color: '#6B4C3B' }}>{fmt(item.estimated_cost)}</p>
                    </div>
                    <div>
                      <p style={{ fontSize: '0.65rem', color: '#A08070' }}>Aktual</p>
                      <p style={{ fontSize: '0.8rem', fontWeight: 600, color: '#2C1810' }}>{fmt(item.actual_cost)}</p>
                    </div>
                  </div>
                  {item.notes && <p style={{ fontSize: '0.72rem', color: '#A08070', marginTop: '4px' }}>{item.notes}</p>}
                </div>
                <button onClick={(e) => { e.stopPropagation(); remove(item.id) }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#E8D5C4', padding: 0 }}>
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        )
      })}

      {items.length === 0 && !loading && (
        <div style={{ textAlign: 'center', padding: '2rem', color: '#A08070', fontSize: '0.9rem' }}>
          Belum ada item anggaran. Tambah sekarang!
        </div>
      )}
    </div>
  )
}
