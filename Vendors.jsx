import { useEffect, useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { vendorsAPI } from '../lib/supabase'
import { Plus, Trash2, Phone } from 'lucide-react'

const CATEGORIES = ['Venue & Gedung', 'Katering', 'Fotografer', 'Videografer', 'Dekorasi & Florist', 'Busana Pengantin', 'Rias & Salon', 'MC & Hiburan', 'Undangan', 'Transportasi', 'Lainnya']
const STATUSES = ['mencari', 'negosiasi', 'terbooking', 'selesai']
const STATUS_LABEL = { mencari: 'Sedang Mencari', negosiasi: 'Negosiasi', terbooking: 'Terbooking', selesai: 'Selesai' }
const STATUS_COLOR = { mencari: '#A08070', negosiasi: '#B8860B', terbooking: '#1565C0', selesai: '#2E7D32' }
const STATUS_BG = { mencari: '#F5F0EC', negosiasi: '#FFFDE7', terbooking: '#E3F2FD', selesai: '#E8F5E9' }

export default function Vendors() {
  const { wedding } = useAuth()
  const [vendors, setVendors] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editId, setEditId] = useState(null)
  const [form, setForm] = useState({ name: '', category: CATEGORIES[0], contact_name: '', phone: '', price: '', status: 'mencari', notes: '' })

  useEffect(() => { if (wedding) loadVendors() }, [wedding])

  const loadVendors = async () => {
    setLoading(true)
    try { setVendors(await vendorsAPI.getAll(wedding.id)) }
    catch (e) {} finally { setLoading(false) }
  }

  const save = async (e) => {
    e.preventDefault()
    const payload = { ...form, price: parseFloat(form.price) || 0 }
    if (editId) {
      const updated = await vendorsAPI.update(editId, payload)
      setVendors(vendors.map(v => v.id === editId ? updated : v))
    } else {
      const v = await vendorsAPI.create({ wedding_id: wedding.id, ...payload })
      setVendors([...vendors, v])
    }
    resetForm()
  }

  const remove = async (id) => {
    await vendorsAPI.delete(id)
    setVendors(vendors.filter(v => v.id !== id))
  }

  const startEdit = (v) => {
    setForm({ name: v.name, category: v.category, contact_name: v.contact_name || '', phone: v.phone || '', price: v.price?.toString() || '', status: v.status, notes: v.notes || '' })
    setEditId(v.id); setShowForm(true)
  }

  const resetForm = () => {
    setForm({ name: '', category: CATEGORIES[0], contact_name: '', phone: '', price: '', status: 'mencari', notes: '' })
    setShowForm(false); setEditId(null)
  }

  const booked = vendors.filter(v => v.status === 'terbooking' || v.status === 'selesai').length
  const totalCost = vendors.reduce((s, v) => s + (v.price || 0), 0)

  const grouped = vendors.reduce((acc, v) => { (acc[v.category] = acc[v.category] || []).push(v); return acc }, {})

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
          <h2 style={{ fontFamily: 'Cormorant Garamond', fontSize: '1.5rem', color: '#2C1810', fontWeight: 600 }}>Vendor</h2>
          <p style={{ fontSize: '0.78rem', color: '#A08070' }}>{vendors.length} vendor · {booked} terbooking · Rp {(totalCost / 1e6).toFixed(1)}jt total</p>
        </div>
        <button onClick={() => { setShowForm(!showForm); setEditId(null) }}
          style={{ background: 'linear-gradient(135deg, #C9956C, #A67850)', color: '#fff', border: 'none', borderRadius: '10px', padding: '8px 14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: 600 }}>
          <Plus size={16} /> Tambah
        </button>
      </div>

      {showForm && (
        <form onSubmit={save} style={{ background: '#fff', borderRadius: '12px', padding: '1rem', marginBottom: '1rem', border: '1px solid #F0E8DC' }}>
          <p style={{ fontWeight: 600, color: '#2C1810', marginBottom: '0.75rem', fontSize: '0.9rem' }}>{editId ? 'Edit Vendor' : 'Vendor Baru'}</p>
          {inp('Nama Vendor *', 'name', 'text', 'Contoh: Studio Foto ABC')}
          <div style={{ marginBottom: '0.75rem' }}>
            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 500, color: '#6B4C3B', marginBottom: '4px' }}>Kategori</label>
            <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}
              style={{ width: '100%', padding: '0.6rem 0.875rem', border: '1px solid #E8D5C4', borderRadius: '8px', fontSize: '0.9rem', fontFamily: 'DM Sans', outline: 'none', background: '#FFFDF9' }}>
              {CATEGORIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          {inp('Nama Kontak', 'contact_name', 'text', 'Nama PIC')}
          {inp('No. HP / WhatsApp', 'phone', 'tel', '08xx')}
          {inp('Harga (Rp)', 'price', 'number', '0')}
          <div style={{ marginBottom: '0.75rem' }}>
            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 500, color: '#6B4C3B', marginBottom: '4px' }}>Status</label>
            <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}
              style={{ width: '100%', padding: '0.6rem 0.875rem', border: '1px solid #E8D5C4', borderRadius: '8px', fontSize: '0.9rem', fontFamily: 'DM Sans', outline: 'none', background: '#FFFDF9' }}>
              {STATUSES.map(s => <option key={s} value={s}>{STATUS_LABEL[s]}</option>)}
            </select>
          </div>
          {inp('Catatan', 'notes', 'text', 'Paket, syarat, dll')}
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button type="submit" style={{ flex: 1, padding: '0.65rem', background: 'linear-gradient(135deg, #C9956C, #A67850)', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem' }}>Simpan</button>
            <button type="button" onClick={resetForm} style={{ padding: '0.65rem 1rem', background: '#F0E8DC', color: '#6B4C3B', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '0.85rem' }}>Batal</button>
          </div>
        </form>
      )}

      {Object.entries(grouped).map(([cat, catVendors]) => (
        <div key={cat} style={{ marginBottom: '1.25rem' }}>
          <p style={{ fontSize: '0.72rem', fontWeight: 700, color: '#A08070', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>{cat}</p>
          {catVendors.map(v => (
            <div key={v.id} style={{ background: '#fff', borderRadius: '10px', padding: '0.875rem 1rem', marginBottom: '0.5rem', border: '1px solid #F0E8DC' }} onClick={() => startEdit(v)}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: 600, color: '#2C1810', fontSize: '0.9rem' }}>{v.name}</p>
                  {v.contact_name && <p style={{ fontSize: '0.78rem', color: '#A08070' }}>{v.contact_name}</p>}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px', flexWrap: 'wrap' }}>
                    {v.price > 0 && <span style={{ fontSize: '0.78rem', fontWeight: 600, color: '#6B4C3B' }}>Rp {v.price.toLocaleString('id-ID')}</span>}
                    <span style={{ fontSize: '0.68rem', background: STATUS_BG[v.status], color: STATUS_COLOR[v.status], padding: '2px 8px', borderRadius: '10px', fontWeight: 500 }}>
                      {STATUS_LABEL[v.status]}
                    </span>
                  </div>
                  {v.notes && <p style={{ fontSize: '0.75rem', color: '#A08070', marginTop: '4px' }}>{v.notes}</p>}
                </div>
                <div style={{ display: 'flex', gap: '8px', marginLeft: '8px' }}>
                  {v.phone && (
                    <a href={`tel:${v.phone}`} onClick={e => e.stopPropagation()} style={{ background: '#E8F5E9', border: 'none', borderRadius: '6px', padding: '6px', cursor: 'pointer', color: '#2E7D32', display: 'flex', alignItems: 'center' }}>
                      <Phone size={14} />
                    </a>
                  )}
                  <button onClick={(e) => { e.stopPropagation(); remove(v.id) }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#E8D5C4', padding: 0 }}>
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ))}

      {vendors.length === 0 && !loading && (
        <div style={{ textAlign: 'center', padding: '2rem', color: '#A08070', fontSize: '0.9rem' }}>
          Belum ada vendor. Tambah sekarang!
        </div>
      )}
    </div>
  )
}
