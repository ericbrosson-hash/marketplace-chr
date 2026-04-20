import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { notFound } from 'next/navigation'

const etatStyle: Record<string, { bg: string, color: string }> = {
  'Neuf':          { bg: 'var(--chr-etat-neuf-bg)', color: 'var(--chr-etat-neuf-text)' },
  'Très bon état': { bg: 'var(--chr-etat-tbe-bg)',  color: 'var(--chr-etat-tbe-text)' },
  'Bon état':      { bg: 'var(--chr-etat-be-bg)',   color: 'var(--chr-etat-be-text)' },
  'Correct':       { bg: 'var(--chr-etat-cor-bg)',  color: 'var(--chr-etat-cor-text)' },
  'Pour pièces':   { bg: 'var(--chr-etat-pie-bg)',  color: 'var(--chr-etat-pie-text)' },
}

export default async function AnnonceDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const { data: annonce, error } = await supabase
    .from('annonces')
    .select(`*, profiles (id, nom, ville, telephone)`)
    .eq('id', id)
    .single()

  if (error || !annonce) notFound()

  const etat = etatStyle[annonce.etat] || { bg: 'var(--chr-bg)', color: 'var(--chr-muted)' }

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

      <div className="max-w-4xl mx-auto px-6 py-8">

        {/* Fil d'ariane */}
        <div className="flex items-center gap-2 text-xs mb-6" style={{ color: 'var(--chr-muted)' }}>
          <Link href="/annonces" style={{ color: 'var(--chr-muted)' }}>Annonces</Link>
          <span>›</span>
          <span style={{ color: 'var(--chr-text)' }}>{annonce.titre}</span>
        </div>

        <div className="rounded-xl overflow-hidden" style={{ background: 'var(--chr-card)', border: '1px solid var(--chr-border)' }}>

          {/* Zone photo */}
          <div
            className="h-64 flex items-center justify-center text-sm"
            style={{ background: 'var(--chr-bg)', borderBottom: '1px solid var(--chr-border)', color: '#C0BDB7' }}
          >
            Aucune photo
          </div>

          <div className="p-8">

            {/* Badges */}
            <div className="flex gap-2 mb-4">
              <span
                className="text-xs font-medium px-2.5 py-1 rounded"
                style={{ background: 'var(--chr-bg)', color: '#555', border: '1px solid var(--chr-border)' }}
              >
                {annonce.categorie}
              </span>
              <span
                className="text-xs font-medium px-2.5 py-1 rounded"
                style={{ background: etat.bg, color: etat.color }}
              >
                {annonce.etat}
              </span>
            </div>

            {/* Titre */}
            <h1 className="text-2xl font-semibold mb-3" style={{ color: 'var(--chr-text)' }}>
              {annonce.titre}
            </h1>

            {/* Prix */}
            <p className="text-3xl font-semibold mb-4" style={{ color: 'var(--chr-text)' }}>
              {Number(annonce.prix).toLocaleString('fr-FR')} €
            </p>

            {/* Localisation + date */}
            <div className="flex gap-6 text-sm mb-8" style={{ color: 'var(--chr-muted)' }}>
              <span>📍 {annonce.ville}</span>
              <span>🗓 {new Date(annonce.created_at).toLocaleDateString('fr-FR')}</span>
            </div>

            {/* Séparateur */}
            <div style={{ borderTop: '1px solid var(--chr-border)' }} className="mb-8" />

            {/* Description */}
            <div className="mb-8">
              <h2 className="text-sm font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--chr-muted)' }}>
                Description
              </h2>
              <p className="text-sm leading-relaxed whitespace-pre-line" style={{ color: 'var(--chr-text)' }}>
                {annonce.description || 'Aucune description fournie.'}
              </p>
            </div>

            {/* Vendeur */}
            {annonce.profiles && (
              <div
                className="flex items-center justify-between p-5 rounded-xl"
                style={{ background: 'var(--chr-bg)', border: '1px solid var(--chr-border)' }}
              >
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider mb-1" style={{ color: 'var(--chr-muted)' }}>
                    Vendeur
                  </p>
                  <p className="font-semibold text-sm" style={{ color: 'var(--chr-text)' }}>
                    {annonce.profiles.nom || 'Pro CHR'}
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--chr-muted)' }}>
                    📍 {annonce.profiles.ville || annonce.ville}
                  </p>
                </div>
                <Link
                  href={`/messages/nouveau?vendeur=${annonce.profiles.id}&annonce=${annonce.id}`}
                  className="text-sm font-semibold px-5 py-2.5 rounded-md"
                  style={{ background: 'var(--chr-btn)', color: 'var(--chr-btn-text)' }}
                >
                  Contacter le vendeur
                </Link>
              </div>
            )}

          </div>
        </div>
      </div>
    </main>
  )
}