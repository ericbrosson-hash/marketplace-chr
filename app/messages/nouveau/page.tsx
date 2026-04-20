'use client'
import { Suspense } from 'react'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter, useSearchParams } from 'next/navigation'
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
  resize: 'vertical' as const,
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

function NouveauMessageForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const vendeurId = searchParams.get('vendeur')
  const annonceId = searchParams.get('annonce')

  const [userId, setUserId] = useState<string | null>(null)
  const [annonce, setAnnonce] = useState<any>(null)
  const [contenu, setContenu] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/auth/connexion'); return }
      setUserId(user.id)

      if (annonceId) {
        const { data } = await supabase
          .from('annonces')
          .select('titre, ville, prix')
          .eq('id', annonceId)
          .single()
        setAnnonce(data)
      }
    }
    init()
  }, [router, annonceId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!userId || !vendeurId || !annonceId) return
    setLoading(true)

    const { error } = await supabase
      .from('messages')
      .insert([{
        annonce_id: annonceId,
        expediteur_id: userId,
        destinataire_id: vendeurId,
        contenu,
      }])

    setLoading(false)

    if (error) {
      alert('Erreur : ' + error.message)
    } else {
      router.push('/messages')
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-8">

      <div className="mb-6">
        <h1 className="text-xl font-semibold" style={{ color: 'var(--chr-text)' }}>
          Contacter le vendeur
        </h1>
        <p className="text-sm mt-1" style={{ color: 'var(--chr-muted)' }}>
          Votre message sera transmis directement au vendeur
        </p>
      </div>

      {/* Annonce concernée */}
      {annonce && (
        <div
          className="rounded-xl p-4 mb-6"
          style={{ background: 'var(--chr-card)', border: '1px solid var(--chr-border)' }}
        >
          <p className="text-xs font-medium uppercase tracking-wider mb-1" style={{ color: 'var(--chr-muted)' }}>
            Annonce concernée
          </p>
          <p className="font-semibold text-sm" style={{ color: 'var(--chr-text)' }}>{annonce.titre}</p>
          <p className="text-xs mt-0.5" style={{ color: 'var(--chr-muted)' }}>
            📍 {annonce.ville} — {Number(annonce.prix).toLocaleString('fr-FR')} €
          </p>
        </div>
      )}

      <div
        className="rounded-xl p-6 space-y-4"
        style={{ background: 'var(--chr-card)', border: '1px solid var(--chr-border)' }}
      >
        <div>
          <label style={labelStyle}>Votre message *</label>
          <textarea
            rows={5}
            placeholder="Bonjour, je suis intéressé par votre annonce..."
            style={inputStyle}
            value={contenu}
            onChange={(e) => setContenu(e.target.value)}
            required
          />
        </div>

        <div style={{ borderTop: '1px solid var(--chr-border)', paddingTop: '16px' }}>
          <button
            type="button"
            onClick={handleSubmit as any}
            disabled={loading}
            className="w-full py-3 rounded-md text-sm font-semibold disabled:opacity-50"
            style={{ background: 'var(--chr-btn)', color: 'var(--chr-btn-text)' }}
          >
            {loading ? 'Envoi en cours...' : 'Envoyer le message'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function NouveauMessage() {
  return (
    <main className="min-h-screen" style={{ background: 'var(--chr-bg)' }}>
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
      <Suspense fallback={
        <div className="text-center py-20 text-sm" style={{ color: 'var(--chr-muted)' }}>
          Chargement...
        </div>
      }>
        <NouveauMessageForm />
      </Suspense>
    </main>
  )
}