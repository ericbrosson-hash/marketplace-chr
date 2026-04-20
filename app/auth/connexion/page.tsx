'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

const inputStyle = {
  width: '100%',
  border: '1px solid var(--chr-border)',
  borderRadius: 'var(--chr-radius-sm)',
  padding: '8px 12px',
  fontSize: '14px',
  color: 'var(--chr-text)',
  background: 'var(--chr-card)',
  outline: 'none',
  fontFamily: 'inherit',
}

const labelStyle = {
  display: 'block',
  fontSize: '12px',
  fontWeight: '500' as const,
  color: 'var(--chr-muted)',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.05em',
  marginBottom: '6px',
}

export default function Connexion() {
  const router = useRouter()
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const { error } = await supabase.auth.signInWithPassword({
      email: form.email,
      password: form.password,
    })

    if (error) {
      setMessage('Email ou mot de passe incorrect')
      setLoading(false)
      return
    }

    router.push('/annonces')
  }

  return (
    <main
      className="min-h-screen flex items-center justify-center"
      style={{ background: 'var(--chr-bg)' }}
    >
      <div
        className="w-full max-w-md rounded-xl p-8"
        style={{ background: 'var(--chr-card)', border: '1px solid var(--chr-border)' }}
      >

        {/* Logo */}
        <Link href="/" className="flex items-center justify-center gap-2 mb-8">
          <span className="w-2 h-2 rounded-full" style={{ background: 'var(--chr-accent)' }}></span>
          <span className="font-semibold text-sm" style={{ color: 'var(--chr-text)' }}>CHR Occasion</span>
        </Link>

        <h1 className="text-xl font-semibold text-center mb-6" style={{ color: 'var(--chr-text)' }}>
          Se connecter
        </h1>

        {message && (
          <div
            className="p-3 rounded-md text-sm mb-4"
            style={{ background: 'var(--chr-etat-pie-bg)', color: 'var(--chr-etat-pie-text)' }}
          >
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label style={labelStyle}>Email *</label>
            <input
              type="email"
              placeholder="jean@restaurant.fr"
              style={inputStyle}
              value={form.email}
              onChange={(e) => setForm({...form, email: e.target.value})}
              required
            />
          </div>

          <div>
            <label style={labelStyle}>Mot de passe *</label>
            <input
              type="password"
              placeholder="Votre mot de passe"
              style={inputStyle}
              value={form.password}
              onChange={(e) => setForm({...form, password: e.target.value})}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-md text-sm font-semibold disabled:opacity-50"
            style={{ background: 'var(--chr-btn)', color: 'var(--chr-btn-text)' }}
          >
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>

        <div style={{ borderTop: '1px solid var(--chr-border)', marginTop: '24px', paddingTop: '20px' }}>
          <p className="text-center text-sm" style={{ color: 'var(--chr-muted)' }}>
            Pas encore de compte ?{' '}
            <Link href="/auth/inscription" style={{ color: 'var(--chr-text)', fontWeight: '500' }}>
              S'inscrire
            </Link>
          </p>
        </div>

      </div>
    </main>
  )
}