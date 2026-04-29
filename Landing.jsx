import { Link } from 'react-router-dom'
import { Heart, CheckCircle, Users, DollarSign, Clock, Star } from 'lucide-react'

export default function Landing() {
  return (
    <div style={{ minHeight: '100vh', background: '#FAF6F1', fontFamily: 'DM Sans' }}>
      {/* Hero */}
      <div style={{
        background: 'linear-gradient(160deg, #2C1810 0%, #6B4C3B 50%, #C9956C 100%)',
        minHeight: '100vh', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '3rem 1.5rem', textAlign: 'center', position: 'relative', overflow: 'hidden'
      }}>
        {/* Decorative circles */}
        <div style={{
          position: 'absolute', top: '-100px', right: '-100px',
          width: '300px', height: '300px', borderRadius: '50%',
          border: '1px solid rgba(201,149,108,0.2)', pointerEvents: 'none'
        }} />
        <div style={{
          position: 'absolute', bottom: '-60px', left: '-80px',
          width: '250px', height: '250px', borderRadius: '50%',
          border: '1px solid rgba(232,196,160,0.15)', pointerEvents: 'none'
        }} />

        <div style={{
          background: 'rgba(201,149,108,0.15)', borderRadius: '50%',
          width: '80px', height: '80px', display: 'flex',
          alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem',
          border: '1px solid rgba(201,149,108,0.3)'
        }}>
          <Heart size={36} color="#E8C4A0" />
        </div>

        <h1 style={{
          fontFamily: 'Cormorant Garamond', fontSize: '3.5rem',
          fontWeight: 600, color: '#FAF6F1', lineHeight: 1.1, marginBottom: '0.75rem'
        }}>
          Janji Kita
        </h1>

        <p style={{
          fontFamily: 'Cormorant Garamond', fontSize: '1.2rem',
          color: '#E8C4A0', fontStyle: 'italic', marginBottom: '1.5rem'
        }}>
          Rencanakan hari paling istimewamu
        </p>

        <p style={{
          color: 'rgba(250,246,241,0.75)', fontSize: '0.95rem',
          maxWidth: '320px', lineHeight: 1.6, marginBottom: '2.5rem'
        }}>
          Satu aplikasi untuk semua kebutuhan pernikahan kamu. Dari checklist, tamu undangan, vendor, hingga anggaran — semua terorganisir berdua.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', width: '100%', maxWidth: '280px' }}>
          <Link to="/daftar" style={{
            background: 'linear-gradient(135deg, #C9956C, #E8C4A0)',
            color: '#2C1810', padding: '1rem', borderRadius: '12px',
            textDecoration: 'none', fontWeight: 600, fontSize: '1rem',
            textAlign: 'center', letterSpacing: '0.02em',
            boxShadow: '0 4px 20px rgba(201,149,108,0.4)'
          }}>
            Mulai Sekarang
          </Link>
          <Link to="/masuk" style={{
            background: 'rgba(255,255,255,0.1)', color: '#FAF6F1',
            padding: '1rem', borderRadius: '12px', textDecoration: 'none',
            fontWeight: 400, fontSize: '0.95rem', textAlign: 'center',
            border: '1px solid rgba(255,255,255,0.2)'
          }}>
            Sudah punya akun? Masuk
          </Link>
        </div>
      </div>

      {/* Features */}
      <div style={{ padding: '3rem 1.5rem', maxWidth: '480px', margin: '0 auto' }}>
        <h2 style={{
          fontFamily: 'Cormorant Garamond', fontSize: '2rem',
          color: '#2C1810', textAlign: 'center', marginBottom: '0.5rem'
        }}>
          Semua yang kamu butuhkan
        </h2>
        <p style={{ color: '#A08070', textAlign: 'center', marginBottom: '2rem', fontSize: '0.9rem' }}>
          Didesain khusus untuk pasangan yang ingin terorganisir
        </p>

        {[
          { icon: CheckCircle, title: 'Checklist Lengkap', desc: 'Pantau semua persiapan dari jauh hari hingga hari H' },
          { icon: Users, title: 'Daftar Tamu', desc: 'Kelola undangan, konfirmasi kehadiran, dan nomor meja' },
          { icon: Star, title: 'Manajemen Vendor', desc: 'Catat semua vendor dari katering hingga fotografer' },
          { icon: DollarSign, title: 'Pantau Anggaran', desc: 'Lacak estimasi dan pengeluaran nyata per kategori' },
          { icon: Clock, title: 'Timeline Acara', desc: 'Susun jadwal hari H agar semua berjalan lancar' },
          { icon: Heart, title: 'Akses Berdua', desc: 'Kamu dan pasangan bisa pantau bersama real-time' },
        ].map(({ icon: Icon, title, desc }) => (
          <div key={title} style={{
            display: 'flex', gap: '1rem', alignItems: 'flex-start',
            background: '#fff', borderRadius: '12px', padding: '1.25rem',
            marginBottom: '0.75rem', border: '1px solid #F0E8DC',
            boxShadow: '0 2px 8px rgba(201,149,108,0.06)'
          }}>
            <div style={{
              background: 'linear-gradient(135deg, #F0E8DC, #FAF6F1)',
              borderRadius: '10px', padding: '10px', flexShrink: 0,
              border: '1px solid #E8D5C4'
            }}>
              <Icon size={20} color="#C9956C" />
            </div>
            <div>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 600, color: '#2C1810', marginBottom: '4px' }}>{title}</h3>
              <p style={{ fontSize: '0.85rem', color: '#A08070', lineHeight: 1.5 }}>{desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div style={{
        background: 'linear-gradient(135deg, #2C1810, #6B4C3B)',
        padding: '3rem 1.5rem', textAlign: 'center'
      }}>
        <h2 style={{
          fontFamily: 'Cormorant Garamond', fontSize: '2rem',
          color: '#FAF6F1', marginBottom: '0.75rem'
        }}>
          Siap merencanakan?
        </h2>
        <p style={{ color: '#E8C4A0', marginBottom: '2rem', fontSize: '0.9rem' }}>
          Buat akun sekarang dan mulai rencanakan pernikahan impianmu
        </p>
        <Link to="/daftar" style={{
          background: 'linear-gradient(135deg, #C9956C, #E8C4A0)',
          color: '#2C1810', padding: '1rem 2rem', borderRadius: '12px',
          textDecoration: 'none', fontWeight: 600, fontSize: '1rem',
          display: 'inline-block', boxShadow: '0 4px 20px rgba(201,149,108,0.4)'
        }}>
          Daftar Gratis
        </Link>
      </div>
    </div>
  )
}
