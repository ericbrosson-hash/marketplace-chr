'use client'
import { useState } from 'react'
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

export default function Estimer() {
  const [form, setForm] = useState({
    materiel: '',
    marque: '',
    etat: '',
    age: '',
    description: '',
  })
  const [resultat, setResultat] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleEstimer = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setResultat(null)

    const prompt = `Tu es un expert en matériel de restauration professionnelle d'occasion (CHR). 
Un professionnel souhaite estimer le prix de vente de son matériel.

Voici les informations :
- Matériel : ${form.materiel}
- Marque : ${form.marque || 'Non précisée'}
- État : ${form.etat}
- Âge approximatif : ${form.age || 'Non précisé'}
- Description : ${form.description || 'Aucune'}

Donne une estimation de prix de revente en France pour ce matériel d'occasion entre professionnels.
Réponds avec :
1. Une fourchette de prix réaliste (ex: 800€ - 1200€)
2. Le prix recommandé pour une vente rapide
3. 2-3 conseils courts pour maximiser la valeur à la revente

Sois concis et pratique.`

    try {
      const response = await fetch('/api/estimer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      })
      const data = await response.json()
      setResultat(data.text)
    } catch (err) {
      setResultat("Erreur lors de l'estimation. Réessaie.")
    }

    setLoading(false)
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
            <Link href="/estimer" className="text-sm" style={{ color: '#fff' }}>Estimer</Link>
            <Link href="/messages" className="text-sm" style={{ color: '#999' }}>Messages</Link>
            <Link
              href="/publier"
              className="text-sm font-semibold px-4 py-1.5 rounded-md"
              style={{ background: 'var(--chr-accent)', color: 'var(--chr-accent-text)' }}
            >
              Publier une annonce
            </Link>
          </nav>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-6 py-8">

        <div className="mb-6">
          <h1 className="text-xl font-semibold" style={{ color: 'var(--chr-text)' }}>Estimation IA</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--chr-muted)' }}>
            Obtenez une estimation de prix pour votre matériel CHR d'occasion
          </p>
        </div>

        <div
          className="rounded-xl p-6 space-y-5"
          style={{ background: 'var(--chr-card)', border: '1px solid var(--chr-border)' }}
        >

          <div>
            <label style={labelStyle}>Type de matériel *</label>
            <input
              type="text"
              placeholder="Ex: Four à convection, Lave-vaisselle professionnel..."
              style={inputStyle}
              value={form.materiel}
              onChange={(e) => setForm({...form, materiel: e.target.value})}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label style={labelStyle}>Marque / Modèle</label>
              <input
                type="text"
                placeholder="Ex: Rational SCC61..."
                style={inputStyle}
                value={form.marque}
                onChange={(e) => setForm({...form, marque: e.target.value})}
              />
            </div>
            <div>
              <label style={labelStyle}>Âge approximatif</label>
              <input
                type="text"
                placeholder="Ex: 2 ans, 5 ans..."
                style={inputStyle}
                value={form.age}
                onChange={(e) => setForm({...form, age: e.target.value})}
              />
            </div>
          </div>

          <div>
            <label style={labelStyle}>État *</label>
            <select
              style={inputStyle}
              value={form.etat}
              onChange={(e) => setForm({...form, etat: e.target.value})}
              required
            >
              <option value="">Choisir l'état</option>
              <option value="Neuf">Neuf</option>
              <option value="Très bon état">Très bon état</option>
              <option value="Bon état">Bon état</option>
              <option value="Correct">Correct</option>
              <option value="Pour pièces">Pour pièces</option>
            </select>
          </div>

          <div>
            <label style={labelStyle}>Description complémentaire</label>
            <textarea
              rows={3}
              placeholder="Historique, entretien, accessoires inclus..."
              style={{ ...inputStyle, resize: 'vertical' }}
              value={form.description}
              onChange={(e) => setForm({...form, description: e.target.value})}
            />
          </div>

          <div style={{ borderTop: '1px solid var(--chr-border)', paddingTop: '16px' }}>
            <button
              type="button"
              onClick={handleEstimer as any}
              disabled={loading}
              className="w-full py-3 rounded-md text-sm font-semibold disabled:opacity-50"
              style={{ background: 'var(--chr-btn)', color: 'var(--chr-btn-text)' }}
            >
              {loading ? 'Analyse en cours...' : 'Estimer le prix'}
            </button>
          </div>
        </div>

        {/* Résultat */}
        {resultat && (
          <div
            className="mt-4 rounded-xl p-6"
            style={{
              background: 'var(--chr-card)',
              border: '1px solid var(--chr-border)',
              borderLeft: '3px solid var(--chr-accent)',
            }}
          >
            <p
              className="text-xs font-medium uppercase tracking-wider mb-3"
              style={{ color: 'var(--chr-muted)' }}
            >
              Estimation IA
            </p>
            <div
              className="text-sm leading-relaxed whitespace-pre-line"
              style={{ color: 'var(--chr-text)' }}
            >
              {resultat}
            </div>
            <div
              className="mt-4 pt-4"
              style={{ borderTop: '1px solid var(--chr-border)' }}
            >
              <Link
                href="/publier"
                className="text-sm font-semibold px-5 py-2 rounded-md inline-block"
                style={{ background: 'var(--chr-btn)', color: 'var(--chr-btn-text)' }}
              >
                Publier mon annonce →
              </Link>
            </div>
          </div>
        )}

      </div>
    </main>
  )
}