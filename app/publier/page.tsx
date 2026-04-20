'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

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

export default function Publier() {
  const router = useRouter()
  const [userId, setUserId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    titre: '',
    categorie: '',
    etat: '',
    prix: '',
    ville: '',
    description: '',
  })

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/auth/connexion')
      } else {
        setUserId(user.id)
      }
    }
    getUser()
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!userId) return
    setLoading(true)

    const { error } = await supabase
      .from('annonces')
      .insert([{
        titre: form.titre,
        categorie: form.categorie,
        etat: form.etat,
        prix: Number(form.prix),
        ville: form.ville,
        description: form.description,
        vendeur_id: userId,
      }])

    setLoading(false)

    if (error) {
      alert('Erreur : ' + error.message)
    } else {
      router.push('/annonces')
    }
  }

  return (
    <main className="min-h-screen" style={{ background: 'var(--chr-bg)' }}>

      {/* Navbar */}
      <header style={{ background: 'var(--chr-navbar)' }}>
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full" style={{ background: 'var(--chr-accent)' }}></span>
            <span className="text-sm font-semibold" style={{ color: 'var(--chr-text-inverse)' }}>CHR Occasion</span>
          </Link>
          <nav className="flex items-center gap-6">
            <Link href="/annonces" className="text-sm" style={{ color: '#999' }}>Annonces</Link>
            <Link href="/estimer" className="text-sm" style={{ color: '#999' }}>Estimer</Link>
            <Link href="/messages" className="text-sm" style={{ color: '#999' }}>Messages</Link>
          </nav>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-6 py-8">

        {/* En-tête */}
        <div className="mb-6">
          <h1 className="text-xl font-semibold" style={{ color: 'var(--chr-text)' }}>
            Publier une annonce
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--chr-muted)' }}>
            Votre annonce sera visible par tous les professionnels CHR
          </p>
        </div>

        <div
          className="rounded-xl p-6 space-y-5"
          style={{ background: 'var(--chr-card)', border: '1px solid var(--chr-border)' }}
        >

          <div>
            <label style={labelStyle}>Titre de l'annonce *</label>
            <input
              type="text"
              placeholder="Ex: Four Rational SCC61 occasion"
              style={inputStyle}
              value={form.titre}
              onChange={(e) => setForm({...form, titre: e.target.value})}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label style={labelStyle}>Catégorie *</label>
              <select
                style={inputStyle}
                value={form.categorie}
                onChange={(e) => setForm({...form, categorie: e.target.value})}
                required
              >
                <option value="">Choisir</option>
                <option value="Cuisson">🔥 Cuisson</option>
                <option value="Réfrigération">❄️ Réfrigération</option>
                <option value="Laverie">🫧 Laverie</option>
                <option value="Préparation">🔪 Préparation</option>
                <option value="Mobilier">🪑 Mobilier</option>
                <option value="Bar">🍺 Bar</option>
                <option value="Caisse">💳 Caisse</option>
                <option value="Autre">📦 Autre</option>
              </select>
            </div>

            <div>
              <label style={labelStyle}>État *</label>
              <select
                style={inputStyle}
                value={form.etat}
                onChange={(e) => setForm({...form, etat: e.target.value})}
                required
              >
                <option value="">Choisir</option>
                <option value="Neuf">Neuf</option>
                <option value="Très bon état">Très bon état</option>
                <option value="Bon état">Bon état</option>
                <option value="Correct">Correct</option>
                <option value="Pour pièces">Pour pièces</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label style={labelStyle}>Prix (€) *</label>
              <input
                type="number"
                placeholder="Ex: 2500"
                style={inputStyle}
                value={form.prix}
                onChange={(e) => setForm({...form, prix: e.target.value})}
                required
              />
            </div>

            <div>
              <label style={labelStyle}>Ville *</label>
              <input
                type="text"
                placeholder="Ex: Lyon"
                style={inputStyle}
                value={form.ville}
                onChange={(e) => setForm({...form, ville: e.target.value})}
                required
              />
            </div>
          </div>

          <div>
            <label style={labelStyle}>Description</label>
            <textarea
              placeholder="Décrivez l'état, l'historique, les dimensions..."
              rows={4}
              style={{ ...inputStyle, resize: 'vertical' }}
              value={form.description}
              onChange={(e) => setForm({...form, description: e.target.value})}
            />
          </div>

          <div style={{ borderTop: '1px solid var(--chr-border)', paddingTop: '20px' }}>
            <button
              type="button"
              onClick={handleSubmit as any}
              disabled={loading || !userId}
              className="w-full py-3 rounded-md text-sm font-semibold disabled:opacity-50"
              style={{ background: 'var(--chr-btn)', color: 'var(--chr-btn-text)' }}
            >
              {loading ? 'Publication en cours...' : 'Publier l\'annonce'}
            </button>
          </div>

        </div>
      </div>
    </main>
  )
}