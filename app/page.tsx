import Link from 'next/link'

export default function Home() {
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
              href="/auth/connexion"
              className="text-sm"
              style={{ color: '#999' }}
            >
              Connexion
            </Link>
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

      {/* Hero */}
      <section style={{ background: '#fff', borderBottom: '1px solid var(--chr-border)' }}>
        <div className="max-w-6xl mx-auto px-6 py-24 text-center">
          <p
            className="text-xs font-semibold uppercase tracking-widest mb-4"
            style={{ color: 'var(--chr-accent)' }}
          >
            Marketplace B2B
          </p>
          <h1 className="text-4xl font-semibold mb-4 leading-tight" style={{ color: 'var(--chr-text)' }}>
            Le marché du matériel<br />de restauration professionnel
          </h1>
          <p className="text-lg mb-8 max-w-xl mx-auto" style={{ color: 'var(--chr-muted)' }}>
            Achetez et vendez du matériel CHR d'occasion entre professionnels
          </p>
          <div className="flex items-center justify-center gap-3">
            <Link
              href="/annonces"
              className="text-sm font-semibold px-6 py-3 rounded-md"
              style={{ background: 'var(--chr-btn)', color: 'var(--chr-btn-text)' }}
            >
              Voir les annonces
            </Link>
            <Link
              href="/publier"
              className="text-sm font-semibold px-6 py-3 rounded-md"
              style={{ background: 'var(--chr-bg)', color: 'var(--chr-text)', border: '1px solid var(--chr-border)' }}
            >
              Publier une annonce
            </Link>
          </div>
        </div>
      </section>

      {/* Catégories */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <p
          className="text-xs font-semibold uppercase tracking-widest mb-2 text-center"
          style={{ color: 'var(--chr-muted)' }}
        >
          Parcourir par catégorie
        </p>
        <h2 className="text-xl font-semibold text-center mb-8" style={{ color: 'var(--chr-text)' }}>
          Toutes les catégories
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { nom: "Cuisson",       emoji: "🔥" },
            { nom: "Réfrigération", emoji: "❄️" },
            { nom: "Laverie",       emoji: "🫧" },
            { nom: "Préparation",   emoji: "🔪" },
            { nom: "Mobilier",      emoji: "🪑" },
            { nom: "Bar",           emoji: "🍺" },
            { nom: "Caisse",        emoji: "💳" },
            { nom: "Autre",         emoji: "📦" },
          ].map((cat) => (
            <Link
              key={cat.nom}
              href={`/annonces`}
              className="rounded-xl p-5 text-center transition-shadow hover:shadow-sm"
              style={{ background: 'var(--chr-card)', border: '1px solid var(--chr-border)' }}
            >
              <div className="text-3xl mb-2">{cat.emoji}</div>
              <div className="text-sm font-medium" style={{ color: 'var(--chr-text)' }}>{cat.nom}</div>
            </Link>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid var(--chr-border)' }}>
        <div className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--chr-accent)' }}></span>
            <span className="text-xs font-semibold" style={{ color: 'var(--chr-text)' }}>CHR Occasion</span>
          </div>
          <p className="text-xs" style={{ color: 'var(--chr-muted)' }}>
            Marketplace de matériel professionnel entre pros
          </p>
        </div>
      </footer>

    </main>
  )
}