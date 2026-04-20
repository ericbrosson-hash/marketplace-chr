'use client'
import { useState } from 'react'
import Link from 'next/link'
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

export default function Inscription() {
  const [form, setForm] = useState({
    email: '',
    password: '',
    nom: '',
    entreprise: '',
    telephone: '',
    ville: '',
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ text: '', type: '' })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const { data, error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
    })

    if (error) {
      setMessage({ text: 'Erreur : ' + error.message, type: 'error' })
      setLoading(false)
      return
    }

    if (data.user) {
      await supabase.from('profiles').insert([{
        id: data.user.id,
        nom: form.nom,
        entreprise: form.entreprise,
        telephone: form.telephone,
        ville: form.ville,
      }])
      setMessage({ text: 'Compte créé ! Vérifiez votre email pour confirmer.', type: 'success' })
    }
    setLoading(false)
  }

  return (
    <main
      className="min-h-screen flex items-center justify-center py-10"
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

        <h1 className="text-xl font-semibold text-center mb-2" style={{ color: 'var(--chr-text)' }}>
          Créer un compte professionnel
        </h1>
        <p className="text-center text-sm mb-6" style={{ color: 'var(--chr-muted)' }}>
          Réservé aux professionnels de la restauration
        </p>

        {message.text && (
          <div
            className="p-3 rounded-md text-sm mb-4"
            style={{
              background: message.type === 'error' ? 'var(--chr-etat-pie-bg)' : 'var(--chr-etat-tbe-bg)',
              color: message.type === 'error' ? 'var(--chr-etat-pie-text)' : 'var(--chr-etat-tbe-text)',
            }}
          >
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label style={labelStyle}>Nom complet *</label>
              <input
                type="text"
                placeholder="Jean Dupont"
                style={inputStyle}
                value={form.nom}
                onChange={(e) => setForm({...form, nom: e.target.value})}
                required
              />
            </div>
            <div>
              <label style={labelStyle}>Ville *</label>
              <input
                type="text"
                placeholder="Lyon"
                style={inputStyle}
                value={form.ville}
                onChange={(e) => setForm({...form, ville: e.target.value})}
                required
              />
            </div>
          </div>

          <div>
            <label style={labelStyle}>Entreprise *</label>
            <input
              type="text"
              placeholder="Restaurant Le Provençal"
              style={inputStyle}
              value={form.entreprise}
              onChange={(e) => setForm({...form, entreprise: e.target.value})}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
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
              <label style={labelStyle}>Téléphone</label>
              <input
                type="tel"
                placeholder="06 12 34 56 78"
                style={inputStyle}
                value={form.telephone}
                onChange={(e) => setForm({...form, telephone: e.target.value})}
              />
            </div>
          </div>

          <div>
            <label style={labelStyle}>Mot de passe *</label>
            <input
              type="password"
              placeholder="Minimum 6 caractères"
              style={inputStyle}
              value={form.password}
              onChange={(e) => setForm({...form, password: e.target.value})}
              required
              minLength={6}
            />
          </div>

          <div style={{ paddingTop: '4px' }}>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-md text-sm font-semibold disabled:opacity-50"
              style={{ background: 'var(--chr-btn)', color: 'var(--chr-btn-text)' }}
            >
              {loading ? 'Création...' : 'Créer mon compte'}
            </button>
          </div>
        </form>

        <div style={{ borderTop: '1px solid var(--chr-border)', marginTop: '24px', paddingTop: '20px' }}>
          <p className="text-center text-sm" style={{ color: 'var(--chr-muted)' }}>
            Déjà un compte ?{' '}
            <Link href="/auth/connexion" style={{ color: 'var(--chr-text)', fontWeight: '500' }}>
              Se connecter
            </Link>
          </p>
        </div>

      </div>
    </main>
  )
}