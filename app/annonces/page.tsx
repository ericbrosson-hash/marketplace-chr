import Link from 'next/link'
import { supabase } from '@/lib/supabase'

export const revalidate = 0

const etatStyle: Record<string, { bg: string, color: string }> = {
  'Neuf':          { bg: 'var(--chr-etat-neuf-bg)', color: 'var(--chr-etat-neuf-text)' },
  'Très bon état': { bg: 'var(--chr-etat-tbe-bg)',  color: 'var(--chr-etat-tbe-text)' },
  'Bon état':      { bg: 'var(--chr-etat-be-bg)',   color: 'var(--chr-etat-be-text)' },
  'Correct':       { bg: 'var(--chr-etat-cor-bg)',  color: 'var(--chr-etat-cor-text)' },
  'Pour pièces':   { bg: 'var(--chr-etat-pie-bg)',  color: 'var(--chr-etat-pie-text)' },
}

export default async function Annonces() {
  const { data: annonces, error } = await supabase
    .from('annonces')
    .select('*')
    .eq('active', true)
    .order('created_at', { ascending: false })

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
            <Link href="/annonces" className="text-sm" style={{ color: '#fff' }}>Annonces</Link>
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

      {/* Hero bar */}
      <div style={{ background: '#fff', borderBottom: '1px solid var(--chr-border)' }}>
        <div className="max-w-6xl mx-auto px-6 py-5">
          <h1 className="text-xl font-semibold" style={{ color: 'var(--chr-text)' }}>
            Matériel CHR d'occasion
          </h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--chr-muted)' }}>
            {annonces?.length || 0} annonces disponibles entre professionnels
          </p>
        </div>
      </div>

      {/* Filtres */}
      <div style={{ background: 'var(--chr-bg)', borderBottom: '1px solid var(--chr-border)' }}>
        <div className="max-w-6xl mx-auto px-6 py-3 flex gap-2 flex-wrap">
          {["Tous", "Cuisson", "Réfrigération", "Laverie", "Préparation", "Mobilier", "Bar", "Caisse"].map((cat) => (
            <button
              key={cat}
              className="text-xs font-medium px-3 py-1.5 rounded-full border"
              style={{ background: '#fff', borderColor: 'var(--chr-border)', color: '#555' }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Contenu */}
      <div className="max-w-6xl mx-auto px-6 py-6">

        {error && (
          <p className="text-sm" style={{ color: 'var(--chr-etat-pie-text)' }}>
            Erreur de chargement des annonces
          </p>
        )}

        {annonces?.length === 0 && (
          <div className="text-center py-24" style={{ color: 'var(--chr-muted)' }}>
            <p className="text-lg font-medium mb-4">Aucune annonce pour le moment</p>
            <Link
              href="/publier"
              className="text-sm font-semibold px-6 py-2.5 rounded-md inline-block"
              style={{ background: 'var(--chr-btn)', color: 'var(--chr-btn-text)' }}
            >
              Publier la première annonce
            </Link>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {annonces?.map((annonce) => {
            const etat = etatStyle[annonce.etat] || { bg: 'var(--chr-bg)', color: '#555' }
            return (
              <Link
                key={annonce.id}
                href={`/annonces/${annonce.id}`}
                className="block rounded-xl overflow-hidden transition-shadow hover:shadow-md"
                style={{ background: 'var(--chr-card)', border: '1px solid var(--chr-border)' }}
              >
                {/* Zone photo */}
                <div
                  className="h-36 flex items-center justify-center text-xs"
                  style={{ background: 'var(--chr-bg)', borderBottom: '1px solid var(--chr-border)', color: '#C0BDB7' }}
                >
                  Aucune photo
                </div>

                <div className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className="text-xs font-medium px-2 py-0.5 rounded"
                      style={{ background: 'var(--chr-bg)', color: '#555', border: '1px solid var(--chr-border)' }}
                    >
                      {annonce.categorie}
                    </span>
                    <span
                      className="text-xs font-medium px-2 py-0.5 rounded"
                      style={{ background: etat.bg, color: etat.color }}
                    >
                      {annonce.etat}
                    </span>
                  </div>

                  <h3 className="font-semibold text-sm mb-1 leading-snug" style={{ color: 'var(--chr-text)' }}>
                    {annonce.titre}
                  </h3>

                  <p className="text-xs mb-3 line-clamp-2" style={{ color: 'var(--chr-muted)' }}>
                    {annonce.description}
                  </p>

                  <div
                    className="flex items-center justify-between pt-3"
                    style={{ borderTop: '1px solid var(--chr-border)' }}
                  >
                    <div>
                      <span className="text-lg font-semibold" style={{ color: 'var(--chr-text)' }}>
                        {Number(annonce.prix).toLocaleString('fr-FR')} €
                      </span>
                      <p className="text-xs mt-0.5" style={{ color: 'var(--chr-muted)' }}>📍 {annonce.ville}</p>
                    </div>
                    <span
                      className="text-xs font-medium px-3 py-1.5 rounded-md"
                      style={{ background: 'var(--chr-btn)', color: 'var(--chr-btn-text)' }}
                    >
                      Voir →
                    </span>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </main>
  )
}