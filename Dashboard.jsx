import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { tasksAPI, guestsAPI, vendorsAPI, budgetAPI } from '../lib/supabase'
import { CheckSquare, Users, ShoppingBag, DollarSign, Clock, Copy, Check, Heart } from 'lucide-react'

export default function Dashboard() {
  const { wedding, user } = useAuth()
  const navigate = useNavigate()
  const [stats, setStats] = useState({ tasks: 0, tasksCompleted: 0, guests: 0, guestsHadir: 0, vendors: 0, vendorsBooked: 0, budgetUsed: 0 })
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!wedding) { navigate('/buat-pernikahan'); return }
    loadStats()
  }, [wedding])

  const loadStats = async () => {
    try {
      const [tasks, guests, vendors, budget] = await Promise.all([
        tasksAPI.getAll(wedding.id),
        guestsAPI.getAll(wedding.id),
        vendorsAPI.getAll(wedding.id),
        budgetAPI.getAll(wedding.id)
      ])
      const budgetUsed = budget.reduce((s, i) => s + (i.actual_cost || 0), 0)
      setStats({
        tasks: tasks.length, tasksCompleted: tasks.filter(t => t.completed).length,
        guests: guests.length, guestsHadir: guests.filter(g => g.rsvp_status === 'hadir').length,
        vendors: vendors.length, vendorsBooked: vendors.filter(v => v.status === 'terbooking' || v.status === 'selesai').length,
        budgetUsed
      })
    } catch (e) {}
  }

  const copyCode = () => {
    navigator.clipboard.writeText(wedding.access_code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const daysLeft = wedding?.wedding_date
    ? Math.ceil((new Date(wedding.wedding_date) - new Date()) / (1000 * 60 * 60 * 24))
    : null

  const progress = stats.tasks > 0 ? Math.round((stats.tasksCompleted / stats.tasks) * 100) : 0

  if (!wedding) return null

  return (
    <div>
      {/* Wedding Card */}
      <div style={{
        background: 'linear-gradient(135deg, #2C1810 0%, #6B4C3B 100%)',
        borderRadius: '16px', padding: '1.5rem', marginBottom: '1.25rem',
        position: 'relative', overflow: 'hidden'
      }}>
        <div style={{ position: 'absolute', top: '-30px', right: '-30px', width: '120px', height: '120px', borderRadius: '50%', border: '1px solid rgba(201,149,108,0.2)' }} />
        <div style={{ position: 'absolute', bottom: '-20px', left: '-20px', width: '80px', height: '80px', borderRadius: '50%', border: '1px solid rgba(232,196,160,0.1)' }} />

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.5rem' }}>
          <Heart size={16} color="#E8C4A0" />
          <p style={{ fontSize: '0.75rem', color: '#E8C4A0', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Pernikahan Kami</p>
        </div>
        <h2 style={{ fontFamily: 'Cormorant Garamond', fontSize: '1.8rem', color: '#FAF6F1', fontWeight: 600, lineHeight: 1.1, marginBottom: '0.25rem' }}>
          {wedding.groom_name} & {wedding.bride_name}
        </h2>
        {wedding.wedding_date && (
          <p style={{ color: '#C9956C', fontSize: '0.85rem', marginBottom: '0.25rem' }}>
            {new Date(wedding.wedding_date).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        )}
        {wedding.city && <p style={{ color: 'rgba(250,246,241,0.6)', fontSize: '0.8rem' }}>{wedding.venue ? `${wedding.venue}, ` : ''}{wedding.city}</p>}

        {daysLeft !== null && (
          <div style={{ marginTop: '1rem', background: 'rgba(201,149,108,0.2)', borderRadius: '8px', padding: '0.6rem 0.875rem', display: 'inline-block' }}>
            <p style={{ color: '#E8C4A0', fontSize: '0.85rem', fontWeight: 600 }}>
              {daysLeft > 0 ? `${daysLeft} hari lagi` : daysLeft === 0 ? '🎉 Hari ini!' : `${Math.abs(daysLeft)} hari yang lalu`}
            </p>
          </div>
        )}
      </div>

      {/* Access Code */}
      <div style={{ background: '#fff', borderRadius: '12px', padding: '1rem 1.25rem', marginBottom: '1.25rem', border: '1px solid #F0E8DC', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <p style={{ fontSize: '0.75rem', color: '#A08070', marginBottom: '4px' }}>Kode Akses Pasangan</p>
          <p style={{ fontFamily: 'monospace', fontSize: '1.1rem', fontWeight: 700, color: '#C9956C', letterSpacing: '0.1em' }}>
            {wedding.access_code}
          </p>
        </div>
        <button onClick={copyCode} style={{
          background: copied ? '#E8F5E9' : '#FFF8F3', border: `1px solid ${copied ? '#A5D6A7' : '#E8D5C4'}`,
          borderRadius: '8px', padding: '8px 12px', cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: '6px',
          color: copied ? '#2E7D32' : '#C9956C', fontSize: '0.8rem', fontWeight: 500
        }}>
          {copied ? <Check size={14} /> : <Copy size={14} />}
          {copied ? 'Tersalin!' : 'Salin'}
        </button>
      </div>

      {/* Progress */}
      <div style={{ background: '#fff', borderRadius: '12px', padding: '1.25rem', marginBottom: '1.25rem', border: '1px solid #F0E8DC' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
          <p style={{ fontSize: '0.85rem', fontWeight: 600, color: '#2C1810' }}>Progress Persiapan</p>
          <p style={{ fontSize: '0.85rem', fontWeight: 700, color: '#C9956C' }}>{progress}%</p>
        </div>
        <div style={{ height: '8px', background: '#F0E8DC', borderRadius: '4px', overflow: 'hidden' }}>
          <div style={{ height: '100%', background: 'linear-gradient(90deg, #C9956C, #E8C4A0)', width: `${progress}%`, transition: 'width 0.6s ease', borderRadius: '4px' }} />
        </div>
        <p style={{ fontSize: '0.75rem', color: '#A08070', marginTop: '6px' }}>
          {stats.tasksCompleted} dari {stats.tasks} tugas selesai
        </p>
      </div>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1.25rem' }}>
        {[
          { icon: CheckSquare, label: 'Tugas', value: `${stats.tasksCompleted}/${stats.tasks}`, sub: 'selesai', path: '/tugas', color: '#C9956C' },
          { icon: Users, label: 'Tamu', value: stats.guests, sub: `${stats.guestsHadir} konfirmasi`, path: '/tamu', color: '#8B7355' },
          { icon: ShoppingBag, label: 'Vendor', value: stats.vendors, sub: `${stats.vendorsBooked} terbooking`, path: '/vendor', color: '#A67850' },
          { icon: DollarSign, label: 'Anggaran', value: `Rp ${(stats.budgetUsed / 1e6).toFixed(1)}jt`, sub: `dari Rp ${((wedding.budget_total || 0) / 1e6).toFixed(0)}jt`, path: '/anggaran', color: '#6B4C3B' },
        ].map(({ icon: Icon, label, value, sub, path, color }) => (
          <Link key={path} to={path} style={{ textDecoration: 'none' }}>
            <div style={{ background: '#fff', borderRadius: '12px', padding: '1rem', border: '1px solid #F0E8DC', boxShadow: '0 2px 8px rgba(201,149,108,0.06)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.5rem' }}>
                <Icon size={16} color={color} />
                <p style={{ fontSize: '0.75rem', color: '#A08070' }}>{label}</p>
              </div>
              <p style={{ fontSize: '1.4rem', fontWeight: 700, color: '#2C1810', lineHeight: 1 }}>{value}</p>
              <p style={{ fontSize: '0.72rem', color: '#A08070', marginTop: '4px' }}>{sub}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Links */}
      <Link to="/timeline" style={{ textDecoration: 'none' }}>
        <div style={{
          background: 'linear-gradient(135deg, #F0E8DC, #FAF6F1)',
          borderRadius: '12px', padding: '1rem 1.25rem', border: '1px solid #E8D5C4',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Clock size={20} color="#C9956C" />
            <div>
              <p style={{ fontWeight: 600, color: '#2C1810', fontSize: '0.9rem' }}>Timeline Acara</p>
              <p style={{ fontSize: '0.75rem', color: '#A08070' }}>Susun jadwal hari H</p>
            </div>
          </div>
          <p style={{ color: '#C9956C', fontSize: '1.2rem' }}>→</p>
        </div>
      </Link>
    </div>
  )
}
